package com.jilindecredit.api.model;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@Entity
@Table(name = "biometric_data")
public class BiometricData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Lob
    @Column(name = "fingerprint_data", columnDefinition = "BYTEA")
    private byte[] fingerprintData;

    @Lob
    @Column(name = "facial_data", columnDefinition = "BYTEA")
    private byte[] facialData;

    @Column(name = "biometric_hash")
    private String biometricHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status")
    private VerificationStatus verificationStatus;

    @Column(name = "verification_date")
    private LocalDateTime verificationDate;

    // KYC-specific fields
    @Column(name = "face_template")
    private String faceTemplate; // Encrypted face template for matching
    
    @Column(name = "liveness_captured")
    private Boolean livenessCaptured; // Whether liveness detection was performed
    
    @Column(name = "document_scanned")
    private Boolean documentScanned; // Whether document was scanned and verified
    
    @Column(name = "capture_date")
    private LocalDateTime captureDate; // When biometric was captured
    
    @Column(name = "device_info")
    private String deviceInfo; // Device used for capture
    
    @Column(name = "quality_score")
    private Double qualityScore; // Overall quality score (0-100)
    
    @Column(name = "verification_method")
    private String verificationMethod; // Method used for verification
    
    @Column(name = "kyc_session_id")
    private String kycSessionId; // Unique KYC session identifier

    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public enum VerificationStatus {
        PENDING, VERIFIED, FAILED, EXPIRED
    }

    // Constructors
    public BiometricData() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public byte[] getFingerprintData() { return fingerprintData; }
    public void setFingerprintData(byte[] fingerprintData) { this.fingerprintData = fingerprintData; }

    public byte[] getFacialData() { return facialData; }
    public void setFacialData(byte[] facialData) { this.facialData = facialData; }

    public String getBiometricHash() { return biometricHash; }
    public void setBiometricHash(String biometricHash) { this.biometricHash = biometricHash; }

    public VerificationStatus getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(VerificationStatus verificationStatus) { this.verificationStatus = verificationStatus; }

    public LocalDateTime getVerificationDate() { return verificationDate; }
    public void setVerificationDate(LocalDateTime verificationDate) { this.verificationDate = verificationDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // KYC-specific getters and setters
    public String getFaceTemplate() { return faceTemplate; }
    public void setFaceTemplate(String faceTemplate) { this.faceTemplate = faceTemplate; }

    public Boolean getLivenessCaptured() { return livenessCaptured; }
    public void setLivenessCaptured(Boolean livenessCaptured) { this.livenessCaptured = livenessCaptured; }

    public Boolean getDocumentScanned() { return documentScanned; }
    public void setDocumentScanned(Boolean documentScanned) { this.documentScanned = documentScanned; }

    public LocalDateTime getCaptureDate() { return captureDate; }
    public void setCaptureDate(LocalDateTime captureDate) { this.captureDate = captureDate; }

    public String getDeviceInfo() { return deviceInfo; }
    public void setDeviceInfo(String deviceInfo) { this.deviceInfo = deviceInfo; }

    public Double getQualityScore() { return qualityScore; }
    public void setQualityScore(Double qualityScore) { this.qualityScore = qualityScore; }

    public String getVerificationMethod() { return verificationMethod; }
    public void setVerificationMethod(String verificationMethod) { this.verificationMethod = verificationMethod; }

    public String getKycSessionId() { return kycSessionId; }
    public void setKycSessionId(String kycSessionId) { this.kycSessionId = kycSessionId; }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (verificationStatus == null) {
            verificationStatus = VerificationStatus.PENDING;
        }
    }
}