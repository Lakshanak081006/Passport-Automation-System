package com.passport.automation.dto;

import com.passport.automation.entity.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record StatusUpdateRequest(
        @NotNull(message = "New status is required") ApplicationStatus newStatus,
        @Size(max = 500, message = "Remarks can be at most 500 characters") String remarks) {
}
