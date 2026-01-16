package com.tasknexus.jobs;

import com.tasknexus.service.EmailService;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
@Component
public class EmailJob implements Job {

    @Autowired
    private EmailService emailService;
    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        String recipient = context.getJobDetail().getJobDataMap().getString("recipient");
        String subject = context.getJobDetail().getJobDataMap().getString("subject");
        String body = context.getJobDetail().getJobDataMap().getString("body");

        // Send the email
        try {
            emailService.sendEmail(recipient, subject, body);
            System.out.println("Email sent  to: "  + recipient);


        } catch (Exception e) {
            System.err.println("Failed to send email for : "+ recipient+ e.getMessage());
        }
    }
}
