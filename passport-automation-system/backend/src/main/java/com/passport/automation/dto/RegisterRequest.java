package com.passport.automation.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record RegisterRequest(
        @NotBlank(message = "Full name is required") @Size(max = 100) String fullName,
        @NotNull(message = "Date of birth is required") @Past(message = "Date of birth must be in the past") LocalDate dateOfBirth,
        @NotBlank(message = "Gender is required") String gender,
        @NotBlank(message = "Email is required") @Email(message = "Enter a valid email") String email,
        @NotBlank(message = "Mobile number is required")
        @Pattern(regexp = "^[6-9][0-9]{9}$", message = "Mobile must be a valid 10-digit number") String mobile,
        @NotBlank(message = "Address is required") @Size(max = 500) String address,
        @NotBlank(message = "Password is required") @Size(min = 8, max = 64, message = "Password must be 8-64 characters") String password,
        @NotBlank(message = "Confirm password is required") String confirmPassword) {
}
