package com.springboot.MyTodoList.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

@Service
public class GeminiAiService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public GeminiAiService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public String askGemini(String promptText) {
        String fullUrl = geminiApiUrl + geminiApiKey;

        try {
            // 1. Build the Gemini JSON Request Body
            ObjectNode requestBody = objectMapper.createObjectNode();
            ArrayNode contents = requestBody.putArray("contents");
            ObjectNode contentObj = contents.addObject();
            ArrayNode parts = contentObj.putArray("parts");
            ObjectNode textObj = parts.addObject();
            textObj.put("text", promptText);

            // 2. Set Headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> requestEntity = new HttpEntity<>(requestBody.toString(), headers);

            // 3. Make the API Call to Google
            JsonNode response = restTemplate.postForObject(fullUrl, requestEntity, JsonNode.class);

            // 4. Extract the text from Google's JSON response
            if (response != null && response.has("candidates")) {
                return response.get("candidates").get(0)
                        .get("content").get("parts").get(0)
                        .get("text").asText();
            }
            return "Sorry, Gemini didn't return a valid response.";

        } catch (Exception e) {
            System.err.println("❌ Error calling Gemini: " + e.getMessage());
            return "My AI brain is currently offline. Error: " + e.getMessage();
        }
    }
}
