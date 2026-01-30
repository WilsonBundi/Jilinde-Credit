package com.jilindecredit.api.repository;

import com.jilindecredit.api.model.CustomerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerProfileRepository extends JpaRepository<CustomerProfile, Long> {
    Optional<CustomerProfile> findByCustomerId(Long customerId);
    Optional<CustomerProfile> findByKycReferenceNumber(String kycReferenceNumber);
    
    List<CustomerProfile> findByKycStatus(CustomerProfile.KycStatus kycStatus);
    List<CustomerProfile> findByRiskCategory(CustomerProfile.RiskCategory riskCategory);
    List<CustomerProfile> findByOnboardingCompleted(Boolean onboardingCompleted);
    
    @Query("SELECT cp FROM CustomerProfile cp WHERE cp.onboardingCompleted = false AND cp.kycStatus = :kycStatus")
    List<CustomerProfile> findIncompleteOnboardingByKycStatus(@Param("kycStatus") CustomerProfile.KycStatus kycStatus);
    
    @Query("SELECT COUNT(cp) FROM CustomerProfile cp WHERE cp.onboardingCompleted = true")
    Long countCompletedOnboarding();
    
    @Query("SELECT COUNT(cp) FROM CustomerProfile cp WHERE cp.kycStatus = :kycStatus")
    Long countByKycStatus(@Param("kycStatus") CustomerProfile.KycStatus kycStatus);
}