package com.springboot.MyTodoList.controller;

import org.hibernate.annotations.Fetch;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.springboot.MyTodoList.services.TaskService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Map;

import com.springboot.MyTodoList.services.FilterService;
import com.springboot.MyTodoList.services.StadisticsService;

@RestController
@RequestMapping("/api/analytics")

public class StadisticsController {

    private final StadisticsService stadisticsService;

    public StadisticsController(StadisticsService stadisticsService) {
        this.stadisticsService = stadisticsService;
    }

    @GetMapping("/numtasks/{teamId}/{sprintId}")
    public ResponseEntity<Map<String, Object>> getNumTasks(
            @PathVariable String teamId,
            @PathVariable String sprintId) {
        try {
            Integer numTasks = stadisticsService.getNumTasksBySprintId(Integer.parseInt(teamId),
                    Integer.parseInt(sprintId));
            return ResponseEntity.ok(Map.of("num_tasks", numTasks));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", ex.getMessage()));
        }
    }

    @GetMapping("/numtasks/all/{teamId}")
    public ResponseEntity<Map<String, Object>> getNumTasksAll(
            @PathVariable String teamId) {
        try{
            Integer numTasks = stadisticsService.getNumTasksByTeamId(Integer.parseInt(teamId));
            return ResponseEntity.ok(Map.of("num_tasks", numTasks));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", ex.getMessage()));
        }
    }

}
