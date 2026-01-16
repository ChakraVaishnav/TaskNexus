package com.tasknexus.service;

import java.util.*;

import org.springframework.web.multipart.MultipartFile;

import com.tasknexus.dto.UserDTO;
import com.tasknexus.entity.User;

public interface UserService {
    User saveUser(UserDTO userdto, MultipartFile profilePic); // Save user data

    List<User> getAllUsers();
    
    Optional<User> getUserByEmail(String email); // Retrieve user by email

    Optional<User> getUserById(Long id); // Retrieve user by ID (if needed)

    String checkPassword(String email, String password); // Verify login credentials
    
    User updateUser(Long id, UserDTO userdto);

	Long getCompletedTasks(Long id);

	boolean existsByEmail(String email);

	void resetPassword(String email, String newPassword);

	User updateProfilePic(Long id, MultipartFile profilePic);
}

