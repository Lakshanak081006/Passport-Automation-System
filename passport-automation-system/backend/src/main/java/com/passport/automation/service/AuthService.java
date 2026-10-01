package com.passport.automation.service;

import com.passport.automation.dto.LoginRequest;
import com.passport.automation.dto.LoginResponse;
import com.passport.automation.dto.RegisterRequest;
import com.passport.automation.entity.Role;
import com.passport.automation.entity.User;
import com.passport.automation.exception.BadRequestException;
import com.passport.automation.repository.UserRepository;
import com.passport.automation.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final EmailService emailService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager, JwtService jwtService,
                       EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }

    @Transactional
    public void register(RegisterRequest req) {
        String email = req.email().trim().toLowerCase();
        if (!req.password().equals(req.confirmPassword())) {
            throw new BadRequestException("Password and confirm password do not match");
        }
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("An account with this email already exists");
        }
        User user = new User();
        user.setFullName(req.fullName().trim());
        user.setDateOfBirth(req.dateOfBirth());
        user.setGender(req.gender());
        user.setEmail(email);
        user.setMobile(req.mobile());
        user.setAddress(req.address().trim());
        user.setPassword(passwordEncoder.encode(req.password()));
        user.setRole(Role.APPLICANT);   // public registration can only ever create applicants
        userRepository.save(user);
        emailService.sendRegistrationEmail(email, user.getFullName());
    }

    public LoginResponse login(LoginRequest req) {
        String email = req.email().trim().toLowerCase();
        // throws BadCredentialsException (-> 401) when wrong
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, req.password()));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));
        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());
        return new LoginResponse(token, user.getId(), user.getFullName(), user.getEmail(), user.getRole().name());
    }
}
