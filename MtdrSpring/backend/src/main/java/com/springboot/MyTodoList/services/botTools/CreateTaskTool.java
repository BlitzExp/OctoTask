package com.springboot.MyTodoList.services.botTools;

import com.fasterxml.jackson.databind.JsonNode;
import com.springboot.MyTodoList.model.CreateTask;
import com.springboot.MyTodoList.services.TaskService;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Component
public class CreateTaskTool implements BotTool {

    private final TaskService taskService;

    public CreateTaskTool(TaskService taskService) {
        this.taskService = taskService;
    }

    @Override
    public String getToolName() {
        return "create_task";
    }

    @Override
    public Object execute(JsonNode arguments) {
        System.out.println("⚙️ Tool Executing: Creating a new task...");

        // 1. Create a new model object and map the JSON data from Gemini to it
        CreateTask newTask = new CreateTask();
        newTask.setName(arguments.get("name").asText());
        newTask.setDescription(arguments.get("description").asText());
        newTask.setAssigneeId(arguments.get("assigneeId").asInt());
        newTask.setSprintId(arguments.get("sprintId").asInt());
        newTask.setPriority(arguments.get("priority").asInt());

        // 2. Handle optional fields safely
        if (arguments.has("estimatedHours")) {
            newTask.setEstimatedHours(new BigDecimal(arguments.get("estimatedHours").asText()));
        }

        // 3. Fire the Muscle!
        return taskService.createTask(newTask);
    }
}