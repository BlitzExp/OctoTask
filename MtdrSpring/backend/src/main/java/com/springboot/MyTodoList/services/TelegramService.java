package com.springboot.MyTodoList.services;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class TelegramService {

    private final String BOT_TOKEN = "8438425753:AAEiLJV5sb8pH6Whrrcn0aoLB-N_bWcaDME"; 
    private final String TELEGRAM_API_URL = "https://api.telegram.org/bot" + BOT_TOKEN + "/sendMessage";
    
    private final RestTemplate restTemplate;

    public TelegramService() {
        this.restTemplate = new RestTemplate();
    }

    // This method sends a message BACK to the user's phone
    public void sendMessage(Long chatId, String textToSend) {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("chat_id", chatId);
        requestBody.put("text", textToSend);

        try {
            // Makes the HTTP POST request to Telegram's servers
            restTemplate.postForObject(TELEGRAM_API_URL, requestBody, String.class);
            System.out.println("✅ Message sent back to user successfully!");
        } catch (Exception e) {
            System.err.println("❌ Failed to send message: " + e.getMessage());
        }
    }
}