package com.springboot.MyTodoList.services.botTools;

import com.fasterxml.jackson.databind.JsonNode;
import com.springboot.MyTodoList.services.StadisticsService;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class GetSprintAnalyticsTool implements BotTool {

    private final StadisticsService stadisticsService;

    public GetSprintAnalyticsTool(StadisticsService stadisticsService) {
        this.stadisticsService = stadisticsService;
    }

    @Override
    public String getToolName() {
        return "get_sprint_analytics";
    }

    @Override
    public Object execute(JsonNode arguments) {
        int teamId = arguments.get("teamId").asInt();
        int sprintId = arguments.get("sprintId").asInt();
        System.out.println("⚙️ Tool Executing: Fetching Sprint Analytics for Team " + teamId + ", Sprint " + sprintId);

        Map<String, Object> sprintStats = new HashMap<>();
        
        sprintStats.put("Member_Status_Breakdown", stadisticsService.getMemberStatusBreakdown(teamId, sprintId));
        sprintStats.put("Member_Work_Hours", stadisticsService.getMemberWorkHoursBySprint(teamId, sprintId));

        return sprintStats;
    }
}