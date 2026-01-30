package com.jilindecredit.api.controller;

import com.jilindecredit.api.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/customer")
@CrossOrigin(origins = "*")
public class CustomerApiController {

    @Autowired
    private CustomerService customerService;

    @PostMapping("/login")
    public ResponseEntity<?> customerLogin(@RequestBody Map<String, String> loginRequest) {
        try {
            String phone = loginRequest.get("phone");
            String pin = loginRequest.get("pin");

            if (phone == null || pin == null) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Phone number and PIN are required");
                return ResponseEntity.badRequest().body(error);
            }

            Map<String, Object> result = customerService.authenticateCustomer(phone, pin);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Authentication failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/{customerId}/dashboard")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<?> getCustomerDashboard(@PathVariable Long customerId) {
        try {
            Map<String, Object> dashboard = customerService.getCustomerDashboard(customerId);
            return ResponseEntity.ok(dashboard);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error loading dashboard: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/{customerId}/biometric/setup")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<?> setupBiometric(@PathVariable Long customerId, @RequestBody Map<String, Object> biometricData) {
        try {
            Map<String, Object> result = customerService.setupBiometric(customerId, biometricData);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error setting up biometric: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/send-verification")
    public ResponseEntity<?> sendVerificationCode(@RequestBody Map<String, String> request) {
        try {
            System.out.println("📱 CustomerApiController: Received verification request: " + request);
            
            String phone = request.get("phone");
            String type = request.get("type");

            if (phone == null || type == null) {
                System.err.println("❌ CustomerApiController: Missing phone or type parameter");
                Map<String, String> error = new HashMap<>();
                error.put("message", "Phone number and verification type are required");
                return ResponseEntity.badRequest().body(error);
            }

            System.out.println("📱 CustomerApiController: Calling service for phone: " + phone);
            Map<String, Object> result = customerService.sendVerificationCode(phone, type);
            System.out.println("✅ CustomerApiController: Service call successful: " + result);
            
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            System.err.println("❌ CustomerApiController: IllegalArgumentException: " + e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            System.err.println("❌ CustomerApiController: Exception: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error sending verification code: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/verify-phone")
    public ResponseEntity<?> verifyPhone(@RequestBody Map<String, String> request) {
        try {
            String phone = request.get("phone");
            String code = request.get("code");

            if (phone == null || code == null) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Phone number and verification code are required");
                return ResponseEntity.badRequest().body(error);
            }

            Map<String, Object> result = customerService.verifyPhoneNumber(phone, code);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error verifying phone: " + e.getMessage());
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

            boolean isAvailable = !customerService.existsByPhone(phone);
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

    @PutMapping("/update-phone")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<?> updatePhoneNumber(@RequestBody Map<String, String> request) {
        try {
            String oldPhone = request.get("oldPhone");
            String newPhone = request.get("newPhone");

            if (oldPhone == null || newPhone == null) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Both old and new phone numbers are required");
                return ResponseEntity.badRequest().body(error);
            }

            Map<String, Object> result = customerService.updatePhoneNumber(oldPhone, newPhone);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error updating phone number: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}