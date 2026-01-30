package com.jilindecredit.api.service;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class MobileKycSessionService {

    // In-memory storage for KYC sessions (in production, use Redis or database)
    private final Map<String, KycSession> activeSessions = new ConcurrentHashMap<>();

    public static class KycSession {
        private String sessionId;
        private String customerData;
        private LocalDateTime createdAt;
        private LocalDateTime expiresAt;
        private String status; // PENDING, IN_PROGRESS, COMPLETED, EXPIRED
        private Map<String, Object> verificationData;

        public KycSession(String sessionId, String customerData) {
            this.sessionId = sessionId;
            this.customerData = customerData;
            this.createdAt = LocalDateTime.now();
            this.expiresAt = LocalDateTime.now().plusMinutes(15); // 15-minute expiry
            this.status = "PENDING";
            this.verificationData = new HashMap<>();
        }

        // Getters and setters
        public String getSessionId() { return sessionId; }
        public void setSessionId(String sessionId) { this.sessionId = sessionId; }

        public String getCustomerData() { return customerData; }
        public void setCustomerData(String customerData) { this.customerData = customerData; }

        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

        public LocalDateTime getExpiresAt() { return expiresAt; }
        public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public Map<String, Object> getVerificationData() { return verificationData; }
        public void setVerificationData(Map<String, Object> verificationData) { this.verificationData = verificationData; }

        public boolean isExpired() {
            return LocalDateTime.now().isAfter(expiresAt);
        }
    }

    /**
     * Creates a new mobile KYC session
     */
    public KycSession createMobileKycSession(String customerData) {
        String sessionId = generateSessionId();
        KycSession session = new KycSession(sessionId, customerData);
        activeSessions.put(sessionId, session);
        
        // Clean up expired sessions
        cleanupExpiredSessions();
        
        return session;
    }

    /**
     * Gets a KYC session by ID
     */
    public KycSession getSession(String sessionId) {
        KycSession session = activeSessions.get(sessionId);
        if (session != null && session.isExpired()) {
            activeSessions.remove(sessionId);
            return null;
        }
        return session;
    }

    /**
     * Updates session status
     */
    public boolean updateSessionStatus(String sessionId, String status) {
        KycSession session = getSession(sessionId);
        if (session != null) {
            session.setStatus(status);
            return true;
        }
        return false;
    }

    /**
     * Completes KYC verification for a session
     */
    public boolean completeKycVerification(String sessionId, Map<String, Object> verificationData) {
        KycSession session = getSession(sessionId);
        if (session != null) {
            session.setStatus("COMPLETED");
            session.setVerificationData(verificationData);
            return true;
        }
        return false;
    }

    /**
     * Generates mobile KYC URL
     */
    public String generateMobileKycUrl(String sessionId, String baseUrl) {
        return baseUrl + "/mobile-kyc/" + sessionId;
    }

    /**
     * Generates QR code data for mobile KYC
     */
    public Map<String, Object> generateQrCodeData(String sessionId, String baseUrl) {
        String mobileUrl = generateMobileKycUrl(sessionId, baseUrl);
        
        Map<String, Object> qrData = new HashMap<>();
        qrData.put("sessionId", sessionId);
        qrData.put("url", mobileUrl);
        qrData.put("type", "MOBILE_KYC_VERIFICATION");
        qrData.put("expiresIn", "15 minutes");
        qrData.put("instructions", "Scan this QR code with your mobile phone to complete KYC verification");
        
        return qrData;
    }

    /**
     * Validates if device is mobile
     */
    public boolean isMobileDevice(String userAgent) {
        if (userAgent == null) return false;
        
        String ua = userAgent.toLowerCase();
        return ua.contains("mobile") || 
               ua.contains("android") || 
               ua.contains("iphone") || 
               ua.contains("ipad") || 
               ua.contains("ipod") || 
               ua.contains("blackberry") || 
               ua.contains("windows phone");
    }

    /**
     * Generates unique session ID
     */
    private String generateSessionId() {
        return "KYC_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
    }

    /**
     * Cleans up expired sessions
     */
    private void cleanupExpiredSessions() {
        activeSessions.entrySet().removeIf(entry -> entry.getValue().isExpired());
    }

    /**
     * Gets session status for polling
     */
    public Map<String, Object> getSessionStatus(String sessionId) {
        KycSession session = getSession(sessionId);
        Map<String, Object> status = new HashMap<>();
        
        if (session == null) {
            status.put("status", "NOT_FOUND");
            status.put("message", "Session not found or expired");
        } else {
            status.put("status", session.getStatus());
            status.put("sessionId", session.getSessionId());
            status.put("createdAt", session.getCreatedAt());
            status.put("expiresAt", session.getExpiresAt());
            
            if ("COMPLETED".equals(session.getStatus())) {
                status.put("verificationData", session.getVerificationData());
            }
        }
        
        return status;
    }
}