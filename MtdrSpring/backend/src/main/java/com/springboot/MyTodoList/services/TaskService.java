package com.springboot.MyTodoList.services;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.util.List;

import com.springboot.MyTodoList.mappers.TaskRowMapper;
import com.springboot.MyTodoList.model.Task;

@Service
public class TaskService {
    private final JdbcTemplate jdbcTemplate;

    public TaskService(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    public Object getTasksByTeamId(int teamId) {
        String sql = "SELECT t.*, u.name as userName, s.end_date as sprintEndDate, s.SPRINT_NUM as sprintNumber FROM TASKS t JOIN APP_USER u ON t.user_id = u.id JOIN SPRINT s ON t.sprint_id = s.id WHERE u.team_id = ?";
        return jdbcTemplate.query(sql, new Object[] { teamId }, new TaskRowMapper());
    }


    // Not tested
    public List<Task> getTasksByUserId(int userId) {
        String sql = "SELECT t.*, u.name as userName, s.end_date as sprintEndDate, s.SPRINT_NUM as sprintNumber  FROM TASKS t JOIN APP_USER u ON t.user_id = u.id JOIN SPRINT s ON t.sprint_id = s.id WHERE t.user_id = ?";
        return jdbcTemplate.query(sql, new Object[] { userId }, new TaskRowMapper());
    }
}
