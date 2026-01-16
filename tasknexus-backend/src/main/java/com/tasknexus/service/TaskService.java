package com.tasknexus.service;

import com.tasknexus.dto.TaskDTO;
import com.tasknexus.entity.Task;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface TaskService {
    List<Task> getAllTasks(Long userId);
    List<Task> getTasksByStatus(Long userId, String status);
    List<Task> getTasksByPriority(Long userId,String status, String priority);
    Optional<Task> getTaskById(Long userId, Long taskId);
    Task createTask(Long userId,TaskDTO task);
    void deleteTask(Long userId, Long taskId);
    List<Task> getTasksDueBefore(Long userId, LocalDateTime dueDate);
    public Map<String, Integer> getTaskCountsByStatus(Long userId);
    public void completeTask(Long userId, Long taskId);
    public void markTaskAsOverdue(Long taskId);
    public Task updateTask(Long taskId,Long userId, TaskDTO taskDTO);
    
}
