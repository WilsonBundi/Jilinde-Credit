package com.jilindecredit.api.service;

import com.jilindecredit.api.dto.OnboardingRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;

@Service
public class DocumentVerificationService {

    /**
     * Validates that personal details match the uploaded document data
     * @param request The onboarding request containing both personal and document data
     * @return List of validation errors, empty if all validations pass
     */
    public List<String> validateDocumentConsistency(OnboardingRequest request) {
        List<String> errors = new ArrayList<>();

        // Check if document data is provided
        if (request.getDocumentFirstName() == null || request.getDocumentFirstName().trim().isEmpty()) {
            errors.add("Document verification failed: First name not extracted from document");
            return errors; // Return early if no document data
        }

        // Validate first name match
        if (!normalizeString(request.getFirstName()).equals(normalizeString(request.getDocumentFirstName()))) {
            errors.add("CRITICAL: First name '" + request.getFirstName() + 
                      "' does not match document name '" + request.getDocumentFirstName() + "'");
        }

        // Validate last name match
        if (!normalizeString(request.getLastName()).equals(normalizeString(request.getDocumentLastName()))) {
            errors.add("CRITICAL: Last name '" + request.getLastName() + 
                      "' does not match document name '" + request.getDocumentLastName() + "'");
        }

        // Validate ID number match
        if (!normalizeString(request.getNationalId()).equals(normalizeString(request.getDocumentIdNumber()))) {
            errors.add("CRITICAL: ID number '" + request.getNationalId() + 
                      "' does not match document ID '" + request.getDocumentIdNumber() + "'");
        }

        // Validate date of birth match
        if (request.getDateOfBirth() != null && request.getDocumentDateOfBirth() != null) {
            if (!request.getDateOfBirth().equals(request.getDocumentDateOfBirth())) {
                errors.add("CRITICAL: Date of birth '" + request.getDateOfBirth() + 
                          "' does not match document date '" + request.getDocumentDateOfBirth() + "'");
            }
        }

        // Validate gender match
        if (!normalizeString(request.getGender()).equals(normalizeString(request.getDocumentGender()))) {
            errors.add("CRITICAL: Gender '" + request.getGender() + 
                      "' does not match document gender '" + request.getDocumentGender() + "'");
        }

        // Additional business rule validations
        validateBusinessRules(request, errors);

        return errors;
    }

    /**
     * Validates business rules for document verification
     */
    private void validateBusinessRules(OnboardingRequest request, List<String> errors) {
        // Check minimum age requirement
        if (request.getDateOfBirth() != null) {
            int age = Period.between(request.getDateOfBirth(), LocalDate.now()).getYears();
            if (age < 18) {
                errors.add("CRITICAL: Applicant must be at least 18 years old. Current age: " + age);
            }
            if (age > 100) {
                errors.add("CRITICAL: Invalid date of birth. Age cannot exceed 100 years.");
            }
        }

        // Validate ID type consistency
        if ("national_id".equals(request.getIdType())) {
            if (request.getNationalId() != null && request.getNationalId().length() < 6) {
                errors.add("CRITICAL: National ID must be at least 6 characters long");
            }
        }

        // Check for required document upload
        if (request.getDocumentFileName() == null || request.getDocumentFileName().trim().isEmpty()) {
            errors.add("CRITICAL: Document upload is required for verification");
        }

        // Validate document hash for integrity
        if (request.getDocumentHash() == null || request.getDocumentHash().trim().isEmpty()) {
            errors.add("CRITICAL: Document integrity verification failed");
        }
    }

    /**
     * Simulates document OCR/extraction process
     * In a real implementation, this would use OCR services like AWS Textract, Google Vision API, etc.
     */
    public void extractDocumentData(OnboardingRequest request, String documentContent) {
        // This is a simulation - in production, you would use actual OCR services
        // For now, we'll require the frontend to provide this data
        
        if (request.getDocumentFirstName() == null) {
            // Simulate extraction failure
            throw new IllegalArgumentException("Document text extraction failed. Please ensure document is clear and readable.");
        }
    }

    /**
     * Normalizes strings for comparison (removes spaces, converts to lowercase, handles special characters)
     */
    private String normalizeString(String input) {
        if (input == null) return "";
        return input.trim().toLowerCase()
                   .replaceAll("\\s+", "")
                   .replaceAll("[^a-zA-Z0-9]", "");
    }

    /**
     * Validates document format and quality
     */
    public List<String> validateDocumentFormat(String fileName, String fileType, long fileSize) {
        List<String> errors = new ArrayList<>();

        // Check file type
        if (!isValidDocumentType(fileType)) {
            errors.add("Invalid document format. Only PDF, JPG, JPEG, PNG files are allowed.");
        }

        // Check file size (max 5MB)
        if (fileSize > 5 * 1024 * 1024) {
            errors.add("Document file size too large. Maximum allowed size is 5MB.");
        }

        // Check file name
        if (fileName == null || fileName.trim().isEmpty()) {
            errors.add("Document file name is required.");
        }

        return errors;
    }

    private boolean isValidDocumentType(String fileType) {
        return fileType != null && (
            fileType.equals("application/pdf") ||
            fileType.equals("image/jpeg") ||
            fileType.equals("image/jpg") ||
            fileType.equals("image/png")
        );
    }

    /**
     * Generates a security score based on document verification results
     */
    public int calculateDocumentVerificationScore(OnboardingRequest request) {
        int score = 100; // Start with perfect score

        List<String> errors = validateDocumentConsistency(request);
        
        // Deduct points for each error
        for (String error : errors) {
            if (error.startsWith("CRITICAL:")) {
                score -= 25; // Major deduction for critical errors
            } else {
                score -= 10; // Minor deduction for other errors
            }
        }

        return Math.max(0, score); // Ensure score doesn't go below 0
    }
}