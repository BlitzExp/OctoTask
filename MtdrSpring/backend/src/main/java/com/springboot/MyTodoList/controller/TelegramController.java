package com.springboot.MyTodoList.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;
import com.springboot.MyTodoList.services.BotOrchestratorService;

@RestController
@RequestMapping("/api/telegram")
public class TelegramController {

    private final BotOrchestratorService orchestratorService;

    public TelegramController(BotOrchestratorService orchestratorService) {
        this.orchestratorService = orchestratorService;
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleTelegramUpdate(@RequestBody JsonNode payload) {
        if (payload.has("message") && payload.get("message").has("text")) {
            Long chatId = payload.get("message").get("chat").get("id").asLong();
            String userText = payload.get("message").get("text").asText();
            
            // Pass the data to the Orchestrator!
            orchestratorService.processIncomingMessage(chatId, userText);
        }
        return ResponseEntity.ok("OK");
    }
}