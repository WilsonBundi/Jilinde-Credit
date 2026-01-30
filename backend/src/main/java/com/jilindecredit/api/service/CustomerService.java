package com.jilindecredit.api.service;

import com.jilindecredit.api.dto.CustomerDto;
import com.jilindecredit.api.model.Customer;
import com.jilindecredit.api.model.CustomerProfile;
import com.jilindecredit.api.model.User;
import com.jilindecredit.api.repository.CustomerRepository;
import com.jilindecredit.api.security.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    // Simple in-memory storage for verification codes (in production, use Redis)
    private Map<String, String> verificationCodes = new HashMap<>();
    private Map<String, LocalDateTime> verificationCodeExpiry = new HashMap<>();

    public Map<String, Object> authenticateCustomer(String phone, String pin) {
        Optional<Customer> customerOpt = customerRepository.findByPhone(phone);
        
        if (customerOpt.isEmpty()) {
            throw new IllegalArgumentException("Invalid phone number or PIN");
        }

        Customer customer = customerOpt.get();
        
        // Check if customer is approved
        CustomerProfile profile = customer.getCustomerProfile();
        if (profile == null || profile.getKycStatus() != CustomerProfile.KycStatus.VERIFIED) {
            throw new IllegalArgumentException("Account not yet approved. Please wait for admin approval.");
        }

        // Check PIN (assuming we add loginPin field to Customer model)
        if (customer.getLoginPin() == null || !customer.getLoginPin().equals(pin)) {
            throw new IllegalArgumentException("Invalid phone number or PIN");
        }

        // Create response with customer data and token
        Map<String, Object> result = new HashMap<>();
        Map<String, Object> customerData = new HashMap<>();
        customerData.put("id", customer.getId());
        customerData.put("name", customer.getFirstName() + " " + customer.getLastName());
        customerData.put("phone", customer.getPhone());
        customerData.put("email", customer.getEmail());
        customerData.put("status", "approved");
        customerData.put("phoneVerified", profile.getPhoneVerified() != null ? profile.getPhoneVerified() : false);
        customerData.put("biometricEnabled", profile.getBiometricEnabled() != null ? profile.getBiometricEnabled() : false);

        result.put("customer", customerData);
        result.put("token", "jwt-token-placeholder"); // TODO: Generate actual JWT token
        
        return result;
    }

    public Map<String, Object> getCustomerDashboard(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        CustomerProfile profile = customer.getCustomerProfile();
        
        Map<String, Object> dashboard = new HashMap<>();
        
        // Available credit (based on credit score and risk category)
        BigDecimal availableCredit = calculateAvailableCredit(profile);
        dashboard.put("availableCredit", availableCredit);
        
        // Credit score
        dashboard.put("creditScore", profile != null ? profile.getBaselineCreditScore() : BigDecimal.ZERO);
        
        // Active loans (TODO: implement loan service integration)
        dashboard.put("loans", new ArrayList<>());
        
        return dashboard;
    }

    public Map<String, Object> setupBiometric(Long customerId, Map<String, Object> biometricData) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        CustomerProfile profile = customer.getCustomerProfile();
        if (profile == null) {
            throw new IllegalStateException("Customer profile not found");
        }

        // TODO: Process biometric data and store securely
        profile.setBiometricEnabled(true);
        customerRepository.save(customer);

        Map<String, Object> result = new HashMap<>();
        result.put("status", "success");
        result.put("message", "Biometric authentication enabled successfully");
        
        return result;
    }

    public Map<String, Object> sendVerificationCode(String phone, String type) {
        System.out.println("📱 CustomerService: Sending verification code to " + phone + " (type: " + type + ")");
        
        // Normalize phone number for lookup (handle both 07xxx and +254xxx formats)
        String normalizedPhone = normalizePhoneNumber(phone);
        System.out.println("📱 CustomerService: Normalized phone: " + normalizedPhone);
        
        Optional<Customer> customerOpt = customerRepository.findByPhone(phone);
        
        // If not found with original format, try normalized format
        if (customerOpt.isEmpty()) {
            customerOpt = customerRepository.findByPhone(normalizedPhone);
        }
        
        // If still not found, try the other format
        if (customerOpt.isEmpty()) {
            String alternativePhone = phone.startsWith("+254") ? 
                "0" + phone.substring(4) : 
                "+254" + phone.substring(1);
            System.out.println("📱 CustomerService: Trying alternative format: " + alternativePhone);
            customerOpt = customerRepository.findByPhone(alternativePhone);
        }
        
        if (customerOpt.isEmpty()) {
            System.err.println("❌ CustomerService: Customer not found with phone: " + phone + " or normalized: " + normalizedPhone);
            throw new IllegalArgumentException("Customer not found with this phone number");
        }

        Customer customer = customerOpt.get();
        System.out.println("✅ CustomerService: Found customer: " + customer.getFirstName() + " " + customer.getLastName());

        // Generate verification code
        String verificationCode = generateVerificationCode();
        
        // Store verification code with expiry (5 minutes) using the original phone number from request
        verificationCodes.put(phone, verificationCode);
        verificationCodeExpiry.put(phone, LocalDateTime.now().plusMinutes(5));
        
        // TODO: Send actual SMS (for now, we'll log it)
        System.out.println("📱 SMS Verification Code for " + phone + ": " + verificationCode);
        System.out.println("📱 Code will expire at: " + verificationCodeExpiry.get(phone));
        
        Map<String, Object> result = new HashMap<>();
        result.put("status", "sent");
        result.put("message", "Verification code sent successfully");
        result.put("code", verificationCode); // For demo purposes - remove in production
        
        System.out.println("✅ CustomerService: Verification code sent successfully");
        return result;
    }

    public Map<String, Object> verifyPhoneNumber(String phone, String code) {
        System.out.println("📱 CustomerService: Verifying phone " + phone + " with code: " + code);
        
        // Normalize phone number for lookup
        String normalizedPhone = normalizePhoneNumber(phone);
        System.out.println("📱 CustomerService: Normalized phone: " + normalizedPhone);
        
        Optional<Customer> customerOpt = customerRepository.findByPhone(phone);
        
        // If not found with original format, try normalized format
        if (customerOpt.isEmpty()) {
            customerOpt = customerRepository.findByPhone(normalizedPhone);
        }
        
        // If still not found, try the other format
        if (customerOpt.isEmpty()) {
            String alternativePhone = phone.startsWith("+254") ? 
                "0" + phone.substring(4) : 
                "+254" + phone.substring(1);
            System.out.println("📱 CustomerService: Trying alternative format: " + alternativePhone);
            customerOpt = customerRepository.findByPhone(alternativePhone);
        }
        
        if (customerOpt.isEmpty()) {
            System.err.println("❌ CustomerService: Customer not found with phone: " + phone);
            throw new IllegalArgumentException("Customer not found with this phone number");
        }

        // Check if verification code exists and is not expired
        String storedCode = verificationCodes.get(phone);
        LocalDateTime expiry = verificationCodeExpiry.get(phone);
        
        System.out.println("📱 CustomerService: Stored code: " + storedCode + ", Expiry: " + expiry);
        
        if (storedCode == null || expiry == null) {
            System.err.println("❌ CustomerService: No verification code found for phone: " + phone);
            throw new IllegalArgumentException("No verification code found. Please request a new code.");
        }
        
        if (LocalDateTime.now().isAfter(expiry)) {
            // Clean up expired code
            verificationCodes.remove(phone);
            verificationCodeExpiry.remove(phone);
            System.err.println("❌ CustomerService: Verification code expired for phone: " + phone);
            throw new IllegalArgumentException("Verification code has expired. Please request a new code.");
        }
        
        if (!storedCode.equals(code)) {
            System.err.println("❌ CustomerService: Invalid code. Expected: " + storedCode + ", Got: " + code);
            throw new IllegalArgumentException("Invalid verification code");
        }

        // Code is valid - mark phone as verified
        Customer customer = customerOpt.get();
        CustomerProfile profile = customer.getCustomerProfile();
        if (profile != null) {
            profile.setPhoneVerified(true);
            customerRepository.save(customer);
            System.out.println("✅ CustomerService: Phone verified and saved for customer: " + customer.getFirstName());
        }
        
        // Clean up used code
        verificationCodes.remove(phone);
        verificationCodeExpiry.remove(phone);

        Map<String, Object> result = new HashMap<>();
        result.put("status", "verified");
        result.put("message", "Phone number verified successfully");
        
        System.out.println("✅ CustomerService: Phone verification completed successfully");
        return result;
    }

    private String normalizePhoneNumber(String phone) {
        if (phone == null) return null;
        
        // Remove all non-digit characters
        String digits = phone.replaceAll("[^0-9]", "");
        
        // Convert to international format
        if (digits.startsWith("0") && digits.length() == 10) {
            // Kenyan local format (0712345678) -> +254712345678
            return "+254" + digits.substring(1);
        } else if (digits.startsWith("254") && digits.length() == 12) {
            // International format without + (254712345678) -> +254712345678
            return "+" + digits;
        } else if (phone.startsWith("+254") && digits.length() == 12) {
            // Already in correct international format
            return phone;
        }
        
        // Return original if no conversion needed
        return phone;
    }

    public Map<String, Object> updatePhoneNumber(String oldPhone, String newPhone) {
        Optional<Customer> customerOpt = customerRepository.findByPhone(oldPhone);
        
        if (customerOpt.isEmpty()) {
            throw new IllegalArgumentException("Customer not found with this phone number");
        }

        if (customerRepository.existsByPhone(newPhone)) {
            throw new IllegalArgumentException("New phone number is already registered");
        }

        Customer customer = customerOpt.get();
        customer.setPhone(newPhone);
        
        // Reset phone verification status
        CustomerProfile profile = customer.getCustomerProfile();
        if (profile != null) {
            profile.setPhoneVerified(false);
        }
        
        customerRepository.save(customer);

        Map<String, Object> result = new HashMap<>();
        result.put("status", "updated");
        result.put("message", "Phone number updated successfully");
        
        return result;
    }

    private BigDecimal calculateAvailableCredit(CustomerProfile profile) {
        if (profile == null || profile.getBaselineCreditScore() == null) {
            return BigDecimal.ZERO;
        }

        // Simple credit limit calculation based on credit score
        BigDecimal creditScore = profile.getBaselineCreditScore();
        if (creditScore.compareTo(BigDecimal.valueOf(750)) >= 0) {
            return BigDecimal.valueOf(100000); // KES 100,000
        } else if (creditScore.compareTo(BigDecimal.valueOf(650)) >= 0) {
            return BigDecimal.valueOf(50000); // KES 50,000
        } else if (creditScore.compareTo(BigDecimal.valueOf(500)) >= 0) {
            return BigDecimal.valueOf(25000); // KES 25,000
        } else {
            return BigDecimal.valueOf(10000); // KES 10,000
        }
    }

    private String generateVerificationCode() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(1000000));
    }

    public List<CustomerDto> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(CustomerDto::new)
                .collect(Collectors.toList());
    }

    public Page<CustomerDto> getAllCustomers(Pageable pageable) {
        return customerRepository.findAll(pageable)
                .map(CustomerDto::new);
    }

    public Optional<CustomerDto> getCustomerById(Long id) {
        return customerRepository.findById(id)
                .map(CustomerDto::new);
    }

    public Optional<CustomerDto> getCustomerByCode(String customerCode) {
        return customerRepository.findByCustomerCode(customerCode)
                .map(CustomerDto::new);
    }

    public List<CustomerDto> searchCustomers(String searchTerm) {
        return customerRepository.searchCustomers(searchTerm).stream()
                .map(CustomerDto::new)
                .collect(Collectors.toList());
    }

    public CustomerDto createCustomer(CustomerDto customerDto) {
        // Validate unique constraints
        if (customerRepository.existsByCustomerCode(customerDto.getCustomerCode())) {
            throw new IllegalArgumentException("Customer code already exists: " + customerDto.getCustomerCode());
        }
        
        if (customerDto.getNationalId() != null && 
            customerRepository.existsByNationalId(customerDto.getNationalId())) {
            throw new IllegalArgumentException("National ID already exists: " + customerDto.getNationalId());
        }
        
        if (customerRepository.existsByPhone(customerDto.getPhone())) {
            throw new IllegalArgumentException("Phone number already exists: " + customerDto.getPhone());
        }

        Customer customer = convertToEntity(customerDto);
        customer.setCreatedBy(getCurrentUser());
        customer.setCreatedAt(LocalDateTime.now());
        customer.setUpdatedAt(LocalDateTime.now());

        Customer savedCustomer = customerRepository.save(customer);
        return new CustomerDto(savedCustomer);
    }

    public CustomerDto updateCustomer(Long id, CustomerDto customerDto) {
        Customer existingCustomer = customerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with id: " + id));

        // Validate unique constraints (excluding current customer)
        if (!existingCustomer.getCustomerCode().equals(customerDto.getCustomerCode()) &&
            customerRepository.existsByCustomerCode(customerDto.getCustomerCode())) {
            throw new IllegalArgumentException("Customer code already exists: " + customerDto.getCustomerCode());
        }

        if (customerDto.getNationalId() != null &&
            !customerDto.getNationalId().equals(existingCustomer.getNationalId()) &&
            customerRepository.existsByNationalId(customerDto.getNationalId())) {
            throw new IllegalArgumentException("National ID already exists: " + customerDto.getNationalId());
        }

        if (!existingCustomer.getPhone().equals(customerDto.getPhone()) &&
            customerRepository.existsByPhone(customerDto.getPhone())) {
            throw new IllegalArgumentException("Phone number already exists: " + customerDto.getPhone());
        }

        // Update fields
        updateEntityFromDto(existingCustomer, customerDto);
        existingCustomer.setUpdatedAt(LocalDateTime.now());

        Customer savedCustomer = customerRepository.save(existingCustomer);
        return new CustomerDto(savedCustomer);
    }

    public void deleteCustomer(Long id) {
        if (!customerRepository.existsById(id)) {
            throw new IllegalArgumentException("Customer not found with id: " + id);
        }
        customerRepository.deleteById(id);
    }

    public boolean existsByCustomerCode(String customerCode) {
        return customerRepository.existsByCustomerCode(customerCode);
    }

    public boolean existsByNationalId(String nationalId) {
        return customerRepository.existsByNationalId(nationalId);
    }

    public boolean existsByPhone(String phone) {
        return customerRepository.existsByPhone(phone);
    }

    private Customer convertToEntity(CustomerDto dto) {
        Customer customer = new Customer();
        updateEntityFromDto(customer, dto);
        return customer;
    }

    private void updateEntityFromDto(Customer customer, CustomerDto dto) {
        customer.setCustomerCode(dto.getCustomerCode());
        customer.setFirstName(dto.getFirstName());
        customer.setLastName(dto.getLastName());
        customer.setPhone(dto.getPhone());
        customer.setEmail(dto.getEmail());
        customer.setNationalId(dto.getNationalId());
        customer.setAddress(dto.getAddress());
        customer.setOccupation(dto.getOccupation());
        customer.setMonthlyIncome(dto.getMonthlyIncome());
        customer.setDateOfBirth(dto.getDateOfBirth());
        customer.setGender(dto.getGender());
        customer.setMaritalStatus(dto.getMaritalStatus());
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