package com.springboot.MyTodoList.services.botTools;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.springboot.MyTodoList.services.TaskService;

@Component
public class GetTeamTasksTool implements BotTool {

    private final TaskService taskService;

    public GetTeamTasksTool(TaskService taskService) {
        this.taskService = taskService;
    }

    @Override
    public String getToolName() {
        return "get_team_tasks";
    }

    @Override
    public Object execute(JsonNode arguments) {
        int teamId = arguments.get("teamId").asInt();
        System.out.println("⚙️ Tool Executing: Fetching tasks for team " + teamId);
        return taskService.getTasksByTeamId(teamId);
    }
}
