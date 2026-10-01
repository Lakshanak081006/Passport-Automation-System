package com.passport.automation.service;

import com.passport.automation.dto.ApplicationResponse;
import com.passport.automation.dto.HistoryResponse;
import com.passport.automation.dto.PassportApplicationRequest;
import com.passport.automation.entity.*;
import com.passport.automation.exception.BadRequestException;
import com.passport.automation.exception.ResourceNotFoundException;
import com.passport.automation.repository.ApplicationStatusHistoryRepository;
import com.passport.automation.repository.PassportApplicationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Year;
import java.util.*;

@Service
public class PassportApplicationService {

    private final PassportApplicationRepository applicationRepository;
    private final ApplicationStatusHistoryRepository historyRepository;
    private final UserService userService;
    private final EmailService emailService;

    public PassportApplicationService(PassportApplicationRepository applicationRepository,
                                      ApplicationStatusHistoryRepository historyRepository,
                                      UserService userService, EmailService emailService) {
        this.applicationRepository = applicationRepository;
        this.historyRepository = historyRepository;
        this.userService = userService;
        this.emailService = emailService;
    }

    // ---------- Applicant side ----------

    @Transactional
    public ApplicationResponse submit(String email, PassportApplicationRequest req) {
        User applicant = userService.getByEmail(email);

        Optional<PassportApplication> existing =
                applicationRepository.findFirstByApplicantIdOrderByCreatedAtDesc(applicant.getId());
        if (existing.isPresent() && existing.get().getStatus() != ApplicationStatus.REJECTED) {
            throw new BadRequestException("You already have an active application: "
                    + existing.get().getApplicationNumber());
        }
        boolean renewal = req.applicationType() == ApplicationType.RENEWAL;
        if (renewal && (req.previousPassportNumber() == null || req.previousPassportNumber().isBlank())) {
            throw new BadRequestException("Previous passport number is required for renewal");
        }

        PassportApplication a = new PassportApplication();
        a.setApplicant(applicant);
        a.setApplicationNumber("TMP-" + UUID.randomUUID());   // replaced below once the id is known
        a.setFullName(req.fullName().trim());
        a.setDateOfBirth(req.dateOfBirth());
        a.setGender(req.gender());
        a.setFatherName(req.fatherName().trim());
        a.setMotherName(req.motherName().trim());
        a.setMaritalStatus(req.maritalStatus());
        a.setEmail(req.email().trim().toLowerCase());
        a.setMobile(req.mobile());
        a.setAddress(req.address().trim());
        a.setCity(req.city().trim());
        a.setState(req.state().trim());
        a.setPincode(req.pincode());
        a.setPassportType(req.passportType());
        a.setApplicationType(req.applicationType());
        a.setPreviousPassportNumber(renewal ? req.previousPassportNumber().trim() : null);
        a.setPlaceOfBirth(req.placeOfBirth().trim());
        a.setCountryOfBirth(req.countryOfBirth().trim());
        a.setNationality(req.nationality().trim());
        a.setStatus(ApplicationStatus.SUBMITTED);
        a.setRemarks("Application submitted");
        a = applicationRepository.save(a);

        a.setApplicationNumber(String.format("PAS%d%05d", Year.now().getValue(), a.getId()));
        applicationRepository.save(a);

        ApplicationStatusHistory h = new ApplicationStatusHistory();
        h.setApplication(a);
        h.setPreviousStatus(null);
        h.setNewStatus(ApplicationStatus.SUBMITTED);
        h.setChangedBy(applicant);
        h.setRemarks("Application submitted");
        historyRepository.save(h);

        emailService.sendApplicationSubmittedEmail(applicant.getEmail(), a.getFullName(), a.getApplicationNumber());
        return ApplicationResponse.from(a);
    }

    @Transactional(readOnly = true)
    public Optional<ApplicationResponse> getMyApplication(String email) {
        User applicant = userService.getByEmail(email);
        return applicationRepository.findFirstByApplicantIdOrderByCreatedAtDesc(applicant.getId())
                .map(ApplicationResponse::from);
    }

    @Transactional(readOnly = true)
    public List<HistoryResponse> getMyHistory(String email) {
        User applicant = userService.getByEmail(email);
        return applicationRepository.findFirstByApplicantIdOrderByCreatedAtDesc(applicant.getId())
                .map(a -> historyRepository.findByApplicationIdOrderByChangedAtAsc(a.getId()).stream()
                        .map(HistoryResponse::from).toList())
                .orElse(List.of());
    }

    // ---------- Status changer side ----------

    @Transactional(readOnly = true)
    public List<ApplicationResponse> listAll(String search) {
        List<PassportApplication> list;
        if (search == null || search.isBlank()) {
            list = applicationRepository.findAllByOrderByUpdatedAtDesc();
        } else {
            list = applicationRepository.search("%" + search.trim().toLowerCase() + "%");
        }
        return list.stream().map(ApplicationResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public ApplicationResponse getById(Long id) {
        return ApplicationResponse.from(find(id));
    }

    @Transactional(readOnly = true)
    public List<HistoryResponse> getHistory(Long applicationId) {
        find(applicationId);
        return historyRepository.findByApplicationIdOrderByChangedAtAsc(applicationId).stream()
                .map(HistoryResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public Map<String, Long> stats() {
        Map<String, Long> result = new LinkedHashMap<>();
        result.put("TOTAL", 0L);
        for (ApplicationStatus s : ApplicationStatus.values()) result.put(s.name(), 0L);
        long total = 0;
        for (Object[] row : applicationRepository.countByStatus()) {
            long count = (Long) row[1];
            result.put(((ApplicationStatus) row[0]).name(), count);
            total += count;
        }
        result.put("TOTAL", total);
        return result;
    }

    public PassportApplication find(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id " + id));
    }
}
