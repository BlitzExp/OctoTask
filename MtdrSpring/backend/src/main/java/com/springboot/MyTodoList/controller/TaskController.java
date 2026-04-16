package com.springboot.MyTodoList.controller;

import org.hibernate.annotations.Fetch;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.springboot.MyTodoList.services.TaskService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Map;

import com.springboot.MyTodoList.model.User;

@RestController
@RequestMapping("/api/tasks")


public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping("/{teamId}")
    public ResponseEntity<?> getTeamTasks(@PathVariable int teamId) {
        try {
            var tasks = taskService.getTasksByTeamId(teamId);
            return ResponseEntity.ok(tasks);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", ex.getMessage()));
        }
    }
}
