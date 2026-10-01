package com.passport.automation.dto;

import com.passport.automation.entity.ApplicationType;
import com.passport.automation.entity.PassportType;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record PassportApplicationRequest(
        @NotBlank(message = "Full name is required") @Size(max = 100) String fullName,
        @NotNull(message = "Date of birth is required") @Past(message = "Date of birth must be in the past") LocalDate dateOfBirth,
        @NotBlank(message = "Gender is required") String gender,
        @NotBlank(message = "Father's name is required") @Size(max = 100) String fatherName,
        @NotBlank(message = "Mother's name is required") @Size(max = 100) String motherName,
        @NotBlank(message = "Marital status is required") String maritalStatus,
        @NotBlank(message = "Email is required") @Email(message = "Enter a valid email") String email,
        @NotBlank(message = "Mobile number is required")
        @Pattern(regexp = "^[6-9][0-9]{9}$", message = "Mobile must be a valid 10-digit number") String mobile,
        @NotBlank(message = "Address is required") @Size(max = 500) String address,
        @NotBlank(message = "City is required") @Size(max = 100) String city,
        @NotBlank(message = "State is required") @Size(max = 100) String state,
        @NotBlank(message = "Pincode is required")
        @Pattern(regexp = "^[1-9][0-9]{5}$", message = "Pincode must be 6 digits") String pincode,
        @NotNull(message = "Passport type is required") PassportType passportType,
        @NotNull(message = "Application type is required") ApplicationType applicationType,
        @Size(max = 30) String previousPassportNumber,
        @NotBlank(message = "Place of birth is required") @Size(max = 100) String placeOfBirth,
        @NotBlank(message = "Country of birth is required") @Size(max = 100) String countryOfBirth,
        @NotBlank(message = "Nationality is required") @Size(max = 100) String nationality) {
}
