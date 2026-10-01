package com.passport.automation.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "application_status_history")
public class ApplicationStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "application_id", nullable = false)
    private PassportApplication application;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private ApplicationStatus previousStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ApplicationStatus newStatus;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "changed_by", nullable = false)
    private User changedBy;

    @Column(length = 500)
    private String remarks;

    @Column(nullable = false, updatable = false)
    private LocalDateTime changedAt;

    @PrePersist
    void onCreate() { this.changedAt = LocalDateTime.now(); }

    public Long getId() { return id; }
    public PassportApplication getApplication() { return application; }
    public void setApplication(PassportApplication v) { this.application = v; }
    public ApplicationStatus getPreviousStatus() { return previousStatus; }
    public void setPreviousStatus(ApplicationStatus v) { this.previousStatus = v; }
    public ApplicationStatus getNewStatus() { return newStatus; }
    public void setNewStatus(ApplicationStatus v) { this.newStatus = v; }
    public User getChangedBy() { return changedBy; }
    public void setChangedBy(User v) { this.changedBy = v; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String v) { this.remarks = v; }
    public LocalDateTime getChangedAt() { return changedAt; }
}
