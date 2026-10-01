package com.passport.automation.controller;

import com.passport.automation.dto.PoliceVerificationRequest;
import com.passport.automation.dto.PoliceVerificationResponse;
import com.passport.automation.dto.RescheduleVerificationRequest;
import com.passport.automation.entity.User;
import com.passport.automation.service.PoliceVerificationService;
import com.passport.automation.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/verification")
public class PoliceVerificationController {

    private final PoliceVerificationService verificationService;
    private final UserService userService;

    public PoliceVerificationController(PoliceVerificationService verificationService, UserService userService) {
        this.verificationService = verificationService;
        this.userService = userService;
    }

    @PostMapping
    @PreAuthorize("hasRole('STATUS_CHANGER')")
    public ResponseEntity<PoliceVerificationResponse> scheduleAppointment(@Valid @RequestBody PoliceVerificationRequest req,
                                                                             Authentication auth) {
        User currentUser = userService.getByEmail(auth.getName());
        PoliceVerificationResponse resp = verificationService.scheduleAppointment(req, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }

    @GetMapping("/application/{applicationId}")
    public ResponseEntity<PoliceVerificationResponse> getByApplicationId(@PathVariable Long applicationId,
                                                                           Authentication auth) {
        User currentUser = userService.getByEmail(auth.getName());
        return ResponseEntity.ok(verificationService.getByApplicationId(applicationId, currentUser));
    }

    @GetMapping("/my-appointment")
    @PreAuthorize("hasRole('APPLICANT')")
    public ResponseEntity<PoliceVerificationResponse> getMyAppointment(Authentication auth) {
        User currentApplicant = userService.getByEmail(auth.getName());
        return ResponseEntity.ok(verificationService.getForCurrentApplicant(currentApplicant));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('STATUS_CHANGER')")
    public ResponseEntity<PoliceVerificationResponse> updateAppointment(@PathVariable Long id,
                                                                          @Valid @RequestBody PoliceVerificationRequest req,
                                                                          Authentication auth) {
        User currentUser = userService.getByEmail(auth.getName());
        return ResponseEntity.ok(verificationService.updateAppointment(id, req, currentUser));
    }

    @PutMapping("/{id}/reschedule")
    @PreAuthorize("hasRole('STATUS_CHANGER')")
    public ResponseEntity<PoliceVerificationResponse> rescheduleAppointment(@PathVariable Long id,
                                                                             @Valid @RequestBody RescheduleVerificationRequest req,
                                                                             Authentication auth) {
        User currentUser = userService.getByEmail(auth.getName());
        return ResponseEntity.ok(verificationService.rescheduleAppointment(id, req, currentUser));
    }

    @PutMapping("/{id}/complete")
    @PreAuthorize("hasRole('STATUS_CHANGER')")
    public ResponseEntity<PoliceVerificationResponse> completeAppointment(@PathVariable Long id,
                                                                           @RequestBody(required = false) Map<String, String> body,
                                                                           Authentication auth) {
        User currentUser = userService.getByEmail(auth.getName());
        String remarks = body != null ? body.get("remarks") : null;
        return ResponseEntity.ok(verificationService.completeAppointment(id, remarks, currentUser));
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasRole('STATUS_CHANGER')")
    public ResponseEntity<PoliceVerificationResponse> cancelAppointment(@PathVariable Long id,
                                                                         @RequestBody(required = false) Map<String, String> body,
                                                                         Authentication auth) {
        User currentUser = userService.getByEmail(auth.getName());
        String reason = body != null ? body.get("reason") : null;
        return ResponseEntity.ok(verificationService.cancelAppointment(id, reason, currentUser));
    }
}
