package com.springboot.MyTodoList.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.springboot.MyTodoList.services.StadisticsService;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin
public class StadisticsController {

    private final StadisticsService stadisticsService;

    public StadisticsController(StadisticsService stadisticsService) {
        this.stadisticsService = stadisticsService;
    }

    // ==========================================
    // 1. General Tasks
    // ==========================================

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
        try {
            Integer numTasks = stadisticsService.getNumTasksByTeamId(Integer.parseInt(teamId));
            return ResponseEntity.ok(Map.of("num_tasks", numTasks));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", ex.getMessage()));
        }
    }

<<<<<<< HEAD
    @GetMapping("/completedtasks/{teamId}/{sprintId}")
    public ResponseEntity<Map<String, Object>> getNumCompletedTasks(
            @PathVariable String teamId,
            @PathVariable String sprintId) {
        try {
            Integer numCompletedTasks = stadisticsService.getNumCompletedTasksBySprintId(Integer.parseInt(teamId),
                    Integer.parseInt(sprintId));
            return ResponseEntity.ok(Map.of("num_completed_tasks", numCompletedTasks));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", ex.getMessage()));
        }
    }

    @GetMapping("/completedtasks/all/{teamId}")
    public ResponseEntity<Map<String, Object>> getNumCompletedTasksAll(
            @PathVariable String teamId) {
        try {
            Integer numCompletedTasks = stadisticsService.getNumCompletedTasksByTeamId(Integer.parseInt(teamId));
            return ResponseEntity.ok(Map.of("num_completed_tasks", numCompletedTasks));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", ex.getMessage()));
        }
    }

    @GetMapping("/pendingtasks/{teamId}/{sprintId}")
    public ResponseEntity<Map<String, Object>> getNumPendingTasks(
            @PathVariable String teamId,
            @PathVariable String sprintId) {
        try {
            Integer numPendingTasks = stadisticsService.getNumPendingTasksBySprintId(Integer.parseInt(teamId),
                    Integer.parseInt(sprintId));
            return ResponseEntity.ok(Map.of("num_pending_tasks", numPendingTasks));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", ex.getMessage()));
        }
    }

    @GetMapping("/pendingtasks/all/{teamId}")
    public ResponseEntity<Map<String, Object>> getNumPendingTasksAll(
            @PathVariable String teamId) {
        try {
            Integer numPendingTasks = stadisticsService.getNumPendingTasksByTeamId(Integer.parseInt(teamId));
            return ResponseEntity.ok(Map.of("num_pending_tasks", numPendingTasks));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", ex.getMessage()));
        }
    }
=======
    // ==========================================
    // 2. Late Tasks
    // ==========================================
>>>>>>> bbc4983 (Finished backend endpoints Statistics)

    @GetMapping("/latetasks/{teamId}/{sprintId}")
    public ResponseEntity<Map<String, Object>> getLateTasks(
            @PathVariable String teamId,
            @PathVariable String sprintId) {
        try {
<<<<<<< HEAD
            Integer numLateTasks = stadisticsService.getLateTasksBySprintId(Integer.parseInt(teamId),
                    Integer.parseInt(sprintId));
            return ResponseEntity.ok(Map.of("num_late_tasks", numLateTasks));
=======
            Object lateTasks = stadisticsService.getLateTasksBySprintId(Integer.parseInt(teamId),
                    Integer.parseInt(sprintId));
            return ResponseEntity.ok(Map.of("late_tasks", lateTasks));
>>>>>>> bbc4983 (Finished backend endpoints Statistics)
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", ex.getMessage()));
        }
    }

    @GetMapping("/latetasks/all/{teamId}")
    public ResponseEntity<Map<String, Object>> getLateTasksAll(
            @PathVariable String teamId) {
        try {
<<<<<<< HEAD
            Integer numLateTasks = stadisticsService.getLateTasksByTeamId(Integer.parseInt(teamId));
            return ResponseEntity.ok(Map.of("num_late_tasks", numLateTasks));
=======
            Object lateTasks = stadisticsService.getLateTasksByTeamId(Integer.parseInt(teamId));
            return ResponseEntity.ok(Map.of("late_tasks", lateTasks));
>>>>>>> bbc4983 (Finished backend endpoints Statistics)
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", ex.getMessage()));
        }
    }

