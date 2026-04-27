package com.springboot.MyTodoList.services;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.springboot.MyTodoList.services.botTools.BotTool;

@Service
public class BotOrchestratorService {

    private final GeminiAiService geminiAiService;
    private final TelegramService telegramService;
    private final ObjectMapper objectMapper;
    
    private final Map<String, BotTool> toolsMap;

    public BotOrchestratorService(GeminiAiService geminiAiService, 
                                  TelegramService telegramService, 
                                  List<BotTool> allTools,
                                  ObjectMapper objectMapper) { 
        
        this.geminiAiService = geminiAiService;
        this.telegramService = telegramService;
        
        this.objectMapper = objectMapper; 
        
        this.toolsMap = allTools.stream()
                .collect(Collectors.toMap(BotTool::getToolName, Function.identity()));
    }

    public void processIncomingMessage(Long chatId, String userText) {
        System.out.println("🧠 Orchestrator received: " + userText);
        
        String aiResponse = geminiAiService.askGemini(userText);
        
        if (aiResponse.startsWith("TOOL_REQUESTED|")) {
            String[] parts = aiResponse.split("\\|");
            String functionName = parts[1];
            String argumentsJson = parts[2];
            
            try {
                // 1. Look up the requested tool in our Map
                BotTool selectedTool = toolsMap.get(functionName);
                
                if (selectedTool == null) {
                    telegramService.sendMessage(chatId, "I wanted to use the '" + functionName + "' tool, but it doesn't exist in my Java code yet!");
                    return;
                }
                
                // 2. Parse the arguments Google sent us
                JsonNode args = objectMapper.readTree(argumentsJson);
                
                // 3. Execute the specific tool's logic
                Object rawDbData = selectedTool.execute(args);
                
                // 🌟 THE FIX: Convert Java memory objects into a readable JSON string!
                String jsonDatabaseData = objectMapper.writeValueAsString(rawDbData);
                
                // 4. Send the real JSON text back to Gemini for formatting
                System.out.println("🧠 Sending this to Gemini: " + jsonDatabaseData);
                String finalFriendlyAnswer = geminiAiService.summarizeData(userText, jsonDatabaseData);
                
                // 5. Send to User
                telegramService.sendMessage(chatId, finalFriendlyAnswer);
                
            } catch (Exception e) {
                telegramService.sendMessage(chatId, "❌ Database error: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            // Normal chat text
            telegramService.sendMessage(chatId, aiResponse);
        }
    }
}