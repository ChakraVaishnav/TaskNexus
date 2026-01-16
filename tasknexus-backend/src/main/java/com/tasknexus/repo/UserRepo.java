package com.tasknexus.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.tasknexus.entity.User;
@Repository
public interface UserRepo extends JpaRepository<User,Long> {
	Optional<User> findByEmail(String email);
	boolean existsByUsernameAndPassword(String username, String password);
	 @Query("SELECT u.completedTaskCount FROM User u WHERE u.id = :id")
	    Long getCompletedTaskCountByUserId(@Param("id") Long id);
	boolean existsByEmail(String email);
}
