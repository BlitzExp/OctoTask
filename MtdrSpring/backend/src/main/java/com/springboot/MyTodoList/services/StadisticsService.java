package com.springboot.MyTodoList.services;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.util.List;

import com.springboot.MyTodoList.mappers.TaskRowMapper;
import com.springboot.MyTodoList.model.Task;

@Service
public class StadisticsService {

    private final JdbcTemplate jdbcTemplate;

    public StadisticsService(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    public Integer getNumTasksBySprintId(int teamId, int sprintId) {
        String sql = "SELECT COUNT(*) FROM TASKS t JOIN APP_USER u ON u.id = t.user_id JOIN SPRINT s ON s.id = t.sprint_id WHERE u.team_id = ? AND t.sprint_id = ?";
        return jdbcTemplate.queryForObject(sql, Integer.class, teamId, sprintId);
    }

    public Integer getNumTasksByTeamId(int teamId) {
        String sql = "SELECT COUNT(*) FROM TASKS t JOIN APP_USER u ON u.id = t.user_id WHERE u.team_id = ?";
        return jdbcTemplate.queryForObject(sql, Integer.class, teamId);
    }
}
