package com.tasknexus.repo;

import com.tasknexus.entity.Task;
import com.tasknexus.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepo extends JpaRepository<Task, Long> {
    List<Task> findByUser(User user);
    List<Task> findByStatusAndUser(String status, User user);
    @Query("SELECT t FROM Task t WHERE t.status = :status AND t.priority = :priority AND t.user = :user")
    List<Task> findByStatusAndPriorityAndUser(@Param("status") String status, @Param("priority") String priority, @Param("user") User user);
    List<Task> findByDueBeforeAndUser(LocalDateTime due, User user);
    Optional<Task> findByIdAndUser(Long id, User user);
    void deleteByIdAndUser(Long id, User user);
    @Query("SELECT COUNT(t) FROM Task t WHERE t.user.id = :userId AND t.status = :status")
    int countByUserIdAndStatus(@Param("userId") Long userId, @Param("status") String status);
}
