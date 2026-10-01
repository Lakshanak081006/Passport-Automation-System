package com.passport.automation.dto;

import com.passport.automation.entity.ApplicationStatusHistory;
import java.time.LocalDateTime;

public record HistoryResponse(Long id, Long applicationId, String applicationNumber, String previousStatus,
                              String newStatus, String changedBy, String remarks, LocalDateTime changedAt) {
    public static HistoryResponse from(ApplicationStatusHistory h) {
        return new HistoryResponse(h.getId(), h.getApplication().getId(), h.getApplication().getApplicationNumber(),
                h.getPreviousStatus() == null ? null : h.getPreviousStatus().name(),
                h.getNewStatus().name(), h.getChangedBy().getFullName(), h.getRemarks(), h.getChangedAt());
    }
}
