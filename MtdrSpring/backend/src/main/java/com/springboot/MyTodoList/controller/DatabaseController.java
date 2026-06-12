package com.springboot.MyTodoList.controller;

import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Map;

@RestController
@RequestMapping("/api/database")
public class DatabaseController {

    private final DataSource dataSource;
    private final JdbcTemplate jdbcTemplate;
    private final Environment environment;

    public DatabaseController(DataSource dataSource, JdbcTemplate jdbcTemplate, Environment environment) {
        this.dataSource = dataSource;
        this.jdbcTemplate = jdbcTemplate;
        this.environment = environment;
    }

    @GetMapping("/ping")
    public ResponseEntity<Map<String, Object>> ping() {
        try (Connection connection = dataSource.getConnection()) {
            boolean connectionValid = connection.isValid(5);
            String pingSql = environment.acceptsProfiles(Profiles.of("local"))
                    ? "SELECT 1"
                    : "SELECT 1 FROM DUAL";
            Integer queryResult = jdbcTemplate.queryForObject(pingSql, Integer.class);

            return ResponseEntity.ok(Map.of(
                    "status", "ok",
                    "connectionValid", connectionValid,
                    "databaseProduct", connection.getMetaData().getDatabaseProductName(),
                    "queryResult", queryResult
            ));
        } catch (SQLException ex) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of(
                    "status", "error",
                    "message", ex.getMessage()
            ));
        }
    }
}
