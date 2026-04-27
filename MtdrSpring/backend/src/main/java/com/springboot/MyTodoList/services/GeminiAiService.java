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

    // 🧠 THE MAIN BRAIN: Reads user text and decides what tools to use
    public String askGemini(String promptText) {
        String fullUrl = geminiApiUrl + geminiApiKey;

        try {
            ObjectNode requestBody = objectMapper.createObjectNode();
            
            // 1. Add the User's Message
            requestBody.putArray("contents").addObject().putArray("parts").addObject().put("text", promptText);

            // 🧰 THE TOOLBOX: Tell Google exactly what our Java backend is capable of
            ArrayNode tools = requestBody.putArray("tools");
            ObjectNode toolObj = tools.addObject();
            ArrayNode functionDeclarations = toolObj.putArray("functionDeclarations");
            
            // --- TOOL 1: Get Tasks ---
            ObjectNode getTasksFunction = functionDeclarations.addObject();
            getTasksFunction.put("name", "get_team_tasks");
            getTasksFunction.put("description", "Fetches all pending and current tasks for a specific team.");
            ObjectNode getTasksParams = getTasksFunction.putObject("parameters");
            getTasksParams.put("type", "OBJECT");
            getTasksParams.putObject("properties").putObject("teamId").put("type", "INTEGER").put("description", "The ID of the team");
            getTasksParams.putArray("required").add("teamId");

            // --- TOOL 2: Get Team Members ---
            ObjectNode getTeamMembersFunction = functionDeclarations.addObject();
            getTeamMembersFunction.put("name", "get_team_members");
            getTeamMembersFunction.put("description", "Gets a list of all users or members belonging to a specific team.");
            ObjectNode getTeamMembersParams = getTeamMembersFunction.putObject("parameters");
            getTeamMembersParams.put("type", "OBJECT");
            getTeamMembersParams.putObject("properties").putObject("teamId").put("type", "INTEGER").put("description", "The ID of the team");
            getTeamMembersParams.putArray("required").add("teamId");

            // --- TOOL 3: Get Late Tasks By Sprint ---
            ObjectNode getLateSprintFunction = functionDeclarations.addObject();
            getLateSprintFunction.put("name", "get_late_tasks_by_sprint");
            getLateSprintFunction.put("description", "Fetches the number of LATE tasks for a specific team in a specific sprint.");
            ObjectNode getLateSprintParams = getLateSprintFunction.putObject("parameters");
            getLateSprintParams.put("type", "OBJECT");
            ObjectNode lateSprintProps = getLateSprintParams.putObject("properties");
            lateSprintProps.putObject("teamId").put("type", "INTEGER").put("description", "The ID of the team");
            lateSprintProps.putObject("sprintId").put("type", "INTEGER").put("description", "The ID of the sprint");
            getLateSprintParams.putArray("required").add("teamId").add("sprintId");

            // --- TOOL 4: Get User Tasks (UPGRADED TO USE NAMES) ---
            ObjectNode getUserTasksFunction = functionDeclarations.addObject();
            getUserTasksFunction.put("name", "get_user_tasks");
            getUserTasksFunction.put("description", "Fetches all tasks assigned to a specific user by their name.");
            ObjectNode getUserTasksParams = getUserTasksFunction.putObject("parameters");
            getUserTasksParams.put("type", "OBJECT");
            getUserTasksParams.putObject("properties").putObject("userName").put("type", "STRING").put("description", "The first name or full name of the user");
            getUserTasksParams.putArray("required").add("userName");

            // --- TOOL 5: Create a Task ---
            ObjectNode createTaskFunction = functionDeclarations.addObject();
            createTaskFunction.put("name", "create_task");
            createTaskFunction.put("description", "Creates a new task in the database. If you are missing required information, ask the user for it before calling this tool.");
            ObjectNode createTaskParams = createTaskFunction.putObject("parameters");
            createTaskParams.put("type", "OBJECT");
            ObjectNode taskProps = createTaskParams.putObject("properties");
            
            taskProps.putObject("name").put("type", "STRING").put("description", "A short title for the task");
            taskProps.putObject("description").put("type", "STRING").put("description", "A detailed description of the task");
            taskProps.putObject("assigneeId").put("type", "INTEGER").put("description", "The User ID of the person this task is assigned to");
            taskProps.putObject("sprintId").put("type", "INTEGER").put("description", "The Sprint ID this task belongs to");
            taskProps.putObject("priority").put("type", "INTEGER").put("description", "The priority level (e.g., 1, 2, 3)");
            taskProps.putObject("estimatedHours").put("type", "NUMBER").put("description", "Estimated hours to complete (Optional)");

            // Tell Gemini these 5 fields are strictly required before it can execute the tool
            createTaskParams.putArray("required").add("name").add("description").add("assigneeId").add("sprintId").add("priority");

            // 2. Make the API Call to Google
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> requestEntity = new HttpEntity<>(requestBody.toString(), headers);
            JsonNode response = restTemplate.postForObject(fullUrl, requestEntity, JsonNode.class);

            // 3. Extract Google's Decision (Did it use a tool or just chat?)
            if (response != null && response.has("candidates")) {
                JsonNode parts = response.get("candidates").get(0).get("content").get("parts").get(0);
                
                // If it wants to trigger one of our Strategy Pattern classes
                if (parts.has("functionCall")) {
                    String functionName = parts.get("functionCall").get("name").asText();
                    String args = parts.get("functionCall").get("args").toString();
                    return "TOOL_REQUESTED|" + functionName + "|" + args;
                } 
                // If it's just normal chat text
                else if (parts.has("text")) {
                    return parts.get("text").asText();
                }
            }
            return "Sorry, I couldn't process that.";

        } catch (Exception e) {
            System.err.println("❌ Error calling Gemini: " + e.getMessage());
            return "My AI brain is currently offline. Error: " + e.getMessage();
        }
    }

    // 🗣️ THE TRANSLATOR: Turns raw Oracle Database lists into friendly text messages
    public String summarizeData(String userOriginalQuestion, String rawDatabaseData) {
        String fullUrl = geminiApiUrl + geminiApiKey;
        try {
            String formattingPrompt = 
                "You are a strict data-reporting Telegram bot. " +
                "The user asked: '" + userOriginalQuestion + "'. " +
                "The database returned this raw data: " + rawDatabaseData + ". " +
                "Draft the exact, final text message to send back to the user. " +
                "STRICT RULES: \n" +
                "1. EXACT MATCH: You must use the EXACT task names, descriptions, and statuses exactly as they appear in the raw data. Do NOT reword, paraphrase, or summarize them.\n" +
                "2. NO TRUNCATION: You must list EVERY SINGLE item provided in the raw data. If the database returns 32 items, you must list all 32. Do NOT stop at 10, do NOT say 'and more', do NOT skip any data.\n" +
                "3. NO META-TEXT: Do not provide multiple options or explain your formatting.\n" +
                "4. FORMATTING: Output ONLY the final response. Format it clearly using bullet points or numbers so it is easy to read on a mobile phone.";
                
            ObjectNode requestBody = objectMapper.createObjectNode();
            requestBody.putArray("contents").addObject()
                    .putArray("parts").addObject()
                    .put("text", formattingPrompt);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> requestEntity = new HttpEntity<>(requestBody.toString(), headers);
            
            JsonNode response = restTemplate.postForObject(fullUrl, requestEntity, JsonNode.class);

            if (response != null && response.has("candidates")) {
                return response.get("candidates").get(0).get("content").get("parts").get(0).get("text").asText();
            }
            return "Here is your raw data: " + rawDatabaseData;
        } catch (Exception e) {
            return "I got the data, but my language center crashed. Raw data: " + rawDatabaseData;
        }
    }
}
