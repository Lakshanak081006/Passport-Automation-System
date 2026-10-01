package com.passport.automation.controller;

import com.passport.automation.dto.ApplicationResponse;
import com.passport.automation.dto.HistoryResponse;
import com.passport.automation.dto.PassportApplicationRequest;
import com.passport.automation.service.PassportApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applicant/application")
public class PassportApplicationController {

    private final PassportApplicationService service;

    public PassportApplicationController(PassportApplicationService service) {
        this.service = service;
    }

    /** 200 with the application, or 204 if the applicant has not applied yet. */
    @GetMapping
    public ResponseEntity<ApplicationResponse> myApplication(Authentication auth) {
        return service.getMyApplication(auth.getName())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.noContent().build());
    }

    @PostMapping
    public ResponseEntity<ApplicationResponse> submit(@Valid @RequestBody PassportApplicationRequest request,
                                                      Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.submit(auth.getName(), request));
    }

    @GetMapping("/history")
    public List<HistoryResponse> myHistory(Authentication auth) {
        return service.getMyHistory(auth.getName());
    }
}
