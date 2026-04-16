package com.springboot.MyTodoList.services;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class FilterService {
    private final JdbcTemplate jdbcTemplate;

    public FilterService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }


    public Object getAllSprintsByTeamId(Long teamId) {
        String sql = "SELECT ID AS \"id\", SPRINT_NUM AS \"name\" FROM SPRINT WHERE TEAM_ID = ? ORDER BY SPRINT_NUM DESC";
        return jdbcTemplate.queryForList(sql, teamId);
    }

    
}
