package com.jilindecredit.api.repository;

import com.jilindecredit.api.model.BiometricData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BiometricDataRepository extends JpaRepository<BiometricData, Long> {
    Optional<BiometricData> findByCustomerId(Long customerId);
    Optional<BiometricData> findByBiometricHash(String biometricHash);
    
    List<BiometricData> findByVerificationStatus(BiometricData.VerificationStatus verificationStatus);
    
    @Query("SELECT bd FROM BiometricData bd WHERE bd.customer.id = :customerId AND bd.verificationStatus = :status")
    Optional<BiometricData> findByCustomerIdAndVerificationStatus(
        @Param("customerId") Long customerId, 
        @Param("status") BiometricData.VerificationStatus status);
    
    @Query("SELECT COUNT(bd) FROM BiometricData bd WHERE bd.verificationStatus = :status")
    Long countByVerificationStatus(@Param("status") BiometricData.VerificationStatus status);
    
    boolean existsByCustomerId(Long customerId);
}