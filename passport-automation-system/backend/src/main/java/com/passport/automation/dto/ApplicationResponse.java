package com.passport.automation.dto;

import com.passport.automation.entity.PassportApplication;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record ApplicationResponse(
        Long id, String applicationNumber, Long applicantId, String fullName, LocalDate dateOfBirth,
        String gender, String fatherName, String motherName, String maritalStatus, String email,
        String mobile, String address, String city, String state, String pincode, String passportType,
        String applicationType, String previousPassportNumber, String placeOfBirth,
        String countryOfBirth, String nationality, String status, String remarks,
        LocalDateTime createdAt, LocalDateTime updatedAt) {

    public static ApplicationResponse from(PassportApplication a) {
        return new ApplicationResponse(a.getId(), a.getApplicationNumber(), a.getApplicant().getId(),
                a.getFullName(), a.getDateOfBirth(), a.getGender(), a.getFatherName(), a.getMotherName(),
                a.getMaritalStatus(), a.getEmail(), a.getMobile(), a.getAddress(), a.getCity(), a.getState(),
                a.getPincode(), a.getPassportType().name(), a.getApplicationType().name(),
                a.getPreviousPassportNumber(), a.getPlaceOfBirth(), a.getCountryOfBirth(), a.getNationality(),
                a.getStatus().name(), a.getRemarks(), a.getCreatedAt(), a.getUpdatedAt());
    }
}
