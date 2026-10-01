package com.passport.automation.controller;

import com.passport.automation.dto.ApplicationResponse;
import com.passport.automation.dto.HistoryResponse;
import com.passport.automation.dto.StatusUpdateRequest;
import com.passport.automation.service.PassportApplicationService;
import com.passport.automation.service.StatusService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/status-changer")
public class StatusChangerController {

    private final PassportApplicationService applicationService;
    private final StatusService statusService;

    public StatusChangerController(PassportApplicationService applicationService, StatusService statusService) {
        this.applicationService = applicationService;
        this.statusService = statusService;
    }

    @GetMapping("/stats")
    public Map<String, Long> stats() {
        return applicationService.stats();
    }

    @GetMapping("/applications")
    public List<ApplicationResponse> list(@RequestParam(required = false) String search) {
        return applicationService.listAll(search);
    }

    @GetMapping("/applications/{id}")
    public ApplicationResponse get(@PathVariable Long id) {
        return applicationService.getById(id);
    }

    @PutMapping("/applications/{id}/status")
    public ApplicationResponse updateStatus(@PathVariable Long id,
                                            @Valid @RequestBody StatusUpdateRequest request,
                                            Authentication auth) {
        return statusService.updateStatus(id, request, auth.getName());
    }

    @GetMapping("/applications/{id}/history")
    public List<HistoryResponse> history(@PathVariable Long id) {
        return applicationService.getHistory(id);
    }
}
