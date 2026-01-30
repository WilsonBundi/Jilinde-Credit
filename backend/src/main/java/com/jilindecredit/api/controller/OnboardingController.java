package com.jilindecredit.api.controller;

import com.jilindecredit.api.dto.*;
import com.jilindecredit.api.service.BiometricService;
import com.jilindecredit.api.service.KycVerificationService;
import com.jilindecredit.api.service.OnboardingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/onboarding")
@CrossOrigin(origins = "*")
public class OnboardingController {

    @Autowired
    private OnboardingService onboardingService;

    @Autowired
    private KycVerificationService kycVerificationService;

    @Autowired
    private BiometricService biometricService;

    @PostMapping("/register")
    public ResponseEntity<?> registerCustomer(@Valid @RequestBody OnboardingRequest request) {
        try {
            // Public endpoint for customer self-registration
            OnboardingResponse response = onboardingService.registerCustomer(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error registering customer: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/initiate")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'OFFICER')")
    public ResponseEntity<?> initiateOnboarding(@Valid @RequestBody OnboardingRequest request) {
        try {
            OnboardingResponse response = onboardingService.initiateOnboarding(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error initiating onboarding: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/verify-kyc")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'OFFICER')")
    public ResponseEntity<?> verifyKyc(@Valid @RequestBody KycVerificationRequest request) {
        try {
            KycVerificationResponse response = kycVerificationService.verifyKyc(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error verifying KYC: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/capture-biometric")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'OFFICER')")
    public ResponseEntity<?> captureBiometric(@Valid @RequestBody BiometricRequest request) {
        try {
            BiometricResponse response = biometricService.captureBiometric(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error capturing biometric data: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/kyc-biometric")
    public ResponseEntity<?> captureKycBiometric(@Valid @RequestBody BiometricRequest request) {
        try {
            BiometricResponse response = biometricService.captureKycBiometric(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error processing KYC biometric verification: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/verify-biometric")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'OFFICER')")
    public ResponseEntity<?> verifyBiometric(@Valid @RequestBody BiometricRequest request) {
        try {
            BiometricResponse response = biometricService.verifyBiometric(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error verifying biometric data: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/complete/{customerId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'OFFICER')")
    public ResponseEntity<?> completeOnboarding(@PathVariable Long customerId) {
        try {
            OnboardingResponse response = onboardingService.completeOnboarding(customerId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException | IllegalStateException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error completing onboarding: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/check-phone")
    public ResponseEntity<?> checkPhoneAvailability(@RequestBody Map<String, String> request) {
        try {
            String phone = request.get("phone");
            if (phone == null || phone.trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "INVALID_PHONE");
                error.put("message", "Phone number is required");
                return ResponseEntity.badRequest().body(error);
            }

            boolean isAvailable = onboardingService.isPhoneNumberAvailable(phone);
            if (!isAvailable) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "PHONE_IN_USE");
                error.put("message", "Phone number is already registered");
                return ResponseEntity.badRequest().body(error);
            }

            Map<String, String> response = new HashMap<>();
            response.put("status", "AVAILABLE");
            response.put("message", "Phone number is available");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error checking phone availability: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/status/{applicationId}")
    public ResponseEntity<?> getApplicationStatus(@PathVariable String applicationId) {
        try {
            Map<String, Object> status = onboardingService.getApplicationStatus(applicationId);
            return ResponseEntity.ok(status);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error getting application status: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}