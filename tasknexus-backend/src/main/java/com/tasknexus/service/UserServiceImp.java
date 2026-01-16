package com.tasknexus.service;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.tasknexus.dto.UserDTO;
import com.tasknexus.entity.User;
import com.tasknexus.repo.UserRepo;

@Service
public class UserServiceImp implements UserService {
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImp(UserRepo userRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }
    
    @Override
    public User saveUser(UserDTO userDTO, MultipartFile profilePic) {
        User user = new User();
        user.setUsername(userDTO.getUsername());

        // Handle profile picture
        if (profilePic != null && !profilePic.isEmpty()) {
            try {
                byte[] imageBytes = profilePic.getBytes();
                
                // Convert byte array to Base64 encoded string
                String encodedImage = Base64.getEncoder().encodeToString(imageBytes);
                user.setProfilePhoto(encodedImage);  // Store the Base64 string
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload profile picture", e);
            }
        }

        LocalDate dob = convertToLocalDate(userDTO.getDob());
        user.setDob(dob);
        user.setEmail(userDTO.getEmail());
        user.setGender(userDTO.getGender());
        user.setBio(userDTO.getBio());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));

        return userRepo.save(user);
    }

    @Override
    public List<User> getAllUsers() {
        return (List<User>) userRepo.findAll();
    }

    @Override
    public Optional<User> getUserByEmail(String email) {
        return userRepo.findByEmail(email);
    }

    @Override
    public Optional<User> getUserById(Long id) {
        return userRepo.findById(id);
    }

    @Override
    public String checkPassword(String email, String password) {
        Optional<User> userOptional = userRepo.findByEmail(email);

        if (userOptional.isEmpty()) {
            return "User does not exist"; // Custom message
        }

        User user = userOptional.get();
        if (passwordEncoder.matches(password, user.getPassword())) {
            return "Login successful";
        } else {
            return "Incorrect password";
        }
    }
    
    @Override
    public User updateUser(Long id, UserDTO userdto) {
    	Optional<User> existingUserOp=userRepo.findById(id);
    	User existingUser=existingUserOp.get();
    	if(userdto.getUsername()!=null) {
    		existingUser.setUsername(userdto.getUsername());
    	}
    	if(userdto.getBio()!=null) {
    		existingUser.setBio(userdto.getBio());
    	}
    	if(userdto.getDob()!=null) {
    		LocalDate dob=convertToLocalDate(userdto.getDob());
    		existingUser.setDob(dob);
    	}
    	if(userdto.getEmail()!=null) {
    		existingUser.setEmail(userdto.getEmail());
    	}
    	if(userdto.getGender()!=null) {
    		existingUser.setGender(userdto.getGender());
    	}
    	if(userdto.getPassword()!=null) {
    		existingUser.setPassword(userdto.getPassword());
    	}
    	return userRepo.save(existingUser);
    }

    private LocalDate convertToLocalDate(String dateString) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd"); // Use the provided format
        try {
            Objects.requireNonNull(dateString, "Date string cannot be null");
            return LocalDate.parse(dateString, formatter);
        } catch (DateTimeParseException e) {
            throw new RuntimeException("Invalid date format, expected yyyy-MM-dd: " + dateString, e);
        }
    }

	@Override
	public Long getCompletedTasks(Long id) {
		Long completedTasks= userRepo.getCompletedTaskCountByUserId(id);
		return completedTasks;
	}

	
	@Override
	 public boolean existsByEmail(String email) {
	    return userRepo.existsByEmail(email);
	 }

	@Override
	public void resetPassword(String email, String newPassword) {
        User user = userRepo.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Encode the new password
        String encodedPassword = passwordEncoder.encode(newPassword);
        
        // Update the user's password
        user.setPassword(encodedPassword);
        
        // Save the updated user
        userRepo.save(user);
    }

	@Override
	public User updateProfilePic(Long id, MultipartFile profilePic) {
		Optional<User> existingUserOp=userRepo.findById(id);
    	User existingUser=existingUserOp.get();
    	try {
            byte[] imageBytes = profilePic.getBytes();
            
            // Convert byte array to Base64 encoded string
            String encodedImage = Base64.getEncoder().encodeToString(imageBytes);
            existingUser.setProfilePhoto(encodedImage);  // Store the Base64 string
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload profile picture", e);
        }
    	
    	return userRepo.save(existingUser);
	}
	
}
