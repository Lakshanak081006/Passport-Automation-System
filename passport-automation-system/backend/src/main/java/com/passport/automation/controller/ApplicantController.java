package com.passport.automation.controller;

import com.passport.automation.dto.UserResponse;
import com.passport.automation.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/applicant")
public class ApplicantController {

    private final UserService userService;

    public ApplicantController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public UserResponse profile(Authentication auth) {
        return userService.getProfile(auth.getName());
    }
}
