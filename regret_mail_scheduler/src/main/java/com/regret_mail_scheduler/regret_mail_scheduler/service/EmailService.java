package com.regret_mail_scheduler.regret_mail_scheduler.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.regret_mail_scheduler.regret_mail_scheduler.model.ScheduledEmail;

import java.util.*;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    private Map<Long, ScheduledEmail> emailStore = new HashMap<>();
    private Map<Long, Long> emailTimestamps = new HashMap<>();
    private long emailCounter = 1;

    public long scheduleEmail(ScheduledEmail email) {
        long emailId = emailCounter++;
        email.setId(emailId);
        emailStore.put(emailId, email);
        emailTimestamps.put(emailId, System.currentTimeMillis());

        // Schedule email after 10 minutes
        new Timer().schedule(new TimerTask() {
            @Override
            public void run() {
                if (emailStore.containsKey(emailId)) {
                    sendMail(email);
                    emailStore.remove(emailId);
                    emailTimestamps.remove(emailId);
                }
            }
        }, 10 * 60 * 1000);

        return emailId;
    }

    public boolean updateEmail(Long id, ScheduledEmail newEmail) {
        if (canEditEmail(id) && emailStore.containsKey(id)) {
            emailStore.put(id, newEmail);
            return true;
        }
        return false;
    }

    public boolean cancelEmail(Long id) {
        if (emailStore.containsKey(id)) {
            emailStore.remove(id);
            emailTimestamps.remove(id);
            return true;
        }
        return false;
    }

    private void sendMail(ScheduledEmail email) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email.getRecipient());
        message.setSubject(email.getSubject());
        message.setText(email.getMessage());
        mailSender.send(message);
    }

    public List<ScheduledEmail> getAllScheduledEmails() {
        return new ArrayList<>(emailStore.values());
    }

    public boolean canEditEmail(Long id) {
        Long timestamp = emailTimestamps.get(id);
        return timestamp != null && (System.currentTimeMillis() - timestamp) <= 10 * 60 * 1000;
    }
}
