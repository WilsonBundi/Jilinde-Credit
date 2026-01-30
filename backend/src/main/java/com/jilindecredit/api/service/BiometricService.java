package com.jilindecredit.api.service;

import com.jilindecredit.api.dto.BiometricRequest;
import com.jilindecredit.api.dto.BiometricResponse;
import com.jilindecredit.api.model.BiometricData;
import com.jilindecredit.api.model.Customer;
import com.jilindecredit.api.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
@Transactional
public class BiometricService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private DocumentVerificationService documentVerificationService;

    /**
     * Comprehensive KYC biometric capture including document scanning and face verification
     * Requires mobile device or camera access for live verification
     */
    public BiometricResponse captureKycBiometric(BiometricRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        try {
            // STEP 1: Validate device capabilities for KYC
            validateDeviceCapabilities(request);

            // STEP 2: Perform live face verification with liveness detection
            LiveFaceResult faceResult = performLiveFaceVerification(request);
            
            // STEP 3: Perform document scanning and OCR extraction
            DocumentScanResult documentResult = performDocumentScanning(request);
            
            // STEP 4: Cross-verify live face with document photo
            boolean faceDocumentMatch = crossVerifyFaceWithDocument(
                faceResult.faceData, documentResult.documentPhotoData
            );

            if (!faceDocumentMatch) {
                throw new IllegalArgumentException("🚨 SECURITY ALERT: Live face does not match document photo. KYC verification failed for security reasons.");
            }

            // STEP 5: Validate extracted document data against customer profile
            validateDocumentDataConsistency(customer, documentResult.extractedData);

            // Get or create biometric data
            BiometricData biometricData = customer.getBiometricData();
            if (biometricData == null) {
                biometricData = new BiometricData();
                biometricData.setCustomer(customer);
                customer.setBiometricData(biometricData);
            }

            // Store comprehensive KYC biometric data
            biometricData.setFaceTemplate(faceResult.faceData);
            biometricData.setLivenessCaptured(faceResult.livenessDetected);
            biometricData.setDocumentScanned(true);
            biometricData.setCaptureDate(LocalDateTime.now());
            biometricData.setDeviceInfo(request.getDeviceInfo());
            biometricData.setVerificationMethod("MOBILE_KYC_LIVE_CAPTURE");
            
            // Calculate comprehensive quality score
            double qualityScore = calculateKycQualityScore(faceResult, documentResult, request);
            biometricData.setQualityScore(qualityScore);
            
            // Generate secure biometric hash
            String biometricHash = generateKycBiometricHash(request, faceResult, documentResult);
            biometricData.setBiometricHash(biometricHash);
            biometricData.setVerificationStatus(BiometricData.VerificationStatus.VERIFIED);
            biometricData.setVerificationDate(LocalDateTime.now());

            customerRepository.save(customer);

            return new BiometricResponse(
                customer.getId(),
                "VERIFIED",
                true,
                "✅ KYC Biometric verification completed successfully. Live face verified against document photo with " + 
                String.format("%.1f", qualityScore) + "% confidence."
            );

        } catch (IllegalArgumentException e) {
            return new BiometricResponse(
                customer.getId(),
                "FAILED",
                false,
                e.getMessage()
            );
        } catch (Exception e) {
            return new BiometricResponse(
                customer.getId(),
                "FAILED",
                false,
                "❌ KYC verification failed: " + e.getMessage()
            );
        }
    }

    public BiometricResponse captureBiometric(BiometricRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        try {
            // Get or create biometric data
            BiometricData biometricData = customer.getBiometricData();
            if (biometricData == null) {
                biometricData = new BiometricData();
                biometricData.setCustomer(customer);
                customer.setBiometricData(biometricData);
            }

            // Process and encrypt biometric data
            boolean processed = processBiometricData(biometricData, request);

            if (processed) {
                // Generate biometric hash for verification
                String biometricHash = generateBiometricHash(request);
                biometricData.setBiometricHash(biometricHash);
                biometricData.setVerificationStatus(BiometricData.VerificationStatus.VERIFIED);
                biometricData.setVerificationDate(LocalDateTime.now());

                customerRepository.save(customer);

                return new BiometricResponse(
                    customer.getId(),
                    "VERIFIED",
                    true,
                    "Biometric data captured and verified successfully"
                );
            } else {
                biometricData.setVerificationStatus(BiometricData.VerificationStatus.FAILED);
                
                return new BiometricResponse(
                    customer.getId(),
                    "FAILED",
                    false,
                    "Biometric data capture failed. Please try again with better quality data."
                );
            }

        } catch (Exception e) {
            return new BiometricResponse(
                customer.getId(),
                "FAILED",
                false,
                "Error processing biometric data: " + e.getMessage()
            );
        }
    }

    public BiometricResponse verifyBiometric(BiometricRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        BiometricData storedBiometric = customer.getBiometricData();
        if (storedBiometric == null) {
            return new BiometricResponse(
                customer.getId(),
                "FAILED",
                false,
                "No biometric data found for customer"
            );
        }

        try {
            // Generate hash for incoming biometric data
            String incomingHash = generateBiometricHash(request);
            
            // Compare with stored hash
            boolean matches = storedBiometric.getBiometricHash().equals(incomingHash);
            
            // Calculate match score (mock implementation)
            double matchScore = matches ? 0.95 : 0.45; // High confidence for exact match

            BiometricResponse response = new BiometricResponse(
                customer.getId(),
                matches ? "VERIFIED" : "FAILED",
                matches,
                matches ? "Biometric verification successful" : "Biometric verification failed"
            );
            
            response.setMatchScore(matchScore);
            response.setBiometricHash(incomingHash);

            return response;

        } catch (Exception e) {
            return new BiometricResponse(
                customer.getId(),
                "FAILED",
                false,
                "Error verifying biometric data: " + e.getMessage()
            );
        }
    }

    private boolean processBiometricData(BiometricData biometricData, BiometricRequest request) {
        try {
            // In a real implementation, this would:
            // 1. Validate biometric data quality
            // 2. Extract biometric templates
            // 3. Encrypt data using AES-256
            // 4. Store encrypted data

            // Mock implementation - store encrypted Base64 data
            if (request.getFingerprintData() != null && !request.getFingerprintData().isEmpty()) {
                byte[] encryptedFingerprint = encryptBiometricData(request.getFingerprintData());
                biometricData.setFingerprintData(encryptedFingerprint);
            }

            if (request.getFacialData() != null && !request.getFacialData().isEmpty()) {
                byte[] encryptedFacial = encryptBiometricData(request.getFacialData());
                biometricData.setFacialData(encryptedFacial);
            }

            // Validate data quality (mock)
            return validateBiometricQuality(request);

        } catch (Exception e) {
            return false;
        }
    }

    private byte[] encryptBiometricData(String data) {
        // Mock encryption - in real implementation, use AES-256
        // This would integrate with a proper encryption service
        try {
            // Simple Base64 encoding as placeholder for AES-256 encryption
            return Base64.getEncoder().encode(data.getBytes(StandardCharsets.UTF_8));
        } catch (Exception e) {
            throw new RuntimeException("Failed to encrypt biometric data", e);
        }
    }

    private boolean validateBiometricQuality(BiometricRequest request) {
        // Mock quality validation
        // In real implementation, this would analyze:
        // - Image/template quality scores
        // - Capture conditions
        // - Data completeness
        
        String quality = request.getCaptureQuality();
        return quality != null && !quality.equals("LOW");
    }

    private String generateBiometricHash(BiometricRequest request) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            
            StringBuilder dataToHash = new StringBuilder();
            if (request.getFingerprintData() != null) {
                dataToHash.append(request.getFingerprintData());
            }
            if (request.getFacialData() != null) {
                dataToHash.append(request.getFacialData());
            }
            
            byte[] hash = digest.digest(dataToHash.toString().getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
            
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Failed to generate biometric hash", e);
        }
    }

    // KYC-specific methods for enhanced security

    /**
     * Validates that the device has necessary capabilities for KYC verification
     */
    private void validateDeviceCapabilities(BiometricRequest request) {
        String deviceInfo = request.getDeviceInfo();
        
        if (deviceInfo == null || deviceInfo.isEmpty()) {
            throw new IllegalArgumentException("📱 Device information is required for KYC verification. Please ensure camera access is enabled.");
        }

        // Check for camera capability
        if (!deviceInfo.toLowerCase().contains("camera") && !deviceInfo.toLowerCase().contains("webcam")) {
            throw new IllegalArgumentException("📷 Camera access is required for biometric KYC. Please use a mobile device or computer with camera and grant camera permissions.");
        }

        // Recommend mobile device for better security
        boolean isMobile = deviceInfo.toLowerCase().contains("mobile") || 
                          deviceInfo.toLowerCase().contains("android") || 
                          deviceInfo.toLowerCase().contains("iphone") ||
                          deviceInfo.toLowerCase().contains("ios");

        if (!isMobile) {
            System.out.println("⚠️ WARNING: Desktop device detected. Mobile device recommended for enhanced KYC security.");
        }
    }

    /**
     * Performs live face verification with liveness detection
     */
    private LiveFaceResult performLiveFaceVerification(BiometricRequest request) {
        String faceData = request.getFacialData();
        if (faceData == null || faceData.length() < 100) {
            throw new IllegalArgumentException("📸 Invalid face capture. Please ensure:\n• Good lighting on your face\n• Face is clearly visible and centered\n• Remove glasses/masks if possible\n• Hold device steady");
        }

        // Simulate liveness detection
        boolean livenessDetected = simulateLivenessDetection(faceData);
        if (!livenessDetected) {
            throw new IllegalArgumentException("🤖 Liveness detection failed. Please ensure:\n• You are physically present (not using a photo)\n• Look directly at camera\n• Blink naturally during capture\n• Avoid using photos or videos");
        }

        // Simulate face quality assessment
        double faceQuality = simulateFaceQualityAssessment(faceData);
        if (faceQuality < 70.0) {
            throw new IllegalArgumentException("📷 Face image quality too low (" + String.format("%.1f", faceQuality) + "%). Please:\n• Ensure good lighting\n• Clean camera lens\n• Face camera directly\n• Remove shadows from face");
        }

        return new LiveFaceResult(faceData, livenessDetected, faceQuality);
    }

    /**
     * Performs document scanning and OCR extraction
     */
    private DocumentScanResult performDocumentScanning(BiometricRequest request) {
        String documentData = request.getDocumentScanData();
        if (documentData == null || documentData.length() < 100) {
            throw new IllegalArgumentException("📄 Document scan required. Please:\n• Scan your ID document using device camera\n• Ensure document is well-lit\n• All text must be clearly visible\n• Scan both sides for National ID");
        }

        // Simulate document quality assessment
        double documentQuality = simulateDocumentQualityAssessment(documentData);
        if (documentQuality < 75.0) {
            throw new IllegalArgumentException("📄 Document scan quality too low (" + String.format("%.1f", documentQuality) + "%). Please:\n• Ensure document is well-lit\n• All text is clearly readable\n• No shadows or glare on document\n• Hold camera steady while scanning");
        }

        // Simulate OCR extraction
        java.util.Map<String, String> extractedData = simulateOcrExtraction(documentData);
        
        // Simulate document photo extraction
        String documentPhotoData = simulateDocumentPhotoExtraction(documentData);

        return new DocumentScanResult(documentData, documentQuality, extractedData, documentPhotoData);
    }

    /**
     * Cross-verifies live face capture with document photo
     */
    private boolean crossVerifyFaceWithDocument(String liveFaceData, String documentPhotoData) {
        if (liveFaceData == null || documentPhotoData == null) {
            return false;
        }

        // Simulate advanced face matching algorithm
        double matchScore = simulateFaceMatching(liveFaceData, documentPhotoData);
        
        System.out.println("🔍 Face matching score: " + String.format("%.1f", matchScore) + "%");
        
        return matchScore > 85.0; // 85% confidence threshold for security
    }

    /**
     * Validates extracted document data against customer profile
     */
    private void validateDocumentDataConsistency(Customer customer, java.util.Map<String, String> extractedData) {
        // Cross-verify extracted data with customer information
        String extractedName = extractedData.get("name");
        String customerFullName = (customer.getFirstName() + " " + customer.getLastName()).toUpperCase();
        
        if (extractedName != null && !extractedName.toUpperCase().contains(customer.getFirstName().toUpperCase())) {
            throw new IllegalArgumentException("🚨 SECURITY ALERT: Document name does not match customer profile. Extracted: '" + extractedName + "', Expected: '" + customerFullName + "'");
        }

        String extractedId = extractedData.get("idNumber");
        if (extractedId != null && !extractedId.equals(customer.getNationalId())) {
            throw new IllegalArgumentException("🚨 SECURITY ALERT: Document ID number does not match customer profile. Please ensure you're using the correct document.");
        }
    }

    /**
     * Calculates comprehensive KYC quality score
     */
    private double calculateKycQualityScore(LiveFaceResult faceResult, DocumentScanResult documentResult, BiometricRequest request) {
        double totalScore = 0.0;

        // Face verification score (40% weight)
        totalScore += faceResult.faceQuality * 0.4;

        // Document quality score (35% weight)
        totalScore += documentResult.documentQuality * 0.35;

        // Liveness detection bonus (15% weight)
        if (faceResult.livenessDetected) {
            totalScore += 95.0 * 0.15;
        }

        // Device security score (10% weight)
        double deviceScore = calculateDeviceSecurityScore(request.getDeviceInfo());
        totalScore += deviceScore * 0.1;

        return Math.min(95.0, totalScore);
    }

    /**
     * Generates secure hash for KYC biometric data
     */
    private String generateKycBiometricHash(BiometricRequest request, LiveFaceResult faceResult, DocumentScanResult documentResult) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            
            StringBuilder dataToHash = new StringBuilder();
            dataToHash.append(faceResult.faceData);
            dataToHash.append(documentResult.documentData);
            dataToHash.append(request.getDeviceInfo());
            dataToHash.append(System.currentTimeMillis()); // Add timestamp for uniqueness
            
            byte[] hash = digest.digest(dataToHash.toString().getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
            
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Failed to generate KYC biometric hash", e);
        }
    }

    private double calculateDeviceSecurityScore(String deviceInfo) {
        if (deviceInfo == null) return 50.0;
        
        double score = 70.0;
        
        // Mobile devices get higher security score
        if (deviceInfo.toLowerCase().contains("mobile") || 
            deviceInfo.toLowerCase().contains("android") || 
            deviceInfo.toLowerCase().contains("ios")) {
            score += 20.0;
        }
        
        // Camera capability
        if (deviceInfo.toLowerCase().contains("camera")) {
            score += 10.0;
        }
        
        return Math.min(95.0, score);
    }

    // Simulation methods (in production, these would use real AI/ML services)
    
    private boolean simulateLivenessDetection(String faceData) {
        // Simulate liveness detection based on data characteristics
        return faceData.length() > 200 && (faceData.contains("live") || faceData.length() % 7 == 0);
    }

    private double simulateFaceQualityAssessment(String faceData) {
        // Simulate face quality scoring
        return Math.min(95.0, 60.0 + (faceData.length() % 35));
    }

    private double simulateDocumentQualityAssessment(String documentData) {
        // Simulate document quality scoring
        return Math.min(95.0, 65.0 + (documentData.length() % 30));
    }

    private java.util.Map<String, String> simulateOcrExtraction(String documentData) {
        // Simulate OCR text extraction
        java.util.Map<String, String> extracted = new java.util.HashMap<>();
        extracted.put("name", "EXTRACTED_NAME_FROM_DOCUMENT");
        extracted.put("idNumber", "EXTRACTED_ID_NUMBER");
        extracted.put("dateOfBirth", "EXTRACTED_DOB");
        return extracted;
    }

    private String simulateDocumentPhotoExtraction(String documentData) {
        // Simulate extracting photo from document
        return "DOCUMENT_PHOTO_DATA_" + documentData.substring(0, Math.min(20, documentData.length()));
    }

    private double simulateFaceMatching(String liveFace, String documentPhoto) {
        // Simulate face matching algorithm with realistic variance
        double baseScore = 88.0;
        double variance = (Math.random() * 10.0) - 5.0; // ±5% variance
        return Math.max(75.0, Math.min(98.0, baseScore + variance));
    }

    // Helper classes for KYC results
    private static class LiveFaceResult {
        final String faceData;
        final boolean livenessDetected;
        final double faceQuality;

        LiveFaceResult(String faceData, boolean livenessDetected, double faceQuality) {
            this.faceData = faceData;
            this.livenessDetected = livenessDetected;
            this.faceQuality = faceQuality;
        }
    }

    private static class DocumentScanResult {
        final String documentData;
        final double documentQuality;
        final java.util.Map<String, String> extractedData;
        final String documentPhotoData;

        DocumentScanResult(String documentData, double documentQuality, 
                          java.util.Map<String, String> extractedData, String documentPhotoData) {
            this.documentData = documentData;
            this.documentQuality = documentQuality;
            this.extractedData = extractedData;
            this.documentPhotoData = documentPhotoData;
        }
    }
}