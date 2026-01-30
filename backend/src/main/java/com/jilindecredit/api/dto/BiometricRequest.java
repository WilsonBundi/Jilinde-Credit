package com.jilindecredit.api.dto;

import jakarta.validation.constraints.NotNull;

public class BiometricRequest {
    @NotNull(message = "Customer ID is required")
    private Long customerId;

    private String fingerprintData; // Base64 encoded fingerprint template
    private String facialData; // Base64 encoded facial recognition data
    private String biometricType; // FINGERPRINT, FACIAL, BOTH
    private String deviceId; // ID of the biometric capture device
    private String captureQuality; // HIGH, MEDIUM, LOW
    private String metadata; // Additional capture metadata

    // KYC-specific fields for enhanced verification
    private String documentScanData; // Base64 encoded scanned document image
    private String deviceInfo; // Device capabilities and security info
    private String captureEnvironment; // Lighting, background conditions
    private Boolean livenessRequired; // Whether liveness detection is required
    private String kycSessionId; // Unique session identifier for KYC process

    // Constructors
    public BiometricRequest() {}

    // Getters and Setters
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getFingerprintData() { return fingerprintData; }
    public void setFingerprintData(String fingerprintData) { this.fingerprintData = fingerprintData; }

    public String getFacialData() { return facialData; }
    public void setFacialData(String facialData) { this.facialData = facialData; }

    public String getBiometricType() { return biometricType; }
    public void setBiometricType(String biometricType) { this.biometricType = biometricType; }

    public String getDeviceId() { return deviceId; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }

    public String getCaptureQuality() { return captureQuality; }
    public void setCaptureQuality(String captureQuality) { this.captureQuality = captureQuality; }

    public String getMetadata() { return metadata; }
    public void setMetadata(String metadata) { this.metadata = metadata; }

    // KYC-specific getters and setters
    public String getDocumentScanData() { return documentScanData; }
    public void setDocumentScanData(String documentScanData) { this.documentScanData = documentScanData; }

    public String getDeviceInfo() { return deviceInfo; }
    public void setDeviceInfo(String deviceInfo) { this.deviceInfo = deviceInfo; }

    public String getCaptureEnvironment() { return captureEnvironment; }
    public void setCaptureEnvironment(String captureEnvironment) { this.captureEnvironment = captureEnvironment; }

    public Boolean getLivenessRequired() { return livenessRequired; }
    public void setLivenessRequired(Boolean livenessRequired) { this.livenessRequired = livenessRequired; }

    public String getKycSessionId() { return kycSessionId; }
    public void setKycSessionId(String kycSessionId) { this.kycSessionId = kycSessionId; }
}