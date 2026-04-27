package com.springboot.MyTodoList.services.botTools;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.springboot.MyTodoList.services.FilterService;

@Component
public class GetTeamMembersTool implements BotTool {

    private final FilterService filterService;

    public GetTeamMembersTool(FilterService filterService) {
        this.filterService = filterService;
    }

    @Override
    public String getToolName() {
        return "get_team_members";
    }

    @Override
    public Object execute(JsonNode arguments) {
        // Note: FilterService uses Long instead of int in your code
        Long teamId = arguments.get("teamId").asLong();
        System.out.println("⚙️ Tool Executing: Fetching members for team " + teamId);
        return filterService.getTeamMembersByTeamId(teamId);
    }
}
