package com.springboot.MyTodoList.services.botTools;

import com.fasterxml.jackson.databind.JsonNode;
import com.springboot.MyTodoList.model.Task; // <-- You were missing this import!
import com.springboot.MyTodoList.services.TaskService;
import org.springframework.stereotype.Component;

@Component
public class GetTopPriorityTaskTool implements BotTool {

    private final TaskService taskService;

    public GetTopPriorityTaskTool(TaskService taskService) {
        this.taskService = taskService;
    }

    @Override
    public String getToolName() {
        return "get_top_priority_task";
    }

    @Override
    public Object execute(JsonNode arguments) {
        String userName = arguments.get("userName").asText();
        Task topTask = taskService.getTopPriorityTask(userName);
        return topTask != null ? topTask : "You have no pending tasks!";
    }
}