package com.passport.automation.service;

import com.passport.automation.dto.PoliceVerificationRequest;
import com.passport.automation.dto.PoliceVerificationResponse;
import com.passport.automation.dto.RescheduleVerificationRequest;
import com.passport.automation.entity.*;
import com.passport.automation.exception.BadRequestException;
import com.passport.automation.exception.ResourceNotFoundException;
import com.passport.automation.repository.ApplicationStatusHistoryRepository;
import com.passport.automation.repository.PassportApplicationRepository;
import com.passport.automation.repository.PoliceVerificationRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Random;

@Service
public class PoliceVerificationService {

    private final PoliceVerificationRepository verificationRepository;
    private final PassportApplicationRepository applicationRepository;
    private final ApplicationStatusHistoryRepository historyRepository;
    private final EmailService emailService;

    public PoliceVerificationService(PoliceVerificationRepository verificationRepository,
                                       PassportApplicationRepository applicationRepository,
                                       ApplicationStatusHistoryRepository historyRepository,
                                       EmailService emailService) {
        this.verificationRepository = verificationRepository;
        this.applicationRepository = applicationRepository;
        this.historyRepository = historyRepository;
        this.emailService = emailService;
    }

    @Transactional
    public PoliceVerificationResponse scheduleAppointment(PoliceVerificationRequest req, User currentStaff) {
        PassportApplication app = applicationRepository.findById(req.applicationId())
                .orElseThrow(() -> new ResourceNotFoundException("Passport application not found with ID: " + req.applicationId()));

        Optional<PoliceVerification> existingOpt = verificationRepository.findByApplicationId(app.getId());

        PoliceVerification pv = existingOpt.orElseGet(PoliceVerification::new);
        pv.setApplication(app);
        pv.setPoliceStationName(req.policeStationName());
        pv.setPoliceStationAddress(req.policeStationAddress());
        pv.setVerificationDate(req.verificationDate());
        pv.setVerificationTime(req.verificationTime());
        pv.setInstructions(req.instructions());
        pv.setStatus(VerificationStatus.SCHEDULED);

        if (pv.getAppointmentNumber() == null) {
            pv.setAppointmentNumber(generateAppointmentNumber());
        }

        pv = verificationRepository.save(pv);

        // Update Application Status to POLICE_VERIFICATION_SCHEDULED
        ApplicationStatus oldStatus = app.getStatus();
        app.setStatus(ApplicationStatus.POLICE_VERIFICATION_SCHEDULED);
        app.setRemarks("Police verification scheduled at " + req.policeStationName() + " for " + req.verificationDate() + " " + req.verificationTime());
        applicationRepository.save(app);

        // Save Status History
        ApplicationStatusHistory history = new ApplicationStatusHistory();
        history.setApplication(app);
        history.setPreviousStatus(oldStatus);
        history.setNewStatus(ApplicationStatus.POLICE_VERIFICATION_SCHEDULED);
        history.setChangedBy(currentStaff);
        history.setRemarks("Police verification scheduled. Appointment ID: " + pv.getAppointmentNumber());
        historyRepository.save(history);

        // Notify user via Email
        emailService.sendPoliceVerificationScheduledEmail(
                app.getEmail(),
                app.getFullName(),
                app.getApplicationNumber(),
                req.policeStationName(),
                req.policeStationAddress(),
                req.verificationDate().toString(),
                req.verificationTime(),
                pv.getAppointmentNumber(),
                req.instructions()
        );

        return PoliceVerificationResponse.from(pv);
    }

