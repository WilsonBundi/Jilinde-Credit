package com.jilindecredit.api.service;

import com.jilindecredit.api.model.Customer;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Period;

@Service
public class CreditScoringService {

    public BigDecimal generateBaselineCreditScore(Customer customer) {
        // Basic credit scoring algorithm for baseline score
        // In a real implementation, this would use ML models and alternative data
        
        double baseScore = 500.0; // Starting point
        
        // Age factor (older customers generally more stable)
        if (customer.getDateOfBirth() != null) {
            int age = Period.between(customer.getDateOfBirth(), LocalDate.now()).getYears();
            if (age >= 25 && age <= 55) {
                baseScore += 50; // Prime age group
            } else if (age > 55) {
                baseScore += 30; // Mature but stable
            } else {
                baseScore += 10; // Young but potentially risky
            }
        }
        
        // Income factor
        if (customer.getMonthlyIncome() != null) {
            double income = customer.getMonthlyIncome().doubleValue();
            if (income >= 100000) { // High income
                baseScore += 100;
            } else if (income >= 50000) { // Medium income
                baseScore += 75;
            } else if (income >= 25000) { // Low-medium income
                baseScore += 50;
            } else { // Low income
                baseScore += 25;
            }
        }
        
        // Employment factor
        if (customer.getOccupation() != null && !customer.getOccupation().isEmpty()) {
            String occupation = customer.getOccupation().toLowerCase();
            if (occupation.contains("government") || occupation.contains("teacher") || 
                occupation.contains("nurse") || occupation.contains("police")) {
                baseScore += 75; // Stable government jobs
            } else if (occupation.contains("business") || occupation.contains("entrepreneur")) {
                baseScore += 50; // Business owners
            } else if (occupation.contains("farmer") || occupation.contains("agriculture")) {
                baseScore += 40; // Agricultural sector
            } else {
                baseScore += 30; // Other occupations
            }
        }
        
        // Contact information completeness
        if (customer.getEmail() != null && !customer.getEmail().isEmpty()) {
            baseScore += 25; // Has email
        }
        
        if (customer.getAddress() != null && !customer.getAddress().isEmpty()) {
            baseScore += 25; // Has address
        }
        
        // Marital status factor
        if ("MARRIED".equalsIgnoreCase(customer.getMaritalStatus())) {
            baseScore += 30; // Married customers often more stable
        }
        
        // Ensure score is within valid range (300-850)
        baseScore = Math.max(300, Math.min(850, baseScore));
        
        return BigDecimal.valueOf(baseScore);
    }
    
    public String getCreditScoreCategory(BigDecimal score) {
        if (score == null) return "UNKNOWN";
        
        double scoreValue = score.doubleValue();
        if (scoreValue >= 750) return "EXCELLENT";
        else if (scoreValue >= 700) return "GOOD";
        else if (scoreValue >= 650) return "FAIR";
        else if (scoreValue >= 600) return "POOR";
        else return "VERY_POOR";
    }
}