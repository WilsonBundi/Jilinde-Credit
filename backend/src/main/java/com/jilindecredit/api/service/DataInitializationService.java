package com.jilindecredit.api.service;

import com.jilindecredit.api.model.Customer;
import com.jilindecredit.api.model.CustomerProfile;
import com.jilindecredit.api.model.User;
import com.jilindecredit.api.repository.CustomerRepository;
import com.jilindecredit.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class DataInitializationService implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        initializeDefaultUsers();
        initializeSampleCustomers();
    }

    private void initializeDefaultUsers() {
        // Create admin user if not exists
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@jilindecredit.com");
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setRole(User.Role.ADMIN);
            admin.setIsActive(true);
            userRepository.save(admin);
            System.out.println("✅ Created default admin user: admin/admin123");
        }

        // Create loan officer user if not exists
        if (!userRepository.existsByUsername("loan_officer")) {
            User officer = new User();
            officer.setUsername("loan_officer");
            officer.setEmail("officer@jilindecredit.com");
            officer.setPasswordHash(passwordEncoder.encode("loan123"));
            officer.setRole(User.Role.OFFICER);
            officer.setIsActive(true);
            userRepository.save(officer);
            System.out.println("✅ Created default loan officer user: loan_officer/loan123");
        }

        // Create manager user if not exists
        if (!userRepository.existsByUsername("manager")) {
            User manager = new User();
            manager.setUsername("manager");
            manager.setEmail("manager@jilindecredit.com");
            manager.setPasswordHash(passwordEncoder.encode("manager123"));
            manager.setRole(User.Role.MANAGER);
            manager.setIsActive(true);
            userRepository.save(manager);
            System.out.println("✅ Created default manager user: manager/manager123");
        }
    }

    private void initializeSampleCustomers() {
        // Only create sample customers if none exist
        if (customerRepository.count() == 0) {
            createSampleCustomer("John", "Doe", "0712345678", "john.doe@email.com", "12345678", "MALE");
            createSampleCustomer("Jane", "Smith", "0723456789", "jane.smith@email.com", "23456789", "FEMALE");
            createSampleCustomer("Peter", "Mwangi", "0734567890", "peter.mwangi@email.com", "34567890", "MALE");
            System.out.println("✅ Created 3 sample customer applications for testing");
        }
    }

    private void createSampleCustomer(String firstName, String lastName, String phone, String email, String nationalId, String gender) {
        // Generate unique customer code
        String customerCode = generateCustomerCode();
        while (customerRepository.existsByCustomerCode(customerCode)) {
            customerCode = generateCustomerCode();
        }

        Customer customer = new Customer();
        customer.setCustomerCode(customerCode);
        customer.setFirstName(firstName);
        customer.setLastName(lastName);
        customer.setPhone(phone);
        customer.setEmail(email);
        customer.setNationalId(nationalId);
        customer.setDateOfBirth(LocalDate.of(1990, 1, 1));
        customer.setGender(Customer.Gender.valueOf(gender));
        customer.setAddress("Nairobi, Kenya");
        customer.setOccupation("Business Owner");
        customer.setMonthlyIncome(new BigDecimal("50000"));
        customer.setMaritalStatus("Single");
        customer.setCreatedAt(LocalDateTime.now());
        customer.setUpdatedAt(LocalDateTime.now());

        // Create customer profile
        CustomerProfile profile = new CustomerProfile();
        profile.setCustomer(customer);
        profile.setKycStatus(CustomerProfile.KycStatus.PENDING);
        profile.setOnboardingCompleted(false);
        profile.setDigitalLiteracyLevel(3); // 3 = INTERMEDIATE level
        profile.setPreferredLanguage("English");
        profile.setVoiceAssistanceEnabled(false);
        profile.setBaselineCreditScore(new BigDecimal("650"));
        profile.setRiskCategory(CustomerProfile.RiskCategory.MEDIUM);

        customer.setCustomerProfile(profile);
        customerRepository.save(customer);
    }

    private String generateCustomerCode() {
        // Generate customer code in format: CUST-YYYYMMDD-XXXX
        String datePrefix = java.time.LocalDate.now().toString().replace("-", "");
        String randomSuffix = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        return "CUST-" + datePrefix + "-" + randomSuffix;
    }
}