package com.passport.automation.dto;

import com.passport.automation.entity.PoliceVerification;
import com.passport.automation.entity.VerificationStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record PoliceVerificationResponse(
        Long id,
        Long applicationId,
        String applicationNumber,
        String applicantName,
        String policeStationName,
        String policeStationAddress,
        LocalDate verificationDate,
        String verificationTime,
        String appointmentNumber,
        VerificationStatus status,
        String instructions,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static PoliceVerificationResponse from(PoliceVerification pv) {
        return new PoliceVerificationResponse(
                pv.getId(),
                pv.getApplication().getId(),
                pv.getApplication().getApplicationNumber(),
                pv.getApplication().getFullName(),
                pv.getPoliceStationName(),
                pv.getPoliceStationAddress(),
                pv.getVerificationDate(),
                pv.getVerificationTime(),
                pv.getAppointmentNumber(),
                pv.getStatus(),
                pv.getInstructions(),
                pv.getCreatedAt(),
                pv.getUpdatedAt()
        );
    }
}
