package com.regret_mail_scheduler.regret_mail_scheduler.controller;

import com.regret_mail_scheduler.regret_mail_scheduler.model.ScheduledEmail;
import com.regret_mail_scheduler.regret_mail_scheduler.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/emails")
@CrossOrigin(origins = "https://regret-mail-scheduler-git-main-manishita-biswas-projects.vercel.app/")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @GetMapping
    public List<ScheduledEmail> getAllScheduledEmails() {
        return emailService.getAllScheduledEmails();
    }

    @PostMapping
    public Map<String, Long> sendEmail(@RequestBody ScheduledEmail email) {
        long emailId = emailService.scheduleEmail(email);
        return Map.of("id", emailId);
    }

    @PutMapping("/{id}")
    public String editEmail(@PathVariable Long id, @RequestBody ScheduledEmail newEmail) {
        if (emailService.canEditEmail(id)) {
            if (emailService.updateEmail(id, newEmail)) {
                return "Email updated successfully";
            }
            return "Email not found";
        }
        return "Email editing time has expired";
    }

    @DeleteMapping("/{id}")
    public String cancelEmail(@PathVariable Long id) {
        if (emailService.cancelEmail(id)) {
            return "Email canceled successfully";
        }
        return "Email not found or already sent";
    }
}
