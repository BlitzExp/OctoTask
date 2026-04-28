package com.springboot.MyTodoList.services.botTools;

import com.fasterxml.jackson.databind.JsonNode;
import com.springboot.MyTodoList.services.StadisticsService;
import org.springframework.stereotype.Component;

@Component
public class GetUserKpisTool implements BotTool {

    private final StadisticsService stadisticsService;

    public GetUserKpisTool(StadisticsService stadisticsService) {
        this.stadisticsService = stadisticsService;
    }

    @Override
    public String getToolName() {
        return "get_user_kpis";
    }

    @Override
    public Object execute(JsonNode arguments) {
        String userName = arguments.get("userName").asText();
        return stadisticsService.getUserKpisByUserName(userName);
    }
}