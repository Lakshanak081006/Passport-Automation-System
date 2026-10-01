package com.passport.automation.repository;

import com.passport.automation.entity.PoliceVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PoliceVerificationRepository extends JpaRepository<PoliceVerification, Long> {
    Optional<PoliceVerification> findByApplicationId(Long applicationId);
    Optional<PoliceVerification> findByApplicationApplicantId(Long applicantId);
    Optional<PoliceVerification> findByAppointmentNumber(String appointmentNumber);
}
