package com.passport.automation.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "passport_applications")
public class PassportApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 40)
    private String applicationNumber;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User applicant;

    @Column(nullable = false, length = 100) private String fullName;
    @Column(nullable = false) private LocalDate dateOfBirth;
    @Column(nullable = false, length = 20) private String gender;
    @Column(nullable = false, length = 100) private String fatherName;
    @Column(nullable = false, length = 100) private String motherName;
    @Column(nullable = false, length = 20) private String maritalStatus;
    @Column(nullable = false, length = 150) private String email;
    @Column(nullable = false, length = 15) private String mobile;
    @Column(nullable = false, length = 500) private String address;
    @Column(nullable = false, length = 100) private String city;
    @Column(nullable = false, length = 100) private String state;
    @Column(nullable = false, length = 10) private String pincode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PassportType passportType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ApplicationType applicationType;

    @Column(length = 30) private String previousPassportNumber;
    @Column(nullable = false, length = 100) private String placeOfBirth;
    @Column(nullable = false, length = 100) private String countryOfBirth;
    @Column(nullable = false, length = 100) private String nationality;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ApplicationStatus status;

    @Column(length = 500)
    private String remarks;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() { this.createdAt = LocalDateTime.now(); this.updatedAt = this.createdAt; }

    @PreUpdate
    void onUpdate() { this.updatedAt = LocalDateTime.now(); }

    public Long getId() { return id; }
    public String getApplicationNumber() { return applicationNumber; }
    public void setApplicationNumber(String v) { this.applicationNumber = v; }
    public User getApplicant() { return applicant; }
    public void setApplicant(User v) { this.applicant = v; }
    public String getFullName() { return fullName; }
    public void setFullName(String v) { this.fullName = v; }
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate v) { this.dateOfBirth = v; }
    public String getGender() { return gender; }
    public void setGender(String v) { this.gender = v; }
    public String getFatherName() { return fatherName; }
    public void setFatherName(String v) { this.fatherName = v; }
    public String getMotherName() { return motherName; }
    public void setMotherName(String v) { this.motherName = v; }
    public String getMaritalStatus() { return maritalStatus; }
    public void setMaritalStatus(String v) { this.maritalStatus = v; }
    public String getEmail() { return email; }
    public void setEmail(String v) { this.email = v; }
    public String getMobile() { return mobile; }
    public void setMobile(String v) { this.mobile = v; }
    public String getAddress() { return address; }
    public void setAddress(String v) { this.address = v; }
    public String getCity() { return city; }
    public void setCity(String v) { this.city = v; }
    public String getState() { return state; }
    public void setState(String v) { this.state = v; }
    public String getPincode() { return pincode; }
    public void setPincode(String v) { this.pincode = v; }
    public PassportType getPassportType() { return passportType; }
    public void setPassportType(PassportType v) { this.passportType = v; }
    public ApplicationType getApplicationType() { return applicationType; }
    public void setApplicationType(ApplicationType v) { this.applicationType = v; }
    public String getPreviousPassportNumber() { return previousPassportNumber; }
    public void setPreviousPassportNumber(String v) { this.previousPassportNumber = v; }
    public String getPlaceOfBirth() { return placeOfBirth; }
    public void setPlaceOfBirth(String v) { this.placeOfBirth = v; }
    public String getCountryOfBirth() { return countryOfBirth; }
    public void setCountryOfBirth(String v) { this.countryOfBirth = v; }
    public String getNationality() { return nationality; }
    public void setNationality(String v) { this.nationality = v; }
    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus v) { this.status = v; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String v) { this.remarks = v; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
