package com.tasknexus.service;

import org.quartz.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Date;

@Service
public class EmailSchedulerService {

    @Autowired
    private Scheduler scheduler;

    // Schedule the email reminder
    public void scheduleEmail(String recipient, String subject, String body, Date emailScheduleTime) throws SchedulerException {
        String jobKey = "emailJob_" + recipient;
        String triggerKey = "emailTrigger_" + recipient;
        JobKey emailJobKey = new JobKey(jobKey, "emailGroup");
        TriggerKey emailTriggerKey = new TriggerKey(triggerKey, "emailGroup");

        // If a job with the same key exists, delete it first
        if (scheduler.checkExists(emailJobKey)) {
            scheduler.deleteJob(emailJobKey);
        }

        // Define the email job
        JobDetail emailJobDetail = JobBuilder.newJob(com.tasknexus.jobs.EmailJob.class)
            .withIdentity(emailJobKey)
            .usingJobData("recipient", recipient)
            .usingJobData("subject", subject)
            .usingJobData("body", body)
            .build();

        // Define the email trigger
        Trigger emailTrigger = TriggerBuilder.newTrigger()
            .withIdentity(emailTriggerKey)
            .startAt(emailScheduleTime) // Time to send the email
            .withSchedule(SimpleScheduleBuilder.simpleSchedule())
            .build();

        // Schedule the email job
        scheduler.scheduleJob(emailJobDetail, emailTrigger);
    }
}
