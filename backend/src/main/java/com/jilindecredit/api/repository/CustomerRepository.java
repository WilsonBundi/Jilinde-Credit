package com.jilindecredit.api.repository;

import com.jilindecredit.api.model.Customer;
import com.jilindecredit.api.model.CustomerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByCustomerCode(String customerCode);
    Optional<Customer> findByNationalId(String nationalId);
    Optional<Customer> findByPhone(String phone);
    boolean existsByCustomerCode(String customerCode);
    boolean existsByNationalId(String nationalId);
    boolean existsByPhone(String phone);
    
    @Query("SELECT c FROM Customer c WHERE " +
           "LOWER(c.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.customerCode) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.phone) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Customer> searchCustomers(@Param("searchTerm") String searchTerm);
    
    // Additional methods for KYC status filtering
    List<Customer> findByCustomerProfile_KycStatus(CustomerProfile.KycStatus kycStatus);
    long countByCustomerProfile_KycStatus(CustomerProfile.KycStatus kycStatus);
}