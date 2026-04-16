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
        String sql = "Select t.id as id, t.user_id as userId, t.name as userName, t.DESCRIPTION as description, s.ID as sprintId, s.SPRINT_NUM as sprintNumber, s.END_DATE as sprintEndDate, t.STATE_ID as stateId,  t.PRIORITY_ID as priorityId,  t.LINK_TO_FILE as linkToFile, t.CREATED_AT as createdAt, t.cost as cost, t.SPENT_HOURS as spentHours, t.visibility as visibility from TASKS t join sprint s on t.SPRINT_ID = s.ID join APP_USER u on u.ID = t.USER_ID where u.TEAM_ID = ? and t.visibility = '1'";
        return jdbcTemplate.queryForList(sql, teamId);
    }
}
