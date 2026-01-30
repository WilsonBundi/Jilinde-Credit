package com.jilindecredit.api.dto;

import java.time.LocalDateTime;
import java.util.List;

public class KycVerificationResponse {
    private Long customerId;
    private String kycStatus; // VERIFIED, FAILED, PENDING
    private String kycReferenceNumber;
    private LocalDateTime verificationDate;
    private Boolean verified;
    private String message;
    private List<String> verificationDetails;
    private Double confidenceScore; // 0.0 to 1.0

    // Constructors
    public KycVerificationResponse() {}

    public KycVerificationResponse(Long customerId, String kycStatus, String kycReferenceNumber, 
                                 Boolean verified, String message) {
        this.customerId = customerId;
        this.kycStatus = kycStatus;
        this.kycReferenceNumber = kycReferenceNumber;
        this.verified = verified;
        this.message = message;
        this.verificationDate = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getKycStatus() { return kycStatus; }
    public void setKycStatus(String kycStatus) { this.kycStatus = kycStatus; }

    public String getKycReferenceNumber() { return kycReferenceNumber; }
    public void setKycReferenceNumber(String kycReferenceNumber) { this.kycReferenceNumber = kycReferenceNumber; }

    public LocalDateTime getVerificationDate() { return verificationDate; }
    public void setVerificationDate(LocalDateTime verificationDate) { this.verificationDate = verificationDate; }

    public Boolean getVerified() { return verified; }
    public void setVerified(Boolean verified) { this.verified = verified; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public List<String> getVerificationDetails() { return verificationDetails; }
    public void setVerificationDetails(List<String> verificationDetails) { this.verificationDetails = verificationDetails; }

    public Double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; }
}