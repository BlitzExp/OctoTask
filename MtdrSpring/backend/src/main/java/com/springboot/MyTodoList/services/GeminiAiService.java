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
            
            // --- TOOL 6: Complete a Task ---
            ObjectNode completeTaskFunction = functionDeclarations.addObject();
            completeTaskFunction.put("name", "complete_task");
            completeTaskFunction.put("description", "Marks a specific task as completed or DONE. Ask the user for the Task ID if they don't provide it.");
            ObjectNode completeTaskParams = completeTaskFunction.putObject("parameters");
            completeTaskParams.put("type", "OBJECT");
            completeTaskParams.putObject("properties").putObject("taskId").put("type", "INTEGER").put("description", "The numeric ID of the task to complete");
            completeTaskParams.putArray("required").add("taskId");

            // --- TOOL 7: Get Pending Tasks ---
            ObjectNode getPendingTasksFunction = functionDeclarations.addObject();
            getPendingTasksFunction.put("name", "get_pending_tasks");
            getPendingTasksFunction.put("description", "Fetches ONLY the pending or incomplete tasks for a specific user. Use this when the user asks what they need to do.");
            ObjectNode getPendingParams = getPendingTasksFunction.putObject("parameters");
            getPendingParams.put("type", "OBJECT");
            getPendingParams.putObject("properties").putObject("userName").put("type", "STRING").put("description", "The name of the user");
            getPendingParams.putArray("required").add("userName");

            // --- TOOL 8: Get Top Priority Task ---
            ObjectNode getPriorityFunction = functionDeclarations.addObject();
            getPriorityFunction.put("name", "get_top_priority_task");
            getPriorityFunction.put("description", "Recommends the single most important task the user should work on right now based on priority.");
            ObjectNode getPriorityParams = getPriorityFunction.putObject("parameters");
            getPriorityParams.put("type", "OBJECT");
            getPriorityParams.putObject("properties").putObject("userName").put("type", "STRING").put("description", "The name of the user");
            getPriorityParams.putArray("required").add("userName");

            // --- TOOL 9: Get Overall Team KPIs ---
            ObjectNode getKpisFunction = functionDeclarations.addObject();
            getKpisFunction.put("name", "get_team_kpis");
            getKpisFunction.put("description", "Fetches overall statistics, analytics, and KPIs for a specific team (total, completed, pending, late tasks, and averages).");
            ObjectNode getKpisParams = getKpisFunction.putObject("parameters");
            getKpisParams.put("type", "OBJECT");
            getKpisParams.putObject("properties").putObject("teamId").put("type", "INTEGER").put("description", "The numeric ID of the team");
            getKpisParams.putArray("required").add("teamId");

            // --- TOOL 10: Get Sprint Analytics ---
            ObjectNode getSprintAnalyticsFunction = functionDeclarations.addObject();
            getSprintAnalyticsFunction.put("name", "get_sprint_analytics");
            getSprintAnalyticsFunction.put("description", "Fetches deep analytics for a specific sprint, showing exactly how many hours each member worked and their completed/late tasks.");
            ObjectNode getSprintParams = getSprintAnalyticsFunction.putObject("parameters");
            getSprintParams.put("type", "OBJECT");
            ObjectNode sprintProps = getSprintParams.putObject("properties");
            sprintProps.putObject("teamId").put("type", "INTEGER").put("description", "The numeric ID of the team");
            sprintProps.putObject("sprintId").put("type", "INTEGER").put("description", "The numeric ID of the sprint");
            getSprintParams.putArray("required").add("teamId").add("sprintId");

            // --- TOOL 11: Get User KPIs ---
            ObjectNode getUserKpisFunction = functionDeclarations.addObject();
            getUserKpisFunction.put("name", "get_user_kpis");
            getUserKpisFunction.put("description", "Fetches personal statistics, analytics, and KPIs for a specific user (total tasks, completed tasks, pending tasks, and total hours spent) by their name.");
            
            ObjectNode getUserKpisParams = getUserKpisFunction.putObject("parameters");
            getUserKpisParams.put("type", "OBJECT");
            getUserKpisParams.putObject("properties").putObject("userName").put("type", "STRING").put("description", "The first name or full name of the user");
            getUserKpisParams.putArray("required").add("userName");



            
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
                "2. If the data is STATISTICS or KPIs, act like a data analyst. Format it beautifully with bullet points, and short, insightful summaries of the numbers.\n" +
                "3. NO TRUNCATION: You must list EVERY SINGLE item provided in the raw data. If the database returns 32 items, you must list all 32. Do NOT stop at 10, do NOT say 'and more', do NOT skip any data.\n" +
                "4. NO META-TEXT: Do not provide multiple options or explain your formatting.\n" +
                "5. FORMATTING: Output ONLY the final response. Format it clearly using bullet points or numbers so it is easy to read on a mobile phone.";
                
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
