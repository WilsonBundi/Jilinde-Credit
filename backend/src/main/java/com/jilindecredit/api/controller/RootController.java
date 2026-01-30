package com.jilindecredit.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class RootController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> root() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Jilinde Credit API is running");
        response.put("version", "1.0.0");
        response.put("frontend", "http://localhost:3000");
        response.put("api_docs", "http://localhost:8080/api");
        response.put("endpoints", Map.of(
            "login", "POST /api/auth/login",
            "customers", "GET /api/customers",
            "onboarding", "POST /api/onboarding/initiate"
        ));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Jilinde Credit API");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/test")
    public ResponseEntity<Map<String, Object>> apiTest() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "API is working correctly");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }
}