<<<<<<< HEAD
    @GetMapping("/memberstatus/{teamId}/{sprintId}")
    public ResponseEntity<Map<String, Object>> getMemberStatusBreak(
            @PathVariable String teamId,
            @PathVariable String sprintId) {
        try {
            var breakdown = stadisticsService.getMemberStatusBreakdown(Integer.parseInt(teamId),
                    Integer.parseInt(sprintId));
            return ResponseEntity.ok(Map.of("member_status_breakdown", breakdown));
=======
    // ==========================================
    // 3. Pending Tasks
    // ==========================================

    @GetMapping("/pendingtasks/{teamId}/{sprintId}")
    public ResponseEntity<Map<String, Object>> getPendingTasks(
            @PathVariable String teamId,
            @PathVariable String sprintId) {
        try {
            Object pendingTasks = stadisticsService.getPendingTasksBySprintId(Integer.parseInt(teamId),
                    Integer.parseInt(sprintId));
            return ResponseEntity.ok(Map.of("pending_tasks", pendingTasks));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", ex.getMessage()));
        }
    }

    @GetMapping("/pendingtasks/all/{teamId}")
    public ResponseEntity<Map<String, Object>> getPendingTasksAll(
            @PathVariable String teamId) {
        try {
            Object pendingTasks = stadisticsService.getPendingTasksByTeamId(Integer.parseInt(teamId));
            return ResponseEntity.ok(Map.of("pending_tasks", pendingTasks));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", ex.getMessage()));
        }
    }

    // ==========================================
    // 4. Ongoing Tasks
    // ==========================================

    @GetMapping("/ongoingtasks/{teamId}/{sprintId}")
    public ResponseEntity<Map<String, Object>> getOngoingTasks(
            @PathVariable String teamId,
            @PathVariable String sprintId) {
        try {
            Object ongoingTasks = stadisticsService.getOngoingTasksBySprintId(Integer.parseInt(teamId),
                    Integer.parseInt(sprintId));
            return ResponseEntity.ok(Map.of("ongoing_tasks", ongoingTasks));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", ex.getMessage()));
        }
    }

    @GetMapping("/ongoingtasks/all/{teamId}")
    public ResponseEntity<Map<String, Object>> getOngoingTasksAll(
            @PathVariable String teamId) {
        try {
            Object ongoingTasks = stadisticsService.getOngoingTasksByTeamId(Integer.parseInt(teamId));
            return ResponseEntity.ok(Map.of("ongoing_tasks", ongoingTasks));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", ex.getMessage()));
        }
    }

    // ==========================================
    // 5. Team Member Stats & Hours
    // ==========================================

    @GetMapping("/memberstatus/{teamId}/{sprintId}")
    public ResponseEntity<Map<String, Object>> getMemberStatusBreakdown(
            @PathVariable String teamId,
            @PathVariable String sprintId) {
        try {
            Object memberStatus = stadisticsService.getMemberStatusBreakdown(Integer.parseInt(teamId),
                    Integer.parseInt(sprintId));
            return ResponseEntity.ok(Map.of("member_status", memberStatus));
>>>>>>> bbc4983 (Finished backend endpoints Statistics)
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", ex.getMessage()));
        }
    }

<<<<<<< HEAD
    @GetMapping("/workhours/{teamId}/{sprintId}")
    public ResponseEntity<Map<String, Object>> getWorkHours(
            @PathVariable String teamId,
            @PathVariable String sprintId) {
        try {
            var workHours = stadisticsService.getMemberWorkHoursBySprint(Integer.parseInt(teamId),
                    Integer.parseInt(sprintId));
            return ResponseEntity.ok(Map.of("work_hours", workHours));
=======
    @GetMapping("/memberhours/{teamId}/{sprintId}")
    public ResponseEntity<Map<String, Object>> getMemberHourLoad(
            @PathVariable String teamId,
            @PathVariable String sprintId) {
        try {
            Object memberHours = stadisticsService.getMemberHourLoad(Integer.parseInt(teamId),
                    Integer.parseInt(sprintId));
            return ResponseEntity.ok(Map.of("member_hours", memberHours));
>>>>>>> bbc4983 (Finished backend endpoints Statistics)
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", ex.getMessage()));
        }
    }

<<<<<<< HEAD
    @GetMapping("/avgtasks/{teamId}")
    public ResponseEntity<Map<String, Object>> getAverageTasksPerStatusPerTeam(
            @PathVariable String teamId) {
        try {
            var avgTasks = stadisticsService.getAverageTasksPerStatus(Integer.parseInt(teamId));
            return ResponseEntity.ok(Map.of("avg_tasks_per_member", avgTasks));
=======
    // ==========================================
    // 6. Metrics & Averages
    // ==========================================

    @GetMapping("/averages/{teamId}/{sprintId}")
    public ResponseEntity<Map<String, Object>> getSprintAverages(
            @PathVariable String teamId,
            @PathVariable String sprintId) {
        try {
            Object averages = stadisticsService.getSprintAverages(Integer.parseInt(teamId),
                    Integer.parseInt(sprintId));
            return ResponseEntity.ok(Map.of("sprint_averages", averages));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", ex.getMessage()));
        }
    }

    @GetMapping("/averages/all/{teamId}")
    public ResponseEntity<Map<String, Object>> getHistoricalAverages(
            @PathVariable String teamId) {
        try {
            Object averages = stadisticsService.getHistoricalAverages(Integer.parseInt(teamId));
            return ResponseEntity.ok(Map.of("historical_averages", averages));
>>>>>>> bbc4983 (Finished backend endpoints Statistics)
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", ex.getMessage()));
        }
    }
<<<<<<< HEAD

    @GetMapping("/avghours/{teamId}")
    public ResponseEntity<Map<String, Object>> getAverageHoursPerMember(
            @PathVariable String teamId) {
        try {
            var avgHours = stadisticsService.getAverageWorkHoursPerSprint(Integer.parseInt(teamId));
            return ResponseEntity.ok(Map.of("avg_hours_per_member", avgHours));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", ex.getMessage()));
        }
    }

    @GetMapping("/completedtasks/bymember/sprints/{teamId}")
    public ResponseEntity<Map<String, Object>> getCompletedTasksByMemberPerSprint(
            @PathVariable String teamId) {
        try {
            var completed = stadisticsService.getCompletedTasksByMemberPerSprint(Integer.parseInt(teamId));
            return ResponseEntity.ok(Map.of("completed_tasks_by_member_per_sprint", completed));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", ex.getMessage()));
        }
    }

    @GetMapping("/workhours/bymember/sprints/{teamId}")
    public ResponseEntity<Map<String, Object>> getWorkHoursByMemberPerSprint(
            @PathVariable String teamId) {
        try {
            var hours = stadisticsService.getWorkHoursByMemberPerSprint(Integer.parseInt(teamId));
            return ResponseEntity.ok(Map.of("work_hours_by_member_per_sprint", hours));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", ex.getMessage()));
        }
    }

}
=======
}
>>>>>>> bbc4983 (Finished backend endpoints Statistics)
