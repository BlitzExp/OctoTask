package com.springboot.MyTodoList.services.botTools;

import com.fasterxml.jackson.databind.JsonNode;
import com.springboot.MyTodoList.services.TaskService;
import org.springframework.stereotype.Component;

@Component
public class CompleteTaskTool implements BotTool {

    // 1. Declare the muscle
    private final TaskService taskService;

    // 2. Inject it via the constructor
    public CompleteTaskTool(TaskService taskService) {
        this.taskService = taskService;
    }

    @Override
    public String getToolName() {
        return "complete_task";
    }

    @Override
    public Object execute(JsonNode arguments) {
        int taskId = arguments.get("taskId").asInt();
        taskService.markTaskCompleted(taskId);
        return "SUCCESS: Task " + taskId + " has been marked as completed in the Oracle Database.";
    }
}