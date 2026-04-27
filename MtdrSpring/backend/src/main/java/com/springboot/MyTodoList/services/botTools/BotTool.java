package com.springboot.MyTodoList.services.botTools;

import com.fasterxml.jackson.databind.JsonNode;

public interface BotTool {
    // The exact string Gemini will send (e.g., "get_team_tasks")
    String getToolName(); 
    
    // The logic that actually calls your database
    Object execute(JsonNode arguments) throws Exception; 
}