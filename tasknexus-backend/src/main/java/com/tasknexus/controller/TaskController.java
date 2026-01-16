package com.tasknexus.controller;

import com.tasknexus.dto.TaskDTO;
import com.tasknexus.dto.UserDTO;
import com.tasknexus.entity.Task;
import com.tasknexus.entity.User;
import com.tasknexus.repo.TaskRepo;
import com.tasknexus.repo.UserRepo;
import com.tasknexus.service.TaskService;
import com.tasknexus.service.UserService;
import com.tasknexus.service.EmailSchedulerService;
import com.tasknexus.service.OverdueService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private EmailSchedulerService emailSchedulerService;
    
    @Autowired
    private UserService userService;
    
    @Autowired 
    private OverdueService overdueService;

    @Autowired
    private UserRepo userRepo;
    
    @Autowired
    private TaskRepo taskRepo;
    
    @GetMapping("/all/{userId}")
    public ResponseEntity<List<Task>> getAllTasks(@PathVariable Long userId) {
        List<Task> tasks = taskService.getAllTasks(userId);
        return tasks != null ? ResponseEntity.ok(tasks) : ResponseEntity.notFound().build();
    }

    @GetMapping("/byId/{userId}/{taskId}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long userId, @PathVariable Long taskId) {
        Optional<Task> task = taskService.getTaskById(userId, taskId);
        return task.map(ResponseEntity::ok)
                   .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/create/{userId}")
    public ResponseEntity<Task> createTask(@PathVariable Long userId, @RequestBody TaskDTO tasksDto) {
        try {
            // Create the task
            Task createdTask = taskService.createTask(userId, tasksDto);

            // Fetch user details
            Optional<UserDTO> userOptional = userService.getUserById(userId).map(this::convertToUserDTO);
            if (userOptional.isEmpty()) {
                return ResponseEntity.badRequest().body(null); // User does not exist
            }
            UserDTO user = userOptional.get();

            // Schedule email reminder
            try {
                LocalDateTime reminderTime = createdTask.getDue().minusHours(6);
                Date scheduleTime = Date.from(reminderTime.atZone(ZoneId.systemDefault()).toInstant());
                emailSchedulerService.scheduleEmail(
                    user.getEmail(), 
                    "Task Reminder: " + createdTask.getTitle(),
                    "Hi " + user.getUsername() + ",\n\nYour task '" + createdTask.getTitle() +
                    "' is due on " + createdTask.getDue() + ". Please make sure to complete it on time.",
                    scheduleTime
                );
            } catch (Exception emailException) {
                System.out.println("Warning: Email scheduling failed - " + emailException.getMessage());
                emailException.printStackTrace();
            }

            // Schedule overdue job
            try {
                Date overdueScheduleTime = Date.from(createdTask.getDue().atZone(ZoneId.systemDefault()).toInstant());
                overdueService.scheduleOverdueJob(
                    createdTask.getId(),
                    overdueScheduleTime
                );
            } catch (Exception overdueException) {
                System.out.println("Warning: Overdue job scheduling failed - " + overdueException.getMessage());
                overdueException.printStackTrace();
            }

            return ResponseEntity.ok(createdTask);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null); // Handle parsing errors
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null); // Handle unexpected errors
        }
    }


    private UserDTO convertToUserDTO(User user) {
        // Manually map User entity fields to UserDTO
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setEmail(user.getEmail());
        userDTO.setGender(user.getGender());
        userDTO.setBio(user.getBio());
        userDTO.setDob(user.getDob().toString()); // Convert LocalDate to String
        return userDTO;
    }

    @PutMapping("/update/{userId}/{taskId}")
    public ResponseEntity<Task> updateTask(
            @PathVariable Long userId,
            @PathVariable Long taskId,
            @RequestBody TaskDTO taskDTO) {
        try {
            Optional<Task> taskOptional = taskService.getTaskById(userId, taskId);
            if (taskOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            UserDTO user = userService.getUserById(userId)
                    .map(this::convertToUserDTO)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Task updatedTask = taskService.updateTask(userId, taskId, taskDTO);

            if (taskDTO.getDueDate() != null) {
                LocalDateTime newDueDate = LocalDateTime.parse(taskDTO.getDueDate());
                emailSchedulerService.scheduleEmail(
                	    user.getEmail(),
                	    "Task Reminder: " + updatedTask.getTitle(),
                	    "Hi " + user.getUsername() + ",\n\nYour task '" + updatedTask.getTitle() +
                	    "' is due on " + updatedTask.getDue() + ". Please make sure to complete it on time.",
                	    Date.from(newDueDate.minusHours(6).atZone(ZoneId.systemDefault()).toInstant()) // Ensure this matches expected type
                	);
                Date overdueScheduleTime = Date.from(updatedTask.getDue().atZone(ZoneId.systemDefault()).toInstant());
                overdueService.scheduleOverdueJob(
                		updatedTask.getId(),
                    overdueScheduleTime // Pass the exact due time
                );
            }

            return ResponseEntity.ok(updatedTask);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null); 
        }
    }


    @DeleteMapping("/delete/{userId}/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long userId, @PathVariable Long taskId) {
        taskService.deleteTask(userId, taskId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/status/{userId}/{status}")
    public ResponseEntity<List<Task>> getTasksByStatus(@PathVariable Long userId, @PathVariable String status) {
        List<Task> tasks = taskService.getTasksByStatus(userId, status);
        return tasks != null ? ResponseEntity.ok(tasks) : ResponseEntity.notFound().build();
    }

    @GetMapping("/status/counts/{userId}")
    public ResponseEntity<Map<String, Integer>> getTaskCountsByStatus(@PathVariable Long userId) {
        Map<String, Integer> taskCounts = taskService.getTaskCountsByStatus(userId);
        return ResponseEntity.ok(taskCounts);
    }

    @GetMapping("/priority/{userId}/{status}/{priority}")
    public ResponseEntity<List<Task>> getTasksByPriority(
        @PathVariable Long userId,
        @PathVariable String priority,
        @PathVariable String status
    ) {
        System.out.println("User ID: " + userId);
        System.out.println("Priority: " + priority);

        Optional<User> user = userRepo.findById(userId);
        if (user.isPresent()) {

            List<Task> tasks = taskRepo.findByStatusAndPriorityAndUser(status, priority, user.get());
            System.out.println("Tasks Found: " + tasks.size());
            return ResponseEntity.ok(tasks);
        }
        return ResponseEntity.notFound().build();
    }


    @GetMapping("/due-before/{userId}")
    public ResponseEntity<List<Task>> getTasksDueBefore(@PathVariable Long userId, @RequestParam("dueDate") LocalDateTime dueDate) {
        List<Task> tasks = taskService.getTasksDueBefore(userId, dueDate);
        return tasks != null ? ResponseEntity.ok(tasks) : ResponseEntity.notFound().build();
    }

    @PutMapping("/complete/{userId}/{taskId}")
    public ResponseEntity<Void> completeTask(@PathVariable Long userId, @PathVariable Long taskId) {
        taskService.completeTask(userId, taskId);
        return ResponseEntity.ok().build();
    }
}
