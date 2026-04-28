package com.springboot.MyTodoList.services.botTools;

import com.fasterxml.jackson.databind.JsonNode;
import com.springboot.MyTodoList.services.StadisticsService;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class GetTeamKpisTool implements BotTool {

    private final StadisticsService stadisticsService;

    public GetTeamKpisTool(StadisticsService stadisticsService) {
        this.stadisticsService = stadisticsService;
    }

    @Override
    public String getToolName() {
        return "get_team_kpis";
    }

    @Override
    public Object execute(JsonNode arguments) {
        int teamId = arguments.get("teamId").asInt();
        System.out.println("⚙️ Tool Executing: Fetching Overall KPIs for Team " + teamId);

        // We bundle all your existing SQL queries into one massive metrics object!
        Map<String, Object> kpis = new HashMap<>();
        
        kpis.put("Total_Tasks", stadisticsService.getNumTasksByTeamId(teamId));
        kpis.put("Completed_Tasks", stadisticsService.getNumCompletedTasksByTeamId(teamId));
        kpis.put("Pending_Tasks", stadisticsService.getNumPendingTasksByTeamId(teamId));
        kpis.put("Late_Tasks", stadisticsService.getLateTasksByTeamId(teamId));
        
        // Adding your complex average groupings
        kpis.put("Averages_Per_Member", stadisticsService.getAverageTasksPerStatus(teamId));
        kpis.put("Average_Hours_Per_Sprint", stadisticsService.getAverageWorkHoursPerSprint(teamId));

        return kpis;
    }
}