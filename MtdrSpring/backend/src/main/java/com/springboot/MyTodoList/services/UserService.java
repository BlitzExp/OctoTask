package com.springboot.MyTodoList.services;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.util.Map;
import com.springboot.MyTodoList.model.User;

import jakarta.persistence.criteria.CriteriaBuilder.In;

@Service
public class UserService {
    private final JdbcTemplate jdbcTemplate;

    public UserService(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    public User loginUser(Map<String, Object> userData) {
        String user = (String) userData.get("email");
        String password = (String) userData.get("password");

        String sql = "SELECT a.id, u.username, a.email, u.team_id FROM AUTH a JOIN APP_USERS u ON a.id = u.auth_id WHERE (a.email = ? OR u.username = ?) AND a.password = ?";
        return jdbcTemplate.query(sql, new Object[]{user, user, password}, rs -> {
            if (rs.next()) {
                return new User.Builder()
                        .setId(rs.getInt("id"))
                        .setUsername(rs.getString("username"))
                        .setEmail(rs.getString("email"))
                        .setTeamId(rs.getInt("team_id"))
                        .build();
            }
            return null; // No matching user found
        });
    }

    public User createUser(Map<String, Object> userData) {
        String username = (String) userData.get("username");
        String email = (String) userData.get("email");
        String password = (String) userData.get("password");
        String role = (String) userData.get("role");

        String authSql = "INSERT INTO AUTH (email, password) VALUES (?, ?) RETURNING id";
        Integer authId = jdbcTemplate.queryForObject(authSql, Integer.class, email, password);
        if (authId == null) {
            return null; // Failed to create auth record
        }

        String sql = "INSERT INTO APP_USERS (auth_id, username, role, team_id) VALUES (?, ?, ?, ?)";

        int rows = jdbcTemplate.update(sql, authId, username, role, null);
        
        if (rows > 0) {
            Integer teamId = null;

            if (role.equalsIgnoreCase("admin")) {
                String teamSql = "INSERT INTO TEAMS (manager_id) VALUES (?) RETURNING id";
                teamId = jdbcTemplate.queryForObject(teamSql, Integer.class, authId);
                if (teamId != null) {
                    String updateTeamSql = "UPDATE APP_USERS SET team_id = ? WHERE auth_id = ?";
                    jdbcTemplate.update(updateTeamSql, teamId, authId);
                }
            }

            User user = new User.Builder()
                    .setId(authId != null ? authId : 0)
                    .setUsername(username)
                    .setEmail(email)
                    .setTeamId(teamId != null ? teamId : 0)
                    .build();
            return user;
        }
        return null;
    }

    public boolean createTeam(Map<String, Object> teamData) {
        String teamName = (String) teamData.get("teamName");
        String sql = "INSERT INTO TEAMS (name) VALUES (?)";
        int rows = jdbcTemplate.update(sql, teamName);
        return rows > 0;
    }

    public boolean checkDuplicates(Map<String, Object> userData) {
        String username = (String) userData.get("username");
        String email = (String) userData.get("email");

        String sql = "SELECT COUNT(*) FROM APP_USERS WHERE username = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, username);
        if (count != null && count > 0) {
            return false; // Username already exists
        }

        sql = "SELECT COUNT(*) FROM AUTH WHERE email = ?";

        count = jdbcTemplate.queryForObject(sql, Integer.class, email);

        if (count != null && count > 0) {
            return false; // Email already exists
        }

        return true; // Both username and email are available
    }
}
