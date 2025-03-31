package com.regret_mail_scheduler.regret_mail_scheduler.controller;


import com.regret_mail_scheduler.regret_mail_scheduler.model.ScheduledEmail;
import com.regret_mail_scheduler.regret_mail_scheduler.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/emails")
@CrossOrigin(origins = "*")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping
    public Map<String, Long> sendEmail(@RequestBody ScheduledEmail email) {
        long emailId = emailService.scheduleEmail(email);
        return Map.of("id", emailId);
    }

    @PutMapping("/{id}")
    public String editEmail(@PathVariable Long id, @RequestBody ScheduledEmail newEmail) {
        if (emailService.updateEmail(id, newEmail)) {
            return "Email updated successfully";
        }
        return "Email not found or already sent";
    }

    @DeleteMapping("/{id}")
    public String cancelEmail(@PathVariable Long id) {
        if (emailService.cancelEmail(id)) {
            return "Email canceled successfully";
        }
        return "Email not found or already sent";
    }
}

