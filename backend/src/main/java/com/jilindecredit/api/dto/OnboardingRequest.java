package com.jilindecredit.api.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public class OnboardingRequest {
    @NotBlank(message = "First name is required")
    @Size(max = 50, message = "First name must not exceed 50 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 50, message = "Last name must not exceed 50 characters")
    private String lastName;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^(\\+254|0)[17]\\d{8}$|^\\+?[1-9]\\d{1,14}$", message = "Invalid phone number format")
    private String phone;

    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String email;

    @NotBlank(message = "National ID is required")
    @Size(max = 20, message = "National ID must not exceed 20 characters")
    private String nationalId;

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    @NotNull(message = "Gender is required")
    private String gender; // MALE or FEMALE

    private String address;
    private String occupation;
    private BigDecimal monthlyIncome;
    private String maritalStatus;

    // Document verification fields (TEMPORARILY MADE OPTIONAL)
    // @NotBlank(message = "ID type is required") // COMMENTED OUT TEMPORARILY
    private String idType; // national_id, passport, alien_id
    
    private String documentFileName; // Name of uploaded document
    private String documentHash; // Hash of document for integrity
    
    // Document extracted data for verification
    private String documentFirstName; // Name extracted from document
    private String documentLastName; // Last name extracted from document
    private String documentIdNumber; // ID number extracted from document
    private LocalDate documentDateOfBirth; // DOB extracted from document
    private String documentGender; // Gender extracted from document

    // Digital literacy and preferences
    @Min(value = 1, message = "Digital literacy level must be between 1 and 5")
    @Max(value = 5, message = "Digital literacy level must be between 1 and 5")
    private Integer digitalLiteracyLevel;

    private String preferredLanguage;
    private Boolean voiceAssistanceEnabled;

    // Constructors
    public OnboardingRequest() {}

    // Getters and Setters
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getNationalId() { return nationalId; }
    public void setNationalId(String nationalId) { this.nationalId = nationalId; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getOccupation() { return occupation; }
    public void setOccupation(String occupation) { this.occupation = occupation; }

    public BigDecimal getMonthlyIncome() { return monthlyIncome; }
    public void setMonthlyIncome(BigDecimal monthlyIncome) { this.monthlyIncome = monthlyIncome; }

    public String getMaritalStatus() { return maritalStatus; }
    public void setMaritalStatus(String maritalStatus) { this.maritalStatus = maritalStatus; }

    public Integer getDigitalLiteracyLevel() { return digitalLiteracyLevel; }
    public void setDigitalLiteracyLevel(Integer digitalLiteracyLevel) { this.digitalLiteracyLevel = digitalLiteracyLevel; }

    public String getPreferredLanguage() { return preferredLanguage; }
    public void setPreferredLanguage(String preferredLanguage) { this.preferredLanguage = preferredLanguage; }

    public Boolean getVoiceAssistanceEnabled() { return voiceAssistanceEnabled; }
    public void setVoiceAssistanceEnabled(Boolean voiceAssistanceEnabled) { this.voiceAssistanceEnabled = voiceAssistanceEnabled; }

    // Document verification getters and setters
    public String getIdType() { return idType; }
    public void setIdType(String idType) { this.idType = idType; }

    public String getDocumentFileName() { return documentFileName; }
    public void setDocumentFileName(String documentFileName) { this.documentFileName = documentFileName; }

    public String getDocumentHash() { return documentHash; }
    public void setDocumentHash(String documentHash) { this.documentHash = documentHash; }

    public String getDocumentFirstName() { return documentFirstName; }
    public void setDocumentFirstName(String documentFirstName) { this.documentFirstName = documentFirstName; }

    public String getDocumentLastName() { return documentLastName; }
    public void setDocumentLastName(String documentLastName) { this.documentLastName = documentLastName; }

    public String getDocumentIdNumber() { return documentIdNumber; }
    public void setDocumentIdNumber(String documentIdNumber) { this.documentIdNumber = documentIdNumber; }

    public LocalDate getDocumentDateOfBirth() { return documentDateOfBirth; }
    public void setDocumentDateOfBirth(LocalDate documentDateOfBirth) { this.documentDateOfBirth = documentDateOfBirth; }

    public String getDocumentGender() { return documentGender; }
    public void setDocumentGender(String documentGender) { this.documentGender = documentGender; }
}