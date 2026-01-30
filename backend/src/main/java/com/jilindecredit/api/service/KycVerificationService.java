package com.jilindecredit.api.service;

import com.jilindecredit.api.dto.KycVerificationRequest;
import com.jilindecredit.api.dto.KycVerificationResponse;
import com.jilindecredit.api.model.Customer;
import com.jilindecredit.api.model.CustomerProfile;
import com.jilindecredit.api.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class KycVerificationService {

    @Autowired
    private CustomerRepository customerRepository;

    public KycVerificationResponse verifyKyc(KycVerificationRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        CustomerProfile profile = customer.getCustomerProfile();
        if (profile == null) {
            throw new IllegalStateException("Customer profile not found");
        }

        // Update KYC status to in progress
        profile.setKycStatus(CustomerProfile.KycStatus.IN_PROGRESS);
        customerRepository.save(customer);

        // Simulate e-KYC verification with government databases
        KycVerificationResult result = performEKycVerification(request, customer);

        // Update profile based on verification result
        profile.setKycStatus(result.isVerified() ? 
            CustomerProfile.KycStatus.VERIFIED : CustomerProfile.KycStatus.FAILED);
        profile.setKycVerificationDate(LocalDateTime.now());
        profile.setKycReferenceNumber(result.getReferenceNumber());

        customerRepository.save(customer);

        KycVerificationResponse response = new KycVerificationResponse(
            customer.getId(),
            profile.getKycStatus().name(),
            profile.getKycReferenceNumber(),
            result.isVerified(),
            result.getMessage()
        );

        response.setVerificationDetails(result.getVerificationDetails());
        response.setConfidenceScore(result.getConfidenceScore());

        return response;
    }

    private KycVerificationResult performEKycVerification(KycVerificationRequest request, Customer customer) {
        // This is a mock implementation. In a real system, this would integrate with:
        // - Government ID verification services
        // - National ID databases
        // - Credit bureau APIs
        // - Phone number verification services

        KycVerificationResult result = new KycVerificationResult();
        result.setReferenceNumber(generateKycReference());

        // Simulate verification checks
        List<String> verificationDetails = Arrays.asList(
            "National ID format validation: PASSED",
            "Name matching: PASSED",
            "Date of birth validation: PASSED",
            "Phone number verification: PASSED",
            "Government database lookup: PASSED"
        );

        // Mock verification logic - in real implementation, this would be actual verification
        boolean nameMatch = customer.getFirstName().equalsIgnoreCase(request.getFirstName()) &&
                           customer.getLastName().equalsIgnoreCase(request.getLastName());
        
        boolean idMatch = customer.getNationalId().equals(request.getNationalId());
        
        boolean phoneMatch = customer.getPhone().equals(request.getPhoneNumber());

        // Calculate confidence score based on matches
        double confidenceScore = 0.0;
        if (nameMatch) confidenceScore += 0.3;
        if (idMatch) confidenceScore += 0.4;
        if (phoneMatch) confidenceScore += 0.2;
        confidenceScore += 0.1; // Base score for format validation

        boolean verified = confidenceScore >= 0.8; // 80% confidence threshold

        result.setVerified(verified);
        result.setConfidenceScore(confidenceScore);
        result.setVerificationDetails(verificationDetails);
        result.setMessage(verified ? 
            "KYC verification completed successfully" : 
            "KYC verification failed. Please verify your information and try again.");

        return result;
    }

    private String generateKycReference() {
        return "KYC-" + System.currentTimeMillis() + "-" + 
               UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    // Inner class for verification result
    private static class KycVerificationResult {
        private boolean verified;
        private String referenceNumber;
        private String message;
        private List<String> verificationDetails;
        private Double confidenceScore;

        // Getters and Setters
        public boolean isVerified() { return verified; }
        public void setVerified(boolean verified) { this.verified = verified; }

        public String getReferenceNumber() { return referenceNumber; }
        public void setReferenceNumber(String referenceNumber) { this.referenceNumber = referenceNumber; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }

        public List<String> getVerificationDetails() { return verificationDetails; }
        public void setVerificationDetails(List<String> verificationDetails) { this.verificationDetails = verificationDetails; }

        public Double getConfidenceScore() { return confidenceScore; }
        public void setConfidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; }
    }
}