    @Transactional(readOnly = true)
    public PoliceVerificationResponse getByApplicationId(Long applicationId, User currentUser) {
        PassportApplication app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Passport application not found with ID: " + applicationId));

        // Authorization check: APPLICANT can only view their own application verification
        if (currentUser.getRole() == Role.APPLICANT && !app.getApplicant().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You are not authorized to view this verification appointment.");
        }

        PoliceVerification pv = verificationRepository.findByApplicationId(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Police verification appointment not found for application ID: " + applicationId));

        return PoliceVerificationResponse.from(pv);
    }

    @Transactional(readOnly = true)
    public PoliceVerificationResponse getForCurrentApplicant(User currentApplicant) {
        PassportApplication app = applicationRepository.findFirstByApplicantIdOrderByCreatedAtDesc(currentApplicant.getId())
                .orElseThrow(() -> new ResourceNotFoundException("No passport application found for your account."));

        PoliceVerification pv = verificationRepository.findByApplicationId(app.getId())
                .orElseThrow(() -> new ResourceNotFoundException("No police verification appointment found yet for your application."));

        return PoliceVerificationResponse.from(pv);
    }

    @Transactional
    public PoliceVerificationResponse updateAppointment(Long id, PoliceVerificationRequest req, User currentStaff) {
        PoliceVerification pv = verificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Police verification appointment not found with ID: " + id));

        pv.setPoliceStationName(req.policeStationName());
        pv.setPoliceStationAddress(req.policeStationAddress());
        pv.setVerificationDate(req.verificationDate());
        pv.setVerificationTime(req.verificationTime());
        pv.setInstructions(req.instructions());

        pv = verificationRepository.save(pv);
        return PoliceVerificationResponse.from(pv);
    }

    @Transactional
    public PoliceVerificationResponse rescheduleAppointment(Long id, RescheduleVerificationRequest req, User currentStaff) {
        PoliceVerification pv = verificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Police verification appointment not found with ID: " + id));

        pv.setVerificationDate(req.verificationDate());
        pv.setVerificationTime(req.verificationTime());
        if (req.instructions() != null && !req.instructions().isBlank()) {
            pv.setInstructions(req.instructions());
        }
        pv.setStatus(VerificationStatus.RESCHEDULED);
        pv = verificationRepository.save(pv);

        PassportApplication app = pv.getApplication();
        app.setRemarks("Police verification rescheduled to " + req.verificationDate() + " at " + req.verificationTime());
        applicationRepository.save(app);

        // Notify user via Email
        emailService.sendPoliceVerificationRescheduledEmail(
                app.getEmail(),
                app.getFullName(),
                app.getApplicationNumber(),
                pv.getPoliceStationName(),
                req.verificationDate().toString(),
                req.verificationTime(),
                pv.getAppointmentNumber(),
                pv.getInstructions()
        );

        return PoliceVerificationResponse.from(pv);
    }

    @Transactional
    public PoliceVerificationResponse completeAppointment(Long id, String remarks, User currentStaff) {
        PoliceVerification pv = verificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Police verification appointment not found with ID: " + id));

        pv.setStatus(VerificationStatus.COMPLETED);
        pv = verificationRepository.save(pv);

        PassportApplication app = pv.getApplication();
        ApplicationStatus oldStatus = app.getStatus();
        app.setStatus(ApplicationStatus.POLICE_VERIFICATION_COMPLETED);
        String finalRemarks = (remarks != null && !remarks.isBlank()) ? remarks : "Police verification completed successfully.";
        app.setRemarks(finalRemarks);
        applicationRepository.save(app);

        // History
        ApplicationStatusHistory history = new ApplicationStatusHistory();
        history.setApplication(app);
        history.setPreviousStatus(oldStatus);
        history.setNewStatus(ApplicationStatus.POLICE_VERIFICATION_COMPLETED);
        history.setChangedBy(currentStaff);
        history.setRemarks(finalRemarks);
        historyRepository.save(history);

        // Email
        emailService.sendPoliceVerificationCompletedEmail(
                app.getEmail(),
                app.getFullName(),
                app.getApplicationNumber(),
                pv.getAppointmentNumber(),
                finalRemarks
        );

        return PoliceVerificationResponse.from(pv);
    }

    @Transactional
    public PoliceVerificationResponse cancelAppointment(Long id, String reason, User currentStaff) {
        PoliceVerification pv = verificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Police verification appointment not found with ID: " + id));

        pv.setStatus(VerificationStatus.CANCELLED);
        pv = verificationRepository.save(pv);

        PassportApplication app = pv.getApplication();
        ApplicationStatus oldStatus = app.getStatus();
        app.setStatus(ApplicationStatus.DOCUMENT_VERIFICATION); // Revert back to document verification status
        String finalReason = (reason != null && !reason.isBlank()) ? reason : "Police verification appointment cancelled.";
        app.setRemarks(finalReason);
        applicationRepository.save(app);

        // History
        ApplicationStatusHistory history = new ApplicationStatusHistory();
        history.setApplication(app);
        history.setPreviousStatus(oldStatus);
        history.setNewStatus(ApplicationStatus.DOCUMENT_VERIFICATION);
        history.setChangedBy(currentStaff);
        history.setRemarks("Verification appointment cancelled: " + finalReason);
        historyRepository.save(history);

        // Email
        emailService.sendPoliceVerificationCancelledEmail(
                app.getEmail(),
                app.getFullName(),
                app.getApplicationNumber(),
                pv.getAppointmentNumber(),
                finalReason
        );

        return PoliceVerificationResponse.from(pv);
    }

    private String generateAppointmentNumber() {
        int random = 10000 + new Random().nextInt(90000);
        return "PV-2026-" + random;
    }
}
