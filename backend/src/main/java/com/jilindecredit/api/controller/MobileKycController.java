package com.jilindecredit.api.controller;

import com.jilindecredit.api.service.MobileKycSessionService;
import com.jilindecredit.api.service.BiometricService;
import com.jilindecredit.api.dto.BiometricRequest;
import com.jilindecredit.api.dto.BiometricResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/mobile-kyc")
@CrossOrigin(origins = "*")
public class MobileKycController {

    @Autowired
    private MobileKycSessionService mobileKycSessionService;

    @Autowired
    private BiometricService biometricService;

    /**
     * Creates a new mobile KYC session and returns QR code data
     */
    @PostMapping("/create-session")
    public ResponseEntity<?> createMobileKycSession(@RequestBody Map<String, Object> request) {
        try {
            String customerData = (String) request.get("customerData");
            String baseUrl = (String) request.getOrDefault("baseUrl", "http://localhost:3000");

            MobileKycSessionService.KycSession session = mobileKycSessionService.createMobileKycSession(customerData);
            Map<String, Object> qrData = mobileKycSessionService.generateQrCodeData(session.getSessionId(), baseUrl);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("sessionId", session.getSessionId());
            response.put("qrCodeData", qrData);
            response.put("mobileUrl", qrData.get("url"));
            response.put("expiresAt", session.getExpiresAt());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error creating mobile KYC session: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Gets session status for polling
     */
    @GetMapping("/session/{sessionId}/status")
    public ResponseEntity<?> getSessionStatus(@PathVariable String sessionId) {
        try {
            Map<String, Object> status = mobileKycSessionService.getSessionStatus(sessionId);
            return ResponseEntity.ok(status);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error getting session status: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Validates mobile device and starts KYC process
     */
    @PostMapping("/session/{sessionId}/start")
    public ResponseEntity<?> startMobileKyc(@PathVariable String sessionId, HttpServletRequest request) {
        try {
            String userAgent = request.getHeader("User-Agent");
            
            // Validate mobile device
            if (!mobileKycSessionService.isMobileDevice(userAgent)) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "🚫 SECURITY RESTRICTION: KYC verification must be completed on a mobile device. Please use your smartphone or tablet.");
                error.put("deviceDetected", userAgent != null ? userAgent : "Unknown");
                error.put("requiredDevice", "Mobile phone or tablet");
                return ResponseEntity.badRequest().body(error);
            }

            // Get session
            MobileKycSessionService.KycSession session = mobileKycSessionService.getSession(sessionId);
            if (session == null) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Session not found or expired. Please generate a new QR code.");
                return ResponseEntity.badRequest().body(error);
            }

            // Update session status
            mobileKycSessionService.updateSessionStatus(sessionId, "IN_PROGRESS");

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Mobile KYC session started successfully");
            response.put("sessionId", sessionId);
            response.put("customerData", session.getCustomerData());
            response.put("deviceInfo", userAgent);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error starting mobile KYC: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Processes mobile KYC biometric verification
     */
    @PostMapping("/session/{sessionId}/verify")
    public ResponseEntity<?> processMobileKyc(@PathVariable String sessionId, @RequestBody BiometricRequest biometricRequest) {
        try {
            // Get session
            MobileKycSessionService.KycSession session = mobileKycSessionService.getSession(sessionId);
            if (session == null) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Session not found or expired");
                return ResponseEntity.badRequest().body(error);
            }

            // Process KYC verification
            BiometricResponse biometricResponse = biometricService.captureKycBiometric(biometricRequest);

            // Update session with results
            Map<String, Object> verificationData = new HashMap<>();
            verificationData.put("biometricResponse", biometricResponse);
            verificationData.put("verificationTime", java.time.LocalDateTime.now());
            verificationData.put("deviceInfo", biometricRequest.getDeviceInfo());

            mobileKycSessionService.completeKycVerification(sessionId, verificationData);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("sessionId", sessionId);
            response.put("verificationResult", biometricResponse);
            response.put("message", "Mobile KYC verification completed successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error processing mobile KYC: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Gets session info for mobile device
     */
    @GetMapping("/session/{sessionId}")
    public ResponseEntity<?> getSessionInfo(@PathVariable String sessionId, HttpServletRequest request) {
        try {
            String userAgent = request.getHeader("User-Agent");
            
            // Validate mobile device
            if (!mobileKycSessionService.isMobileDevice(userAgent)) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "🚫 Access denied. This KYC verification link can only be accessed from a mobile device.");
                error.put("instruction", "Please open this link on your smartphone or tablet.");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
            }

            MobileKycSessionService.KycSession session = mobileKycSessionService.getSession(sessionId);
            if (session == null) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Session not found or expired");
                return ResponseEntity.badRequest().body(error);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("sessionId", sessionId);
            response.put("status", session.getStatus());
            response.put("customerData", session.getCustomerData());
            response.put("expiresAt", session.getExpiresAt());
            response.put("deviceValidated", true);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error getting session info: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}