package com.tasknexus.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tasknexus.service.EmailService;
import com.tasknexus.service.OtpService;
import com.tasknexus.service.UserService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")

public class OtpController {

    @Autowired
    private EmailService emailService;

    @Autowired
    private OtpService otpService;
    
    @Autowired 
    private UserService userService;

    private final Map<String, String> otpStorage = new HashMap<>(); // Temporary OTP storage

    @PostMapping("/send-otp/{email}")
    public ResponseEntity<String> sendOtp(@PathVariable String email) {
    	System.out.println("Entered Backend");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }
        System.out.println("Extracted email: " + email);

        // Generate OTP
        String otp = otpService.generateOtp();
        otpStorage.put(email, otp); // Store OTP temporarily (use database in production)

        // Send OTP email
        String subject = "Your OTP Code for signing up into tasknexus";
        String text = "Your OTP code is: " + otp + ". It is valid for 5 minutes.";
        emailService.sendEmail(email, subject, text);

        return ResponseEntity.ok("OTP sent successfully to " + email);
    }

    @PostMapping("/forget-password/send-otp/{email}")
    public ResponseEntity<String> sendForgotPasswordOtp(@PathVariable String email) {
        // Check if email exists
    	if (email == null) {
            return ResponseEntity.badRequest().body("Email is required");
        }
        String otp=otpService.generateOtp();
        otpStorage.put(email, otp);
        
        //Send OTP
        
        String subject= "OTP code to reset your password";
        String text="Your OTP is: "+otp+" please do it fast, it is only valid for 5 minutes.";
        emailService.sendEmail(email, subject, text);
        
        		return ResponseEntity.ok("OTP sent successfully to "+ email);
    }

    @PostMapping("/verify-otp/{email}/{otp}")
    public ResponseEntity<String> verifyOtp(@PathVariable String email,@PathVariable String otp) {
        if (email == null || otp == null || !otpStorage.containsKey(email)) {
            return ResponseEntity.badRequest().body("Invalid OTP or email");
        }

        if (otpStorage.get(email).equals(otp)) {
            otpStorage.remove(email); // Remove OTP after successful verification
            return ResponseEntity.ok("OTP verified successfully");
        } else {
            return ResponseEntity.badRequest().body("Invalid OTP");
        }
    }
}
