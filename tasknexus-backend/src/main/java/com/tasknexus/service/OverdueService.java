package com.tasknexus.service;

import com.tasknexus.jobs.OverdueJob;
import com.tasknexus.repo.TaskRepo;
import org.quartz.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class OverdueService {

    @Autowired
    private Scheduler scheduler;

    @Autowired
    private TaskRepo taskRepo;

    public void scheduleOverdueJob(Long taskId, Date scheduleTime) throws SchedulerException {
        String jobKeyStr = "overdueJob_" + taskId;
        String triggerKeyStr = "overdueTrigger_" + taskId;
        JobKey jobKey = new JobKey(jobKeyStr, "overdueGroup");
        TriggerKey triggerKey = new TriggerKey(triggerKeyStr, "overdueGroup");

        if (scheduler.checkExists(jobKey)) {
            scheduler.deleteJob(jobKey);
        }

        JobDetail overdueJobDetail = JobBuilder.newJob(OverdueJob.class)
            .withIdentity(jobKey)
            .usingJobData("taskId", taskId.toString())
            .build();

        Trigger overdueTrigger = TriggerBuilder.newTrigger()
            .withIdentity(triggerKey)
            .startAt(scheduleTime)
            .withSchedule(SimpleScheduleBuilder.simpleSchedule())
            .build();

        scheduler.scheduleJob(overdueJobDetail, overdueTrigger);

        System.out.println("Overdue job scheduled for Task ID " + taskId + " at " + scheduleTime);
    }

    public void markTaskAsOverdue(Long taskId) {
        taskRepo.findById(taskId).ifPresent(task -> {
            task.setStatus("Overdue");
            taskRepo.save(task);
            System.out.println("Task ID " + taskId + " marked as Overdue.");
        });
    }
}
