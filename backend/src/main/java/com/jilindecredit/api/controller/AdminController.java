package com.jilindecredit.api.controller;

import com.jilindecredit.api.service.OnboardingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
// @PreAuthorize("hasRole('ADMIN')") // Temporarily disabled for demo
public class AdminController {

    @Autowired
    private OnboardingService onboardingService;

    @GetMapping("/applications/all")
    public ResponseEntity<?> getAllApplications() {
        try {
            System.out.println("🔍 AdminController: Fetching all applications...");
            List<Map<String, Object>> applications = onboardingService.getAllApplications();
            System.out.println("📊 AdminController: Found " + applications.size() + " total applications");
            
            // Log each application for debugging
            for (Map<String, Object> app : applications) {
                System.out.println("📋 Application: " + app.get("id") + " - " + app.get("firstName") + " " + app.get("lastName") + " - Status: " + app.get("status"));
            }
            
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            System.err.println("❌ AdminController: Error fetching all applications: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error fetching all applications: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/applications/pending")
    public ResponseEntity<?> getPendingApplications() {
        try {
            System.out.println("🔍 AdminController: Fetching pending applications...");
            List<Map<String, Object>> applications = onboardingService.getPendingApplications();
            System.out.println("📊 AdminController: Found " + applications.size() + " pending applications");
            
            // Log each application for debugging
            for (Map<String, Object> app : applications) {
                System.out.println("📋 Application: " + app.get("id") + " - " + app.get("firstName") + " " + app.get("lastName"));
            }
            
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            System.err.println("❌ AdminController: Error fetching pending applications: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error fetching pending applications: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/applications/{applicationId}/approve")
    public ResponseEntity<?> approveApplication(@PathVariable String applicationId, @RequestBody Map<String, String> request) {
        try {
            Map<String, Object> result = onboardingService.approveApplication(applicationId);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error approving application: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/applications/{applicationId}/reject")
    public ResponseEntity<?> rejectApplication(@PathVariable String applicationId, @RequestBody Map<String, String> request) {
        try {
            String reason = request.get("reason");
            if (reason == null || reason.trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Rejection reason is required");
                return ResponseEntity.badRequest().body(error);
            }

            Map<String, Object> result = onboardingService.rejectApplication(applicationId, reason);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error rejecting application: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getDashboardStats() {
        try {
            System.out.println("📊 AdminController: Fetching dashboard stats...");
            Map<String, Object> stats = onboardingService.getAdminDashboardStats();
            System.out.println("📈 AdminController: Stats - " + stats);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            System.err.println("❌ AdminController: Error fetching dashboard stats: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error fetching dashboard stats: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}