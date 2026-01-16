package com.tasknexus.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);

        try {
            mailSender.send(message);
            System.out.println("Email sent successfully to: " + to);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }

    @Value("${spring.mail.username}")
    private String fromEmail;
    
    public void sendForgotPasswordEmail(String email, String otp) {
        String subject = "Password Reset OTP";
        String content = String.format(
            "Your OTP for password reset is: %s\n\n" +
            "This OTP is valid for 10 minutes.\n\n" +
            "If you didn't request this password reset, please ignore this email.",
            otp
        );
        
        sendEmail(email, subject, content);
    }
}
