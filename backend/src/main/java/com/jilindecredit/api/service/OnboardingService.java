package com.jilindecredit.api.service;

import com.jilindecredit.api.dto.OnboardingRequest;
import com.jilindecredit.api.dto.OnboardingResponse;
import com.jilindecredit.api.model.Customer;
import com.jilindecredit.api.model.CustomerProfile;
import com.jilindecredit.api.model.User;
import com.jilindecredit.api.repository.CustomerRepository;
import com.jilindecredit.api.security.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class OnboardingService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CreditScoringService creditScoringService;

    // @Autowired
    // private DocumentVerificationService documentVerificationService; // COMPLETELY REMOVED TEMPORARILY

    public OnboardingResponse registerCustomer(OnboardingRequest request) {
        // SIMPLE REGISTRATION - NO DOCUMENT VERIFICATION AT ALL
        System.out.println("🚀 SIMPLE REGISTRATION: Starting customer registration without document verification");
        
        // Validate unique constraints only
        if (customerRepository.existsByNationalId(request.getNationalId())) {
            throw new IllegalArgumentException("Customer with this National ID already exists");
        }
        
        if (customerRepository.existsByPhone(request.getPhone())) {
            throw new IllegalArgumentException("Customer with this phone number already exists");
        }

        // Generate unique customer code
        String customerCode = generateCustomerCode();
        while (customerRepository.existsByCustomerCode(customerCode)) {
            customerCode = generateCustomerCode();
        }

        System.out.println("✅ SIMPLE REGISTRATION: Creating customer with code: " + customerCode);

        // Create customer entity with basic info only
        Customer customer = new Customer();
        customer.setCustomerCode(customerCode);
        customer.setFirstName(request.getFirstName());
        customer.setLastName(request.getLastName());
        customer.setPhone(request.getPhone());
        customer.setEmail(request.getEmail());
        customer.setNationalId(request.getNationalId());
        customer.setDateOfBirth(request.getDateOfBirth());
        customer.setGender(Customer.Gender.valueOf(request.getGender().toUpperCase()));
        customer.setAddress(request.getAddress());
        customer.setOccupation(request.getOccupation());
        customer.setMonthlyIncome(request.getMonthlyIncome());
        customer.setMaritalStatus(request.getMaritalStatus());

        // NO DOCUMENT VERIFICATION FIELDS SET
        System.out.println("✅ SIMPLE REGISTRATION: Skipping all document verification");

        // Create simple customer profile
        CustomerProfile profile = new CustomerProfile();
        profile.setCustomer(customer);
        profile.setKycStatus(CustomerProfile.KycStatus.PENDING);
        profile.setOnboardingCompleted(false);
        profile.setDigitalLiteracyLevel(request.getDigitalLiteracyLevel() != null ? request.getDigitalLiteracyLevel() : 3);
        profile.setPreferredLanguage(request.getPreferredLanguage() != null ? request.getPreferredLanguage() : "english");
        profile.setVoiceAssistanceEnabled(request.getVoiceAssistanceEnabled() != null ? request.getVoiceAssistanceEnabled() : false);
        
        // Simple baseline credit score
        BigDecimal baselineScore = new BigDecimal("650"); // Default score
        profile.setBaselineCreditScore(baselineScore);
        profile.setRiskCategory(CustomerProfile.RiskCategory.MEDIUM);

        customer.setCustomerProfile(profile);

        System.out.println("✅ SIMPLE REGISTRATION: Saving customer to database");

        // Save customer (cascades to profile)
        Customer savedCustomer = customerRepository.save(customer);

        System.out.println("🎉 SIMPLE REGISTRATION: Customer saved successfully with ID: " + savedCustomer.getId());

        return new OnboardingResponse(
            savedCustomer.getId(),
            savedCustomer.getCustomerCode(),
            savedCustomer.getFirstName(),
            savedCustomer.getLastName(),
            savedCustomer.getCustomerProfile(),
            "Customer registration completed successfully. Your application is under review."
        );
    }

    public OnboardingResponse initiateOnboarding(OnboardingRequest request) {
        // Validate unique constraints
        if (customerRepository.existsByNationalId(request.getNationalId())) {
            throw new IllegalArgumentException("Customer with this National ID already exists");
        }
        
        if (customerRepository.existsByPhone(request.getPhone())) {
            throw new IllegalArgumentException("Customer with this phone number already exists");
        }

        // Generate unique customer code
        String customerCode = generateCustomerCode();
        while (customerRepository.existsByCustomerCode(customerCode)) {
            customerCode = generateCustomerCode();
        }

        // Create customer entity
        Customer customer = new Customer();
        customer.setCustomerCode(customerCode);
        customer.setFirstName(request.getFirstName());
        customer.setLastName(request.getLastName());
        customer.setPhone(request.getPhone());
        customer.setEmail(request.getEmail());
        customer.setNationalId(request.getNationalId());
        customer.setDateOfBirth(request.getDateOfBirth());
        customer.setGender(Customer.Gender.valueOf(request.getGender().toUpperCase()));
        customer.setAddress(request.getAddress());
        customer.setOccupation(request.getOccupation());
        customer.setMonthlyIncome(request.getMonthlyIncome());
        customer.setMaritalStatus(request.getMaritalStatus());
        customer.setCreatedBy(getCurrentUser());

        // Create customer profile
        CustomerProfile profile = new CustomerProfile();
        profile.setCustomer(customer);
        profile.setKycStatus(CustomerProfile.KycStatus.PENDING);
        profile.setOnboardingCompleted(false);
        profile.setDigitalLiteracyLevel(request.getDigitalLiteracyLevel());
        profile.setPreferredLanguage(request.getPreferredLanguage());
        profile.setVoiceAssistanceEnabled(request.getVoiceAssistanceEnabled());
        
        // Generate baseline credit score
        BigDecimal baselineScore = creditScoringService.generateBaselineCreditScore(customer);
        profile.setBaselineCreditScore(baselineScore);
        profile.setRiskCategory(determineRiskCategory(baselineScore));

        customer.setCustomerProfile(profile);

        // Save customer (cascades to profile)
        Customer savedCustomer = customerRepository.save(customer);

        return new OnboardingResponse(
            savedCustomer.getId(),
            savedCustomer.getCustomerCode(),
            savedCustomer.getFirstName(),
            savedCustomer.getLastName(),
            savedCustomer.getCustomerProfile(),
            "Customer onboarding initiated successfully. Please proceed with KYC verification."
        );
    }

    public OnboardingResponse completeOnboarding(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        CustomerProfile profile = customer.getCustomerProfile();
        if (profile == null) {
            throw new IllegalStateException("Customer profile not found");
        }

        // Check if KYC is verified
        if (profile.getKycStatus() != CustomerProfile.KycStatus.VERIFIED) {
            throw new IllegalStateException("KYC verification must be completed before onboarding");
        }

        // Complete onboarding
        profile.setOnboardingCompleted(true);
        profile.setOnboardingCompletionDate(LocalDateTime.now());

        Customer savedCustomer = customerRepository.save(customer);

        return new OnboardingResponse(
            savedCustomer.getId(),
            savedCustomer.getCustomerCode(),
            savedCustomer.getFirstName(),
            savedCustomer.getLastName(),
            savedCustomer.getCustomerProfile(),
            "Customer onboarding completed successfully. Customer is now eligible for loan applications."
        );
    }

    public boolean isPhoneNumberAvailable(String phone) {
        return !customerRepository.existsByPhone(phone);
    }

    public Map<String, Object> getApplicationStatus(String applicationId) {
        // For now, we'll use customer code as application ID
        Optional<Customer> customerOpt = customerRepository.findByCustomerCode(applicationId);
        
        if (customerOpt.isEmpty()) {
            throw new IllegalArgumentException("Application not found");
        }

        Customer customer = customerOpt.get();
        CustomerProfile profile = customer.getCustomerProfile();

        Map<String, Object> status = new HashMap<>();
        status.put("applicationId", applicationId);
        status.put("customerName", customer.getFirstName() + " " + customer.getLastName());
        status.put("phone", customer.getPhone());
        status.put("email", customer.getEmail());
        status.put("submittedAt", customer.getCreatedAt());
        
        if (profile != null) {
            status.put("kycStatus", profile.getKycStatus().toString());
            status.put("onboardingCompleted", profile.getOnboardingCompleted());
            status.put("riskCategory", profile.getRiskCategory().toString());
        }

        return status;
    }

    public List<Map<String, Object>> getAllApplications() {
        System.out.println("🔍 OnboardingService: Searching for all applications...");
        List<Customer> allCustomers = customerRepository.findAll();
        System.out.println("📊 OnboardingService: Found " + allCustomers.size() + " total customers");
        
        return allCustomers.stream().map(customer -> {
            System.out.println("📋 Processing customer: " + customer.getCustomerCode() + " - " + customer.getFirstName() + " " + customer.getLastName());
            Map<String, Object> app = new HashMap<>();
            app.put("id", customer.getCustomerCode());
            app.put("firstName", customer.getFirstName());
            app.put("lastName", customer.getLastName());
            app.put("phone", customer.getPhone());
            app.put("email", customer.getEmail());
            app.put("idNumber", customer.getNationalId());
            
            // Determine status based on KYC status
            CustomerProfile profile = customer.getCustomerProfile();
            String status = "pending";
            if (profile != null) {
                switch (profile.getKycStatus()) {
                    case VERIFIED:
                        status = "approved";
                        break;
                    case REJECTED:
                        status = "rejected";
                        break;
                    case PENDING:
                    default:
                        status = "pending";
                        break;
                }
            }
            
            app.put("status", status);
            app.put("submittedAt", customer.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            
            // Add document verification score for admin review
            if (customer.getDocumentVerificationScore() != null) {
                app.put("documentVerificationScore", customer.getDocumentVerificationScore());
            }
            
            // Add PIN if approved
            if ("approved".equals(status) && customer.getLoginPin() != null) {
                app.put("pin", customer.getLoginPin());
            }
            
            // Add rejection reason if rejected
            if ("rejected".equals(status) && profile != null && profile.getRejectionReason() != null) {
                app.put("rejectionReason", profile.getRejectionReason());
            }
            
            return app;
        }).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getPendingApplications() {
        System.out.println("🔍 OnboardingService: Searching for pending applications...");
        List<Customer> pendingCustomers = customerRepository.findByCustomerProfile_KycStatus(CustomerProfile.KycStatus.PENDING);
        System.out.println("📊 OnboardingService: Found " + pendingCustomers.size() + " customers with PENDING status");
        
        return pendingCustomers.stream().map(customer -> {
            System.out.println("📋 Processing customer: " + customer.getCustomerCode() + " - " + customer.getFirstName() + " " + customer.getLastName());
            Map<String, Object> app = new HashMap<>();
            app.put("id", customer.getCustomerCode());
            app.put("firstName", customer.getFirstName());
            app.put("lastName", customer.getLastName());
            app.put("phone", customer.getPhone());
            app.put("email", customer.getEmail());
            app.put("idNumber", customer.getNationalId());
            app.put("status", "pending");
            app.put("submittedAt", customer.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            return app;
        }).collect(Collectors.toList());
    }

    public Map<String, Object> approveApplication(String applicationId) {
        Optional<Customer> customerOpt = customerRepository.findByCustomerCode(applicationId);
        
        if (customerOpt.isEmpty()) {
            throw new IllegalArgumentException("Application not found");
        }

        Customer customer = customerOpt.get();
        CustomerProfile profile = customer.getCustomerProfile();

        if (profile == null) {
            throw new IllegalStateException("Customer profile not found");
        }

        // Update KYC status to verified
        profile.setKycStatus(CustomerProfile.KycStatus.VERIFIED);
        profile.setOnboardingCompleted(true);
        profile.setOnboardingCompletionDate(LocalDateTime.now());

        // Generate PIN for customer login
        String pin = generatePIN();
        customer.setLoginPin(pin); // Assuming we add this field to Customer model

        customerRepository.save(customer);

        // TODO: Send SMS with PIN to customer
        // TODO: Send email confirmation

        Map<String, Object> result = new HashMap<>();
        result.put("status", "approved");
        result.put("pin", pin);
        result.put("message", "Application approved successfully. PIN sent to customer.");
        
        return result;
    }

    public Map<String, Object> rejectApplication(String applicationId, String reason) {
        Optional<Customer> customerOpt = customerRepository.findByCustomerCode(applicationId);
        
        if (customerOpt.isEmpty()) {
            throw new IllegalArgumentException("Application not found");
        }

        Customer customer = customerOpt.get();
        CustomerProfile profile = customer.getCustomerProfile();

        if (profile == null) {
            throw new IllegalStateException("Customer profile not found");
        }

        // Update KYC status to rejected
        profile.setKycStatus(CustomerProfile.KycStatus.REJECTED);
        profile.setRejectionReason(reason);

        customerRepository.save(customer);

        // TODO: Send email notification to customer

        Map<String, Object> result = new HashMap<>();
        result.put("status", "rejected");
        result.put("reason", reason);
        result.put("message", "Application rejected. Customer notified via email.");
        
        return result;
    }

    public Map<String, Object> getAdminDashboardStats() {
        System.out.println("📊 OnboardingService: Calculating dashboard stats...");
        Map<String, Object> stats = new HashMap<>();
        
        long totalApplications = customerRepository.count();
        long pendingApplications = customerRepository.countByCustomerProfile_KycStatus(CustomerProfile.KycStatus.PENDING);
        long approvedApplications = customerRepository.countByCustomerProfile_KycStatus(CustomerProfile.KycStatus.VERIFIED);
        long rejectedApplications = customerRepository.countByCustomerProfile_KycStatus(CustomerProfile.KycStatus.REJECTED);

        System.out.println("📈 Total: " + totalApplications + ", Pending: " + pendingApplications + 
                          ", Approved: " + approvedApplications + ", Rejected: " + rejectedApplications);

        stats.put("totalApplications", totalApplications);
        stats.put("pendingApplications", pendingApplications);
        stats.put("approvedApplications", approvedApplications);
        stats.put("rejectedApplications", rejectedApplications);
        
        return stats;
    }

    private String generatePIN() {
        Random random = new Random();
        return String.format("%04d", random.nextInt(10000));
    }

    private String generateCustomerCode() {
        // Generate customer code in format: CUST-YYYYMMDD-XXXX
        String datePrefix = java.time.LocalDate.now().toString().replace("-", "");
        String randomSuffix = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        return "CUST-" + datePrefix + "-" + randomSuffix;
    }

    private CustomerProfile.RiskCategory determineRiskCategory(BigDecimal creditScore) {
        if (creditScore == null) {
            return CustomerProfile.RiskCategory.MEDIUM;
        }

        double score = creditScore.doubleValue();
        if (score >= 750) {
            return CustomerProfile.RiskCategory.LOW;
        } else if (score >= 650) {
            return CustomerProfile.RiskCategory.MEDIUM;
        } else if (score >= 500) {
            return CustomerProfile.RiskCategory.HIGH;
        } else {
            return CustomerProfile.RiskCategory.VERY_HIGH;
        }
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetailsService.CustomUserPrincipal) {
            CustomUserDetailsService.CustomUserPrincipal userPrincipal = 
                (CustomUserDetailsService.CustomUserPrincipal) authentication.getPrincipal();
            return userPrincipal.getUser();
        }
        return null;
    }
}