package com.tasknexus.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.tasknexus.dto.UserDTO;
import com.tasknexus.entity.User;
import com.tasknexus.exceptions.UserNotFoundException;
import com.tasknexus.service.UserService;

import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;
    // Save a new user
    
    @PostMapping("/save")
    public ResponseEntity<User> saveUser(
        @RequestPart("user") UserDTO userDTO,
        @RequestPart("profilePic") MultipartFile profilePic)
    {
        try {
            User savedUser = userService.saveUser(userDTO, profilePic);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }


    
    // Retrieve all users
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // Get user by ID with UserDTO
    @GetMapping("/{id}")
    public ResponseEntity<User> findById(@PathVariable Long id) {
        User user = userService.getUserById(id)
            .orElseThrow(() -> new UserNotFoundException("User not found"));
        return ResponseEntity.ok(user);
    }

    // Get user by email
    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        User user = userService.getUserByEmail(email)
            .orElseThrow(() -> new UserNotFoundException("User not found"));
        return ResponseEntity.ok(user);
    }


    // Check password for login
    @PostMapping("/login")
    public ResponseEntity<String> checkPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        String result = userService.checkPassword(email, password);
        return ResponseEntity.ok(result);
    }
    
    @PutMapping("/update-profile/{id}")
    public ResponseEntity<User> updateUser(@RequestBody UserDTO userdto,@PathVariable Long id){
    	return ResponseEntity.ok(userService.updateUser(id, userdto));
    }
    
    @GetMapping("/completedTasksCount/{id}")
    public ResponseEntity<Long> getCompletedTasks(@PathVariable Long id){
    	return ResponseEntity.ok(userService.getCompletedTasks(id));
    }
    
    
    
    @GetMapping("/check-email/{email}")
    public ResponseEntity<?> checkEmailExists(@PathVariable String email) {
        boolean exists = userService.existsByEmail(email);
        return ResponseEntity.ok(Collections.singletonMap("exists", exists));
    }
    
    @PostMapping("/forget-password/reset")
    public ResponseEntity<String> resetPassword(@RequestBody PasswordResetRequest request) {
        try {
            userService.resetPassword(request.getEmail(), request.getNewPassword());
            return ResponseEntity.ok("Password reset successful");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to reset password");
        }
    }
    
    @GetMapping("/profile-pic/{email}")
    public ResponseEntity<byte[]> getProfilePicByEmail(@PathVariable String email) {
        Optional<User> optionalUser = userService.getUserByEmail(email);
        
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            String base64Image = user.getProfilePhoto();

            if (base64Image != null) {
                byte[] imageBytes = Base64.getDecoder().decode(base64Image);

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.IMAGE_JPEG); // or IMAGE_PNG if needed
                return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
            }
        }

        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/update-profile-pic/{id}")
    public ResponseEntity<User> updateProfilePic(@PathVariable Long id ,
    		@RequestPart("profilePic") MultipartFile profilePic)
    {
    	return ResponseEntity.ok(userService.updateProfilePic(id, profilePic));
    }

    
}
    
    class PasswordResetRequest {
        private String email;
        private String newPassword;
        // getters and setters
		public String getEmail() {
			return email;
		}
		public void setEmail(String email) {
			this.email = email;
		}
		public String getNewPassword() {
			return newPassword;
		}
		public void setNewPassword(String newPassword) {
			this.newPassword = newPassword;
		}
    } 
