package com.jilindecredit.api.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {
    
    // Serve React app for all non-API routes
    @GetMapping(value = {"/admin", "/customer", "/register", "/status", "/mobile-kyc/**"})
    public String forwardToReactApp() {
        return "forward:/index.html";
    }
}