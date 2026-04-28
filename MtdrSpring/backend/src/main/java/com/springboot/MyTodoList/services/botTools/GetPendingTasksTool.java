package com.springboot.MyTodoList.services.botTools;

import com.fasterxml.jackson.databind.JsonNode;
import com.springboot.MyTodoList.services.TaskService;
import org.springframework.stereotype.Component;

@Component
public class GetPendingTasksTool implements BotTool {

    private final TaskService taskService;

    public GetPendingTasksTool(TaskService taskService) {
        this.taskService = taskService;
    }

    @Override
    public String getToolName() {
        return "get_pending_tasks";
    }

    @Override
    public Object execute(JsonNode arguments) {
        String userName = arguments.get("userName").asText();
        return taskService.getPendingTasksByUserName(userName);
    }
}