package com.tasknexus.service;

import com.tasknexus.dto.TaskDTO;
import com.tasknexus.entity.Task;
import com.tasknexus.entity.User;
import com.tasknexus.exceptions.TaskNotFoundException;
import com.tasknexus.exceptions.UserNotFoundException;
import com.tasknexus.repo.TaskRepo;
import com.tasknexus.repo.UserRepo;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class TaskServiceImp implements TaskService {
    @Autowired
    private TaskRepo taskRepo;

    @Autowired
    private UserRepo userRepo;

    @Override
    public List<Task> getAllTasks(Long userId) {
        Optional<User> user = userRepo.findById(userId);
        if (user.isPresent()) {
            return taskRepo.findByUser(user.get());
        }
        return null;
    }

    @Override
    public List<Task> getTasksByStatus(Long userId, String status) {
        Optional<User> user = userRepo.findById(userId);
        if (user.isPresent()) {
            return taskRepo.findByStatusAndUser(status, user.get());
        }
        return null;
    }
    public Map<String, Integer> getTaskCountsByStatus(Long userId) {
        Map<String, Integer> counts = new HashMap<>();
        counts.put("ongoing", taskRepo.countByUserIdAndStatus(userId, "ongoing"));
        counts.put("completed", taskRepo.countByUserIdAndStatus(userId, "completed"));
        counts.put("overdue", taskRepo.countByUserIdAndStatus(userId, "overdue"));
        counts.put("planned", taskRepo.countByUserIdAndStatus(userId, "planned"));
        return counts;
    }

    @Override
    public List<Task> getTasksByPriority(Long userId,String status, String priority) {
        Optional<User> user = userRepo.findById(userId);
        if (user.isPresent()) {
            return taskRepo.findByStatusAndPriorityAndUser(priority,status, user.get());
        }
        return null;
    }

    @Override
    public Optional<Task> getTaskById(Long userId, Long taskId) {
        Optional<User> user = userRepo.findById(userId);
        if (user.isPresent()) {
            return taskRepo.findByIdAndUser(taskId, user.get());
        }
        return Optional.empty();
    }

    @Override
    public Task createTask(Long userId, TaskDTO tasksDto) {
    	User user = userRepo.findById(userId)
    	        .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));
    	
        Task task = new Task();
        
        task.setTitle(tasksDto.getTitle());
        task.setDescription(tasksDto.getDescription());
        task.setPriority(tasksDto.getPriority());
        task.setStatus(tasksDto.getStatus());
          
        try {
            // Parse dueDate from the DTO
        	System.out.println(tasksDto.getDueDate());
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
            LocalDateTime dueDate = LocalDateTime.parse(tasksDto.getDueDate(), formatter);
            System.out.println(dueDate);
            task.setDue(dueDate);
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid date format for dueDate. Expected format: yyyy-MM-dd'T'HH:mm:ss");
        }
         task.setUser(user);
        // Save the task in the database (assuming a repository exists)
        return taskRepo.save(task);
    }

    @Override
    @Transactional
    public Task updateTask(Long userId, Long taskId, TaskDTO taskDTO) {
        Task existingTask = taskRepo.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        System.out.println("Updating Task: " + existingTask);

        if (taskDTO.getTitle() != null) {
            existingTask.setTitle(taskDTO.getTitle());
        }
        if (taskDTO.getDescription() != null) {
            existingTask.setDescription(taskDTO.getDescription());
        }
        if (taskDTO.getDueDate() != null) {
        	try {
                // Parse dueDate from the DTO
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
                LocalDateTime dueDate = LocalDateTime.parse(taskDTO.getDueDate(), formatter);
                existingTask.setDue(dueDate);
            } catch (DateTimeParseException e) {
                throw new IllegalArgumentException("Invalid date format for dueDate. Expected format: yyyy-MM-dd'T'HH:mm:ss");
            }
        }

        if (taskDTO.getStatus() != null) {
            existingTask.setStatus(taskDTO.getStatus());
        }
        if (taskDTO.getPriority() != null) {
            existingTask.setPriority(taskDTO.getPriority());
        }

        return taskRepo.save(existingTask);
    }


    @Override
    @Transactional
    public void deleteTask(Long userId, Long taskId) {
        Optional<User> user = userRepo.findById(userId);
        if (user.isPresent()) {
            taskRepo.deleteByIdAndUser(taskId, user.get());
        } else {
            throw new RuntimeException("User not found with ID: " + userId);
        }
    }

    @Override
    public List<Task> getTasksDueBefore(Long userId, LocalDateTime dueDate) {
        Optional<User> user = userRepo.findById(userId);
        if (user.isPresent()) {
            return taskRepo.findByDueBeforeAndUser(dueDate, user.get());
        }
        return null;
    }
    
    public void completeTask(Long userId, Long taskId) {
        // Fetch the task to ensure it exists
        Task task = taskRepo.findById(taskId)
            .orElseThrow(() -> new TaskNotFoundException("Task not found"));

        // Validate the task belongs to the user
        if (!task.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Task does not belong to the user");
        }

        // Increment the completed tasks count for the user
        User user = userRepo.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("User not found"));
        user.setCompletedTaskCount(user.getCompletedTaskCount() + 1);
        userRepo.save(user);

        // Delete the task
        taskRepo.deleteById(taskId);
    }

    public void markTaskAsOverdue(Long taskId) {
        Optional<Task> optionalTask = taskRepo.findById(taskId);
        if (optionalTask.isPresent()) {
            Task task = optionalTask.get();
            task.setStatus("Overdue");
            taskRepo.save(task);
        } else {
            throw new RuntimeException("Task with ID " + taskId + " not found.");
        }
    }

}
