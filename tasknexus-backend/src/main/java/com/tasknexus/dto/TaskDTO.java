package com.tasknexus.dto;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.tasknexus.entity.User;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

public class TaskDTO {
    private String title;
    private String description;
    private String due; // Accept dueDate as a String for better parsing control
    private String priority;
    private String status;
    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference
    private User user;

    // Getters and Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDueDate() {
        return due;
    }

    public void setDueDate(String due) {
        this.due = due;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
