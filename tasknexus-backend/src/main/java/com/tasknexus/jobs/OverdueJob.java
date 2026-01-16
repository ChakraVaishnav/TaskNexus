package com.tasknexus.jobs;

import com.tasknexus.entity.Task;
import com.tasknexus.entity.User;
import com.tasknexus.repo.TaskRepo;
import com.tasknexus.service.EmailService;

import org.quartz.JobExecutionContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class OverdueJob extends QuartzJobBean {

    @Autowired
    private TaskRepo taskRepo;


    @Autowired
    private EmailService emailService;

    @Override
    protected void executeInternal(JobExecutionContext context) {
        String taskIdStr = context.getMergedJobDataMap().getString("taskId");
        Long taskId = Long.parseLong(taskIdStr);

        Optional<Task> optionalTask = taskRepo.findById(taskId);

        if (optionalTask.isPresent()) {
            Task task = optionalTask.get();
            task.setStatus("Overdue");
            taskRepo.save(task);

            User user = task.getUser();
            if (user != null) {
                try {
                    emailService.sendEmail(
                        user.getEmail(),
                        "Task Overdue: " + task.getTitle(),
                        "Hi " + user.getUsername() + ",\n\nYour task '" + task.getTitle() +
                        "' due on " + task.getDue() + " is now marked as *Overdue*.\n\nPlease take necessary action."
                    );
                    System.out.println("Overdue email sent to " + user.getEmail());
                } catch (Exception e) {
                    System.out.println("Failed to send overdue email: " + e.getMessage());
                    e.printStackTrace();
                }
            }
        }
    }
}
