package com.tasknexus.controller;


import com.tasknexus.service.OverdueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/overdue")
@CrossOrigin(origins = "http://localhost:5173")
public class OverdueController {

    @Autowired
    private OverdueService overdueService;

    @PostMapping("/{taskId}")
    public String markTaskAsOverdue(@PathVariable Long taskId) {
        try {
            overdueService.markTaskAsOverdue(taskId);
            return "Task with ID " + taskId + " marked as Overdue.";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error marking task as Overdue: " + e.getMessage();
        }
    }
}
