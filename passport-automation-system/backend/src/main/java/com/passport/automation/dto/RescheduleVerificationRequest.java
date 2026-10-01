package com.passport.automation.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record RescheduleVerificationRequest(
        @NotNull(message = "Verification date is required") @FutureOrPresent(message = "Verification date cannot be in the past") LocalDate verificationDate,
        @NotBlank(message = "Verification time is required") @Size(max = 30) String verificationTime,
        @Size(max = 1000) String instructions
) {}
