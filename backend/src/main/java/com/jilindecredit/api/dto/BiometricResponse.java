package com.jilindecredit.api.dto;

import java.time.LocalDateTime;

public class BiometricResponse {
    private Long customerId;
    private String verificationStatus; // VERIFIED, FAILED, PENDING
    private String biometricHash;
    private LocalDateTime captureDate;
    private Boolean verified;
    private String message;
    private Double matchScore; // 0.0 to 1.0 for verification accuracy

    // Constructors
    public BiometricResponse() {}

    public BiometricResponse(Long customerId, String verificationStatus, Boolean verified, String message) {
        this.customerId = customerId;
        this.verificationStatus = verificationStatus;
        this.verified = verified;
        this.message = message;
        this.captureDate = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }

    public String getBiometricHash() { return biometricHash; }
    public void setBiometricHash(String biometricHash) { this.biometricHash = biometricHash; }

    public LocalDateTime getCaptureDate() { return captureDate; }
    public void setCaptureDate(LocalDateTime captureDate) { this.captureDate = captureDate; }

    public Boolean getVerified() { return verified; }
    public void setVerified(Boolean verified) { this.verified = verified; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Double getMatchScore() { return matchScore; }
    public void setMatchScore(Double matchScore) { this.matchScore = matchScore; }
}