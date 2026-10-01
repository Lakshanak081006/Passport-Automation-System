package com.passport.automation.dto;

import com.passport.automation.entity.User;
import java.time.LocalDate;

public record UserResponse(Long id, String fullName, LocalDate dateOfBirth, String gender,
                           String email, String mobile, String address, String role) {
    public static UserResponse from(User u) {
        return new UserResponse(u.getId(), u.getFullName(), u.getDateOfBirth(), u.getGender(),
                u.getEmail(), u.getMobile(), u.getAddress(), u.getRole().name());
    }
}
