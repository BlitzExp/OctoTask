package com.springboot.MyTodoList.services.botTools;

import com.fasterxml.jackson.databind.JsonNode;
import com.springboot.MyTodoList.services.TaskService;
import org.springframework.stereotype.Component;

@Component
public class GetUserTasksTool implements BotTool {

    private final TaskService taskService;

    public GetUserTasksTool(TaskService taskService) {
        this.taskService = taskService;
    }

    @Override
    public String getToolName() {
        return "get_user_tasks";
    }

    @Override
    public Object execute(JsonNode arguments) {
        String userName = arguments.get("userName").asText();
        System.out.println("⚙️ Tool Executing: Fetching tasks for User Name: " + userName);
        
        // Point to the new method we just created!
        return taskService.getTasksByUserName(userName);
    }
}