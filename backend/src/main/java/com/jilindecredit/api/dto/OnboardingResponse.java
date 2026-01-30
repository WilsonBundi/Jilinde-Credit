package com.jilindecredit.api.dto;

import com.jilindecredit.api.model.CustomerProfile;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class OnboardingResponse {
    private Long customerId;
    private String customerCode;
    private String firstName;
    private String lastName;
    private String kycStatus;
    private String kycReferenceNumber;
    private BigDecimal baselineCreditScore;
    private String riskCategory;
    private Boolean onboardingCompleted;
    private LocalDateTime createdAt;
    private String message;

    // Constructors
    public OnboardingResponse() {}

    public OnboardingResponse(Long customerId, String customerCode, String firstName, String lastName, 
                            CustomerProfile profile, String message) {
        this.customerId = customerId;
        this.customerCode = customerCode;
        this.firstName = firstName;
        this.lastName = lastName;
        this.message = message;
        
        if (profile != null) {
            this.kycStatus = profile.getKycStatus() != null ? profile.getKycStatus().name() : null;
            this.kycReferenceNumber = profile.getKycReferenceNumber();
            this.baselineCreditScore = profile.getBaselineCreditScore();
            this.riskCategory = profile.getRiskCategory() != null ? profile.getRiskCategory().name() : null;
            this.onboardingCompleted = profile.getOnboardingCompleted();
            this.createdAt = profile.getCreatedAt();
        }
    }

    // Getters and Setters
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getCustomerCode() { return customerCode; }
    public void setCustomerCode(String customerCode) { this.customerCode = customerCode; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getKycStatus() { return kycStatus; }
    public void setKycStatus(String kycStatus) { this.kycStatus = kycStatus; }

    public String getKycReferenceNumber() { return kycReferenceNumber; }
    public void setKycReferenceNumber(String kycReferenceNumber) { this.kycReferenceNumber = kycReferenceNumber; }

    public BigDecimal getBaselineCreditScore() { return baselineCreditScore; }
    public void setBaselineCreditScore(BigDecimal baselineCreditScore) { this.baselineCreditScore = baselineCreditScore; }

    public String getRiskCategory() { return riskCategory; }
    public void setRiskCategory(String riskCategory) { this.riskCategory = riskCategory; }

    public Boolean getOnboardingCompleted() { return onboardingCompleted; }
    public void setOnboardingCompleted(Boolean onboardingCompleted) { this.onboardingCompleted = onboardingCompleted; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}