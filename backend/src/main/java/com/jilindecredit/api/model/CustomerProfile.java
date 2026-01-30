package com.jilindecredit.api.model;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "customer_profiles")
public class CustomerProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Enumerated(EnumType.STRING)
    @Column(name = "kyc_status")
    private KycStatus kycStatus;

    @Column(name = "kyc_verification_date")
    private LocalDateTime kycVerificationDate;

    @Column(name = "kyc_reference_number")
    private String kycReferenceNumber;

    @Column(name = "baseline_credit_score", precision = 5, scale = 2)
    private BigDecimal baselineCreditScore;

    @Enumerated(EnumType.STRING)
    @Column(name = "risk_category")
    private RiskCategory riskCategory;

    @Column(name = "onboarding_completed")
    private Boolean onboardingCompleted = false;

    @Column(name = "onboarding_completion_date")
    private LocalDateTime onboardingCompletionDate;

    @Column(name = "digital_literacy_level")
    private Integer digitalLiteracyLevel; // 1-5 scale

    @Column(name = "preferred_language")
    private String preferredLanguage;

    @Column(name = "voice_assistance_enabled")
    private Boolean voiceAssistanceEnabled = false;

    @Column(name = "phone_verified")
    private Boolean phoneVerified = false;

    @Column(name = "biometric_enabled")
    private Boolean biometricEnabled = false;

    @Column(name = "rejection_reason")
    private String rejectionReason;

    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum KycStatus {
        PENDING, IN_PROGRESS, VERIFIED, FAILED, EXPIRED, REJECTED
    }

    public enum RiskCategory {
        LOW, MEDIUM, HIGH, VERY_HIGH
    }

    // Constructors
    public CustomerProfile() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public KycStatus getKycStatus() { return kycStatus; }
    public void setKycStatus(KycStatus kycStatus) { this.kycStatus = kycStatus; }

    public LocalDateTime getKycVerificationDate() { return kycVerificationDate; }
    public void setKycVerificationDate(LocalDateTime kycVerificationDate) { this.kycVerificationDate = kycVerificationDate; }

    public String getKycReferenceNumber() { return kycReferenceNumber; }
    public void setKycReferenceNumber(String kycReferenceNumber) { this.kycReferenceNumber = kycReferenceNumber; }

    public BigDecimal getBaselineCreditScore() { return baselineCreditScore; }
    public void setBaselineCreditScore(BigDecimal baselineCreditScore) { this.baselineCreditScore = baselineCreditScore; }

    public RiskCategory getRiskCategory() { return riskCategory; }
    public void setRiskCategory(RiskCategory riskCategory) { this.riskCategory = riskCategory; }

    public Boolean getOnboardingCompleted() { return onboardingCompleted; }
    public void setOnboardingCompleted(Boolean onboardingCompleted) { this.onboardingCompleted = onboardingCompleted; }

    public LocalDateTime getOnboardingCompletionDate() { return onboardingCompletionDate; }
    public void setOnboardingCompletionDate(LocalDateTime onboardingCompletionDate) { this.onboardingCompletionDate = onboardingCompletionDate; }

    public Integer getDigitalLiteracyLevel() { return digitalLiteracyLevel; }
    public void setDigitalLiteracyLevel(Integer digitalLiteracyLevel) { this.digitalLiteracyLevel = digitalLiteracyLevel; }

    public String getPreferredLanguage() { return preferredLanguage; }
    public void setPreferredLanguage(String preferredLanguage) { this.preferredLanguage = preferredLanguage; }

    public Boolean getVoiceAssistanceEnabled() { return voiceAssistanceEnabled; }
    public void setVoiceAssistanceEnabled(Boolean voiceAssistanceEnabled) { this.voiceAssistanceEnabled = voiceAssistanceEnabled; }

    public Boolean getPhoneVerified() { return phoneVerified; }
    public void setPhoneVerified(Boolean phoneVerified) { this.phoneVerified = phoneVerified; }

    public Boolean getBiometricEnabled() { return biometricEnabled; }
    public void setBiometricEnabled(Boolean biometricEnabled) { this.biometricEnabled = biometricEnabled; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (kycStatus == null) {
            kycStatus = KycStatus.PENDING;
        }
        if (riskCategory == null) {
            riskCategory = RiskCategory.MEDIUM;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}