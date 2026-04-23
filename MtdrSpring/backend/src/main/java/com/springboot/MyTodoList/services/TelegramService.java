package com.springboot.MyTodoList.services;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class TelegramService {

    @Value("${telegram.bot.token}")
    private String botToken;

    private final RestTemplate restTemplate;

    public TelegramService() {
        this.restTemplate = new RestTemplate();
    }

    public void sendMessage(Long chatId, String textToSend) {
        
        String telegramApiUrl = "https://api.telegram.org/bot" + botToken + "/sendMessage";

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("chat_id", chatId);
        requestBody.put("text", textToSend);

        try {
            restTemplate.postForObject(telegramApiUrl, requestBody, String.class);
            System.out.println("✅ Message sent back to user successfully!");
        } catch (Exception e) {
            System.err.println("❌ Failed to send message: " + e.getMessage());
        }
    }
}