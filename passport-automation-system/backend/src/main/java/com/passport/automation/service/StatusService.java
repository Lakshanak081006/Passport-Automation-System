package com.passport.automation.service;

import com.passport.automation.dto.ApplicationResponse;
import com.passport.automation.dto.StatusUpdateRequest;
import com.passport.automation.entity.ApplicationStatus;
import com.passport.automation.entity.ApplicationStatusHistory;
import com.passport.automation.entity.PassportApplication;
import com.passport.automation.entity.User;
import com.passport.automation.exception.BadRequestException;
import com.passport.automation.repository.ApplicationStatusHistoryRepository;
import com.passport.automation.repository.PassportApplicationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StatusService {

    private final PassportApplicationService applicationService;
    private final PassportApplicationRepository applicationRepository;
    private final ApplicationStatusHistoryRepository historyRepository;
    private final UserService userService;
    private final EmailService emailService;

    public StatusService(PassportApplicationService applicationService,
                         PassportApplicationRepository applicationRepository,
                         ApplicationStatusHistoryRepository historyRepository,
                         UserService userService, EmailService emailService) {
        this.applicationService = applicationService;
        this.applicationRepository = applicationRepository;
        this.historyRepository = historyRepository;
        this.userService = userService;
        this.emailService = emailService;
    }

    @Transactional
    public ApplicationResponse updateStatus(Long applicationId, StatusUpdateRequest req, String changerEmail) {
        PassportApplication app = applicationService.find(applicationId);
        User changer = userService.getByEmail(changerEmail);

        ApplicationStatus previous = app.getStatus();
        ApplicationStatus next = req.newStatus();
        String remarks = req.remarks() == null ? null : req.remarks().trim();

        if (previous == next) {
            throw new BadRequestException("Application is already in status " + next);
        }
        if (previous == ApplicationStatus.COMPLETED || previous == ApplicationStatus.REJECTED) {
            throw new BadRequestException("Application is closed (" + previous + ") and cannot be changed");
        }
        if (next == ApplicationStatus.REJECTED && (remarks == null || remarks.isEmpty())) {
            throw new BadRequestException("Remarks are required when rejecting an application");
        }

        app.setStatus(next);
        app.setRemarks(remarks);
        applicationRepository.save(app);

        ApplicationStatusHistory h = new ApplicationStatusHistory();
        h.setApplication(app);
        h.setPreviousStatus(previous);
        h.setNewStatus(next);
        h.setChangedBy(changer);
        h.setRemarks(remarks);
        historyRepository.save(h);

        User applicant = app.getApplicant();
        emailService.sendStatusChangedEmail(applicant.getEmail(), app.getFullName(),
                app.getApplicationNumber(), previous, next, remarks);

        return ApplicationResponse.from(app);
    }
}
