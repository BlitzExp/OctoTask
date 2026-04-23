package com.springboot.MyTodoList.services;

import org.springframework.stereotype.Service;

@Service
public class BotOrchestratorService {

    private final GeminiAiService geminiAiService;
    private final TelegramService telegramService;

    public BotOrchestratorService(GeminiAiService geminiAiService, TelegramService telegramService) {
        this.geminiAiService = geminiAiService;
        this.telegramService = telegramService;
    }

    public void processIncomingMessage(Long chatId, String userText) {
        System.out.println("🧠 Orchestrator received message: " + userText);
        
        // 1. Send the text to Gemini
        String aiResponse = geminiAiService.askGemini(userText);
        
        System.out.println("🤖 Gemini replied: " + aiResponse);

        // 2. Send Gemini's answer back to the user via Telegram
        telegramService.sendMessage(chatId, aiResponse);
    }
}
