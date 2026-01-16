package com.tasknexus.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.tasknexus.service.EmailSchedulerService;

import java.util.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;

@RestController
@RequestMapping("/api/emails")
public class EmailController {

    @Autowired
    private EmailSchedulerService emailSchedulerService;

    // Define a model to accept JSON input
    static class EmailRequest {
        public String recipient;
        public String subject;
        public String body;
        public String scheduleTime;
    }

    @PostMapping("/schedule")
    public String scheduleEmail(@RequestBody EmailRequest emailRequest) {
        try {
            // Parse the schedule time from the request
            Date date = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").parse(emailRequest.scheduleTime);

            // Schedule the email
            emailSchedulerService.scheduleEmail(emailRequest.recipient, emailRequest.subject, emailRequest.body, date);
            return "Email scheduled for " + emailRequest.recipient + " at " + emailRequest.scheduleTime;
        } catch (ParseException e) {
            return "Invalid date format. Use 'yyyy-MM-dd'T'HH:mm:ss'.";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error scheduling email: " + e.getMessage();
        }
    }
}
