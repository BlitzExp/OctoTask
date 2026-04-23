package com.springboot.MyTodoList.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.springboot.MyTodoList.services.TelegramService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/telegram")
public class TelegramController {

    private final TelegramService telegramService;

    public TelegramController(TelegramService telegramService) {
        this.telegramService = telegramService;
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleTelegramUpdate(@RequestBody JsonNode payload) {
        System.out.println("📨 Received payload from Telegram: " + payload.toString());

        // We use JsonNode to easily dig through the JSON without creating 10 model classes
        if (payload.has("message") && payload.get("message").has("text")) {
            
            // 1. Extract the Chat ID (who we need to reply to)
            Long chatId = payload.get("message").get("chat").get("id").asLong();
            
            // 2. Extract the text they sent
            String userText = payload.get("message").get("text").asText();
            
            System.out.println("👤 User said: " + userText);

            // 3. Send an automated reply back to prove it works!
            String replyText = "Beep boop 🤖! I received your message: '" + userText + "'";
            telegramService.sendMessage(chatId, replyText);
        }

        // ⚠️ CRITICAL: Always return 200 OK, otherwise Telegram will keep resending the same message forever.
        return ResponseEntity.ok("OK");
    }
}
