package com.regret_mail_scheduler.regret_mail_scheduler.repository;

import com.regret_mail_scheduler.regret_mail_scheduler.model.ScheduledEmail;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailRepository extends JpaRepository<ScheduledEmail, Long> {
    List<ScheduledEmail> findByScheduledTimeBefore(LocalDateTime now);
    List<ScheduledEmail> findByScheduledTimeAfter(LocalDateTime now);
}