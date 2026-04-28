package com.springboot.MyTodoList.services;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
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

    // 🧠 THE MEMORY BANK: Stores the short-term chat history for each Telegram User ID
    private final Map<Long, String> chatMemory = new ConcurrentHashMap<>();

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
        
        // 1. Fetch the user's short-term memory (or start blank)
        String pastConversation = chatMemory.getOrDefault(chatId, "");

        // 2. Inject the history into the prompt
        String memoryAwarePrompt = "Previous Conversation Context:\n" + pastConversation + 
                                   "\n\nThe user's newest message is: '" + userText + "'";
        
        // 3. Ask Gemini
        String aiResponse = geminiAiService.askGemini(memoryAwarePrompt);
        
        // 4. Update the memory with the latest interaction
        String textToRemember = "User said: " + userText + "\nBot thought: " + aiResponse + "\n";
        String newHistory = pastConversation + textToRemember;
        
        // ✂️ TOKEN SAVER: Keep only the last 200 characters of context
        if (newHistory.length() > 200) {
            newHistory = newHistory.substring(newHistory.length() - 200);
        }
        chatMemory.put(chatId, newHistory);
        
        if (aiResponse.startsWith("TOOL_REQUESTED|")) {
            String[] parts = aiResponse.split("\\|");
            String functionName = parts[1];
            String argumentsJson = parts[2];
            
            System.out.println("🤖 AI DECISION: Gemini chose the tool [" + functionName + "] with arguments: " + argumentsJson);
            
            try {
                // Look up the requested tool
                BotTool selectedTool = toolsMap.get(functionName);
                
                if (selectedTool == null) {
                    telegramService.sendMessage(chatId, "I wanted to use the '" + functionName + "' tool, but it doesn't exist in my Java code yet!");
                    return;
                }
                
                // Parse arguments
                JsonNode args = objectMapper.readTree(argumentsJson);
                
                // Execute tool
                Object rawDbData = selectedTool.execute(args);
                
                // Convert DB objects to JSON
                String jsonDatabaseData = objectMapper.writeValueAsString(rawDbData);
                
                // Send JSON back to Gemini for formatting
                System.out.println("🧠 Sending this to Gemini: " + jsonDatabaseData);
                String finalFriendlyAnswer = geminiAiService.summarizeData(userText, jsonDatabaseData);
                
                // Add the final formatted answer to the memory buffer as well
                String historyWithReply = chatMemory.get(chatId) + "Bot replied: " + finalFriendlyAnswer + "\n";
                if (historyWithReply.length() > 200) {
                    historyWithReply = historyWithReply.substring(historyWithReply.length() - 200);
                }
                chatMemory.put(chatId, historyWithReply);
                
                // Send to User
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