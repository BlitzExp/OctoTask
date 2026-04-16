package com.springboot.MyTodoList.services;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;

@Service
public class TaskService {
    private final JdbcTemplate jdbcTemplate;

    public TaskService(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    public Object getTasksByTeamId(int teamId) {
        String sql = "SELECT t.id AS id, t.user_id AS userId, t.name AS name, u.name AS userName, t.description AS description, s.id AS sprintId, s.sprint_num AS sprintNumber, s.end_date AS sprintEndDate, t.state_id AS stateId, t.priority_id AS priorityId, t.link_to_file AS linkToFile, t.created_at AS createdAt, t.cost AS cost, t.spent_hours AS spentHours, t.visibility AS visibility FROM TASKS t JOIN SPRINT s ON t.sprint_id = s.id JOIN APP_USER u ON u.id = t.user_id WHERE u.team_id = ? AND t.visibility = '1'";
        return jdbcTemplate.queryForList(sql, teamId);
    }
}
