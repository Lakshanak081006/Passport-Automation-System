package com.passport.automation.service;

import com.passport.automation.entity.ApplicationStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final String mailUsername;
    private final String from;

    public EmailService(JavaMailSender mailSender,
                        @Value("${spring.mail.username:}") String mailUsername,
                        @Value("${app.mail.from}") String from) {
        this.mailSender = mailSender;
        this.mailUsername = mailUsername;
        this.from = from;
    }

    @Async
    public void sendRegistrationEmail(String to, String name) {
        send(to, "Welcome to Passport Automation System",
                "Dear " + name + ",\n\nWelcome to Passport Automation System.\n"
                        + "Your account has been created successfully. You can now log in and apply for a passport.\n\n"
                        + "Regards,\nPassport Automation System");
    }

    @Async
    public void sendApplicationSubmittedEmail(String to, String name, String applicationNumber) {
        send(to, "Passport Application Submitted",
                "Dear " + name + ",\n\nYour passport application has been submitted successfully.\n\n"
                        + "Application ID: " + applicationNumber + "\n"
                        + "Status: " + ApplicationStatus.SUBMITTED + "\n\n"
                        + "You can track your application from your dashboard.\n\n"
                        + "Regards,\nPassport Automation System");
    }

    @Async
    public void sendStatusChangedEmail(String to, String name, String applicationNumber,
                                       ApplicationStatus previous, ApplicationStatus current, String remarks) {
        send(to, "Passport Application Status Updated",
                "Dear " + name + ",\n\nYour passport application status has been updated.\n\n"
                        + "Application ID: " + applicationNumber + "\n"
                        + "Previous Status: " + previous + "\n"
                        + "New Status: " + current + "\n\n"
                        + "Remarks:\n" + (remarks == null || remarks.isBlank() ? "-" : remarks) + "\n\n"
                        + "Regards,\nPassport Automation System");
    }

    @Async
    public void sendPoliceVerificationScheduledEmail(String to, String name, String applicationNumber,
                                                     String policeStation, String address, String date, String time,
                                                     String appointmentId, String instructions) {
        send(to, "Police Verification Scheduled - Passport Application " + applicationNumber,
                "Dear " + name + ",\n\n"
                        + "Your Police Verification appointment for Passport Application (" + applicationNumber + ") has been scheduled.\n\n"
                        + "APPOINTMENT DETAILS:\n"
                        + "• Appointment ID: " + appointmentId + "\n"
                        + "• Police Station: " + policeStation + "\n"
                        + "• Address: " + address + "\n"
                        + "• Date: " + date + "\n"
                        + "• Time: " + time + "\n\n"
                        + "INSTRUCTIONS:\n" + (instructions == null || instructions.isBlank() ? "Please visit the police station at the scheduled date and time with original documents." : instructions) + "\n\n"
                        + "Regards,\nPassport Automation System");
    }

    @Async
    public void sendPoliceVerificationRescheduledEmail(String to, String name, String applicationNumber,
                                                       String policeStation, String newDate, String newTime,
                                                       String appointmentId, String instructions) {
        send(to, "Police Verification Rescheduled - Passport Application " + applicationNumber,
                "Dear " + name + ",\n\n"
                        + "Your Police Verification appointment for Passport Application (" + applicationNumber + ") has been RESCHEDULED.\n\n"
                        + "UPDATED APPOINTMENT DETAILS:\n"
                        + "• Appointment ID: " + appointmentId + "\n"
                        + "• Police Station: " + policeStation + "\n"
                        + "• New Date: " + newDate + "\n"
                        + "• New Time: " + newTime + "\n\n"
                        + "INSTRUCTIONS:\n" + (instructions == null || instructions.isBlank() ? "Please visit the police station at the updated date and time." : instructions) + "\n\n"
                        + "Regards,\nPassport Automation System");
    }

    @Async
    public void sendPoliceVerificationCancelledEmail(String to, String name, String applicationNumber,
                                                     String appointmentId, String reason) {
        send(to, "Police Verification Appointment Cancelled - Passport Application " + applicationNumber,
                "Dear " + name + ",\n\n"
                        + "Your Police Verification appointment (ID: " + appointmentId + ") for Passport Application (" + applicationNumber + ") has been CANCELLED.\n\n"
                        + "Reason:\n" + (reason == null || reason.isBlank() ? "Appointment cancelled by administration." : reason) + "\n\n"
                        + "Please log in to your dashboard for further updates.\n\n"
                        + "Regards,\nPassport Automation System");
    }

    @Async
    public void sendPoliceVerificationCompletedEmail(String to, String name, String applicationNumber,
                                                     String appointmentId, String remarks) {
        send(to, "Police Verification Completed - Passport Application " + applicationNumber,
                "Dear " + name + ",\n\n"
                        + "Great news! Your Police Verification (ID: " + appointmentId + ") for Passport Application (" + applicationNumber + ") has been marked as COMPLETED.\n\n"
                        + "Remarks:\n" + (remarks == null || remarks.isBlank() ? "Police verification successfully verified." : remarks) + "\n\n"
                        + "Your passport application is now moving to the next processing stage.\n\n"
                        + "Regards,\nPassport Automation System");
    }

    /** Sends the mail. Never throws: a mail problem must not break the main workflow. */
    private void send(String to, String subject, String body) {
        if (mailUsername == null || mailUsername.isBlank()) {
            log.info("[EMAIL NOT SENT - SMTP not configured] To: {} | Subject: {}\n{}", to, subject, body);
            return;
        }
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(mailUsername);
            msg.setTo(to);
            msg.setSubject(subject);
            msg.setText(body);
            mailSender.send(msg);
            log.info("Email sent to {} | {}", to, subject);
        } catch (Exception e) {
            log.error("Could not send email to {}: {}", to, e.getMessage());
        }
    }
}
