package com.springboot.MyTodoList.services.botTools;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.springboot.MyTodoList.services.StadisticsService;

@Component
public class GetLateTasksTool implements BotTool {

    private final StadisticsService stadisticsService;

    public GetLateTasksTool(StadisticsService stadisticsService) {
        this.stadisticsService = stadisticsService;
    }

    @Override
    public String getToolName() {
        return "get_late_tasks_by_sprint";
    }

    @Override
    public Object execute(JsonNode arguments) {
        int teamId = arguments.get("teamId").asInt();
        int sprintId = arguments.get("sprintId").asInt();
        System.out.println("⚙️ Tool Executing: Fetching late tasks for team " + teamId + ", sprint " + sprintId);
        return stadisticsService.getLateTasksBySprintId(teamId, sprintId);
    }
}
