package com.passport.automation.service;

import com.passport.automation.dto.UserResponse;
import com.passport.automation.entity.User;
import com.passport.automation.exception.ResourceNotFoundException;
import com.passport.automation.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getByEmail(String email) {
        return userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public UserResponse getProfile(String email) {
        return UserResponse.from(getByEmail(email));
    }
}
