package com.passport.automation.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "police_verifications")
public class PoliceVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "application_id", nullable = false, unique = true)
    private PassportApplication application;

    @Column(nullable = false, length = 150)
    private String policeStationName;

    @Column(nullable = false, length = 500)
    private String policeStationAddress;

    @Column(nullable = false)
    private LocalDate verificationDate;

    @Column(nullable = false, length = 30)
    private String verificationTime;

    @Column(nullable = false, unique = true, length = 50)
    private String appointmentNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private VerificationStatus status;

    @Column(length = 1000)
    private String instructions;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public PassportApplication getApplication() { return application; }
    public void setApplication(PassportApplication application) { this.application = application; }

    public String getPoliceStationName() { return policeStationName; }
    public void setPoliceStationName(String policeStationName) { this.policeStationName = policeStationName; }

    public String getPoliceStationAddress() { return policeStationAddress; }
    public void setPoliceStationAddress(String policeStationAddress) { this.policeStationAddress = policeStationAddress; }

    public LocalDate getVerificationDate() { return verificationDate; }
    public void setVerificationDate(LocalDate verificationDate) { this.verificationDate = verificationDate; }

    public String getVerificationTime() { return verificationTime; }
    public void setVerificationTime(String verificationTime) { this.verificationTime = verificationTime; }

    public String getAppointmentNumber() { return appointmentNumber; }
    public void setAppointmentNumber(String appointmentNumber) { this.appointmentNumber = appointmentNumber; }

    public VerificationStatus getStatus() { return status; }
    public void setStatus(VerificationStatus status) { this.status = status; }

    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
