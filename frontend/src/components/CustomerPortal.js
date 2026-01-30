import { useState, useEffect } from 'react';

// Helper function to safely parse JSON responses
const safeJsonParse = async (response, fallback = {}) => {
  try {
    const text = await response.text();
    return text ? JSON.parse(text) : fallback;
  } catch (e) {
    return fallback;
  }
};

const CustomerPortal = ({ customerData, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [biometricSetup, setBiometricSetup] = useState(customerData.customer.biometricEnabled || false);
  const [phoneVerified, setPhoneVerified] = useState(customerData.customer.phoneVerified || false);
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [showPhoneUpdate, setShowPhoneUpdate] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load customer dashboard data on component mount
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const response = await fetch(`/api/customer/${customerData.customer.id}/dashboard`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${customerData.token}`
          }
        });

        if (response.ok) {
          let data;
          const text = await response.text();
          try {
            data = text ? JSON.parse(text) : { availableCredit: 50000, creditScore: 750, loans: [] };
          } catch (e) {
            data = { availableCredit: 50000, creditScore: 750, loans: [] };
          }
          setDashboardData(data);
          setLoans(data.loans || []);
        } else {
          console.error('Failed to load dashboard data');
        }
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [customerData]);

  const handleBiometricSetup = async () => {
    try {
      const response = await fetch(`/api/customer/${customerData.customer.id}/biometric/setup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${customerData.token}`
        }
      });

      if (response.ok) {
        setBiometricSetup(true);
        alert('✅ Biometric setup completed successfully!');
      } else {
        const errorData = await safeJsonParse(response, { message: 'Biometric setup failed' });
        throw new Error(errorData.message || 'Biometric setup failed');
      }
    } catch (error) {
      console.error('Biometric setup error:', error);
      alert('❌ ' + error.message);
    }
  };

  const handleSendVerificationCode = async () => {
    setIsVerifying(true);
    try {
      const response = await fetch('/api/customer/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${customerData.token}`
        },
        body: JSON.stringify({ 
          phone: customerData.customer.phone,
          type: 'verification'
        })
      });

      if (response.ok) {
        setVerificationSent(true);
        alert('📱 Verification code sent to your phone number!');
      } else {
        const errorData = await safeJsonParse(response, { message: 'Failed to send verification code' });
        throw new Error(errorData.message || 'Failed to send verification code');
      }
    } catch (error) {
      console.error('Verification error:', error);
      alert('❌ ' + error.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyPhone = async () => {
    if (verificationCode.length !== 6) {
      alert('Please enter the complete 6-digit verification code.');
      return;
    }

    setIsVerifying(true);
    try {
      const response = await fetch('/api/customer/verify-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${customerData.token}`
        },
        body: JSON.stringify({ 
          phone: customerData.customer.phone,
          code: verificationCode
        })
      });

      if (response.ok) {
        setPhoneVerified(true);
        setShowPhoneVerification(false);
        setVerificationCode('');
        setVerificationSent(false);
        alert('✅ Phone number verified successfully!');
      } else {
        const errorData = await safeJsonParse(response, { message: 'Invalid verification code' });
        throw new Error(errorData.message || 'Invalid verification code');
      }
    } catch (error) {
      console.error('Verification error:', error);
      alert('❌ ' + error.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleUpdatePhoneNumber = async () => {
    if (!newPhoneNumber || newPhoneNumber.length < 10) {
      alert('Please enter a valid phone number.');
      return;
    }

    setIsVerifying(true);
    try {
      // Check if phone number is already in use
      const checkResponse = await fetch('/api/customer/check-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: newPhoneNumber })
      });

      if (!checkResponse.ok) {
        const errorData = await safeJsonParse(checkResponse, { error: 'UNKNOWN_ERROR' });
        if (errorData.error === 'PHONE_IN_USE') {
          alert('❌ This phone number is already registered with another account. Please use a different number.');
          return;
        }
      }

      // Update phone number
      const updateResponse = await fetch('/api/customer/update-phone', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${customerData.token}`
        },
        body: JSON.stringify({ 
          oldPhone: customerData.customer.phone,
          newPhone: newPhoneNumber
        })
      });

      if (updateResponse.ok) {
        customerData.customer.phone = newPhoneNumber;
        setPhoneVerified(false);
        setShowPhoneUpdate(false);
        setNewPhoneNumber('');
        alert('📱 Phone number updated successfully! Please verify your new number.');
      } else {
        const errorData = await safeJsonParse(updateResponse, { message: 'Failed to update phone number' });
        throw new Error(errorData.message || 'Failed to update phone number');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('❌ ' + error.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div>
            <h2 style={{ marginBottom: '30px', color: '#2e7d32' }}>
              📊 Account Dashboard
            </h2>
            
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '20px' }}>⏳</div>
                <p>Loading dashboard data...</p>
              </div>
            ) : (
              <>
                {!biometricSetup && (
                  <div style={{
                    padding: '20px',
                    background: '#fff3cd',
                    border: '1px solid #ffeaa7',
                    borderRadius: '8px',
                    marginBottom: '30px'
                  }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>
                      🔒 Complete Your Security Setup
                    </h4>
                    <p style={{ margin: '0 0 15px 0', color: '#856404' }}>
                      Set up biometric authentication for enhanced account security.
                    </p>
                    <button
                      onClick={handleBiometricSetup}
                      style={{
                        padding: '10px 20px',
                        background: '#4caf50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      👆 Setup Biometric Authentication
                    </button>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                  <div style={{
                    padding: '25px',
                    background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                    color: 'white',
                    borderRadius: '12px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>💰</div>
                    <h3 style={{ margin: '0 0 5px 0' }}>Available Credit</h3>
                    <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
                      KES {dashboardData?.availableCredit?.toLocaleString() || '0'}
                    </p>
                  </div>
                  
                  <div style={{
                    padding: '25px',
                    background: 'linear-gradient(135deg, #2196f3 0%, #42a5f5 100%)',
                    color: 'white',
                    borderRadius: '12px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📈</div>
                    <h3 style={{ margin: '0 0 5px 0' }}>Credit Score</h3>
                    <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
                      {dashboardData?.creditScore || 'N/A'}
                    </p>
                  </div>
                  
                  <div style={{
                    padding: '25px',
                    background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
                    color: 'white',
                    borderRadius: '12px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🏦</div>
                    <h3 style={{ margin: '0 0 5px 0' }}>Active Loans</h3>
                    <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
                      {loans?.length || 0}
                    </p>
                  </div>
                </div>

                <div style={{
                  padding: '25px',
                  background: '#f8f9fa',
                  borderRadius: '12px',
                  border: '1px solid #e0e0e0'
                }}>
                  <h3 style={{ margin: '0 0 20px 0', color: '#2e7d32' }}>🎉 Welcome to Jilinde Credit!</h3>
                  <p style={{ margin: '0 0 15px 0', lineHeight: '1.6' }}>
                    Your account has been successfully approved and activated. You can now:
                  </p>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    <li>Apply for loans up to your credit limit</li>
                    <li>Make payments and track your loan history</li>
                    <li>Build your credit score with timely payments</li>
                    <li>Access 24/7 customer support</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        );

      case 'loans':
        return (
          <div>
            <h2 style={{ marginBottom: '30px', color: '#2e7d32' }}>
              🏦 Loan Management
            </h2>
            
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '20px' }}>⏳</div>
                <p>Loading loan data...</p>
              </div>
            ) : loans && loans.length > 0 ? (
              <div style={{ display: 'grid', gap: '20px' }}>
                {loans.map((loan, index) => (
                  <div key={index} style={{
                    padding: '25px',
                    background: 'white',
                    borderRadius: '12px',
                    border: '1px solid #e0e0e0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                      <div>
                        <label style={{ fontSize: '0.9rem', color: '#666', fontWeight: 'bold' }}>Loan Amount</label>
                        <p style={{ margin: '5px 0', fontSize: '1.2rem', fontWeight: 'bold' }}>
                          KES {loan.amount?.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <label style={{ fontSize: '0.9rem', color: '#666', fontWeight: 'bold' }}>Outstanding</label>
                        <p style={{ margin: '5px 0', fontSize: '1.2rem', fontWeight: 'bold' }}>
                          KES {loan.outstanding?.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <label style={{ fontSize: '0.9rem', color: '#666', fontWeight: 'bold' }}>Status</label>
                        <p style={{ margin: '5px 0' }}>
                          <span style={{
                            padding: '4px 12px',
                            background: loan.status === 'active' ? '#d4edda' : '#fff3cd',
                            color: loan.status === 'active' ? '#155724' : '#856404',
                            borderRadius: '12px',
                            fontSize: '0.9rem',
                            fontWeight: 'bold'
                          }}>
                            {loan.status}
                          </span>
                        </p>
                      </div>
                      <div>
                        <label style={{ fontSize: '0.9rem', color: '#666', fontWeight: 'bold' }}>Next Payment</label>
                        <p style={{ margin: '5px 0', fontSize: '1rem' }}>
                          {loan.nextPaymentDate ? new Date(loan.nextPaymentDate).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                padding: '40px',
                textAlign: 'center',
                background: '#f8f9fa',
                borderRadius: '12px',
                border: '2px dashed #e0e0e0'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>💰</div>
                <h3 style={{ marginBottom: '15px' }}>No Active Loans</h3>
                <p style={{ marginBottom: '25px', color: '#666' }}>
                  You don't have any active loans. Apply for your first loan to get started.
                </p>
                <button
                  style={{
                    padding: '15px 30px',
                    background: 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                  onClick={() => alert('Loan application feature coming soon!')}
                >
                  🚀 Apply for Loan
                </button>
              </div>
            )}
          </div>
        );

      case 'profile':
        return (
          <div>
            <h2 style={{ marginBottom: '30px', color: '#2e7d32' }}>
              👤 Profile Information
            </h2>
            
            {/* Phone Verification Alert */}
            {!phoneVerified && (
              <div style={{
                padding: '20px',
                background: '#fff3cd',
                border: '1px solid #ffeaa7',
                borderRadius: '12px',
                marginBottom: '30px'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>
                  📱 Phone Verification Required
                </h4>
                <p style={{ margin: '0 0 15px 0', color: '#856404' }}>
                  Your phone number needs to be verified for security purposes and to prevent account duplication.
                </p>
                <button
                  onClick={() => setShowPhoneVerification(true)}
                  style={{
                    padding: '10px 20px',
                    background: '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    marginRight: '10px'
                  }}
                >
                  📱 Verify Phone Number
                </button>
                <button
                  onClick={() => setShowPhoneUpdate(true)}
                  style={{
                    padding: '10px 20px',
                    background: '#2196f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  🔄 Update Phone Number
                </button>
              </div>
            )}

            {/* Phone Verification Modal */}
            {showPhoneVerification && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
              }}>
                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '40px',
                  maxWidth: '500px',
                  width: '90%',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                }}>
                  <h3 style={{ marginBottom: '20px', color: '#2e7d32', textAlign: 'center' }}>
                    📱 Verify Phone Number
                  </h3>
                  <p style={{ marginBottom: '20px', textAlign: 'center', color: '#666' }}>
                    We'll send a 6-digit verification code to:
                    <br />
                    <strong>{customerData.customer.phone}</strong>
                  </p>

                  {!verificationSent ? (
                    <div style={{ textAlign: 'center' }}>
                      <button
                        onClick={handleSendVerificationCode}
                        disabled={isVerifying}
                        style={{
                          padding: '15px 30px',
                          background: isVerifying ? '#ccc' : '#4caf50',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          cursor: isVerifying ? 'not-allowed' : 'pointer',
                          marginBottom: '20px'
                        }}
                      >
                        {isVerifying ? '⏳ Sending...' : '📤 Send Verification Code'}
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                          Enter 6-Digit Code:
                        </label>
                        <input
                          type="text"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder="123456"
                          style={{
                            width: '100%',
                            padding: '15px',
                            border: '2px solid #e0e0e0',
                            borderRadius: '8px',
                            fontSize: '1.2rem',
                            textAlign: 'center',
                            letterSpacing: '4px',
                            boxSizing: 'border-box'
                          }}
                          maxLength="6"
                        />
                      </div>

                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        <button
                          onClick={handleVerifyPhone}
                          disabled={isVerifying || verificationCode.length !== 6}
                          style={{
                            padding: '12px 24px',
                            background: (isVerifying || verificationCode.length !== 6) ? '#ccc' : '#4caf50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: (isVerifying || verificationCode.length !== 6) ? 'not-allowed' : 'pointer',
                            fontWeight: 'bold'
                          }}
                        >
                          {isVerifying ? '⏳ Verifying...' : '✅ Verify Code'}
                        </button>
                        
                        <button
                          onClick={handleSendVerificationCode}
                          disabled={isVerifying}
                          style={{
                            padding: '12px 24px',
                            background: 'transparent',
                            color: '#666',
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            cursor: isVerifying ? 'not-allowed' : 'pointer'
                          }}
                        >
                          🔄 Resend Code
                        </button>
                      </div>
                    </div>
                  )}

                  <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button
                      onClick={() => {
                        setShowPhoneVerification(false);
                        setVerificationCode('');
                        setVerificationSent(false);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#666',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Phone Update Modal */}
            {showPhoneUpdate && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
              }}>
                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '40px',
                  maxWidth: '500px',
                  width: '90%',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                }}>
                  <h3 style={{ marginBottom: '20px', color: '#2e7d32', textAlign: 'center' }}>
                    🔄 Update Phone Number
                  </h3>
                  
                  <div style={{ marginBottom: '20px', padding: '15px', background: '#fff3cd', borderRadius: '8px' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#856404' }}>
                      ⚠️ <strong>Important:</strong> Each phone number can only be used for one account. 
                      We'll check if your new number is already registered.
                    </p>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                      Current Phone Number:
                    </label>
                    <div style={{
                      padding: '12px',
                      background: '#f5f5f5',
                      borderRadius: '8px',
                      color: '#666'
                    }}>
                      {customerData.customer.phone}
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                      New Phone Number: *
                    </label>
                    <input
                      type="tel"
                      value={newPhoneNumber}
                      onChange={(e) => setNewPhoneNumber(e.target.value)}
                      placeholder="+254712345679"
                      style={{
                        width: '100%',
                        padding: '15px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button
                      onClick={handleUpdatePhoneNumber}
                      disabled={isVerifying || !newPhoneNumber}
                      style={{
                        padding: '12px 24px',
                        background: (isVerifying || !newPhoneNumber) ? '#ccc' : '#2196f3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: (isVerifying || !newPhoneNumber) ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      {isVerifying ? '⏳ Updating...' : '🔄 Update Number'}
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowPhoneUpdate(false);
                        setNewPhoneNumber('');
                      }}
                      style={{
                        padding: '12px 24px',
                        background: 'transparent',
                        color: '#666',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Profile Information */}
            <div style={{
              padding: '30px',
              background: 'white',
              borderRadius: '12px',
              border: '1px solid #e0e0e0'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#666' }}>
                    Full Name
                  </label>
                  <p style={{ margin: 0, fontSize: '1.1rem' }}>{customerData.customer.name}</p>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#666' }}>
                    Phone Number
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <p style={{ margin: 0, fontSize: '1.1rem' }}>{customerData.customer.phone}</p>
                    <span style={{
                      padding: '4px 8px',
                      background: phoneVerified ? '#d4edda' : '#fff3cd',
                      color: phoneVerified ? '#155724' : '#856404',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      {phoneVerified ? '✅ Verified' : '⏳ Unverified'}
                    </span>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#666' }}>
                    Email Address
                  </label>
                  <p style={{ margin: 0, fontSize: '1.1rem' }}>{customerData.customer.email}</p>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#666' }}>
                    Account Status
                  </label>
                  <span style={{
                    padding: '4px 12px',
                    background: '#d4edda',
                    color: '#155724',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}>
                    ✅ {customerData.customer.status}
                  </span>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#666' }}>
                    Biometric Status
                  </label>
                  <span style={{
                    padding: '4px 12px',
                    background: biometricSetup ? '#d4edda' : '#fff3cd',
                    color: biometricSetup ? '#155724' : '#856404',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}>
                    {biometricSetup ? '✅ Enabled' : '⏳ Pending Setup'}
                  </span>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#666' }}>
                    Phone Verification
                  </label>
                  <span style={{
                    padding: '4px 12px',
                    background: phoneVerified ? '#d4edda' : '#ffebee',
                    color: phoneVerified ? '#155724' : '#c62828',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}>
                    {phoneVerified ? '✅ Verified & Unique' : '❌ Requires Verification'}
                  </span>
                </div>
              </div>

              {/* Security Actions */}
              <div style={{
                marginTop: '30px',
                padding: '20px',
                background: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #e0e0e0'
              }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#2e7d32' }}>🔒 Security Actions</h4>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {!phoneVerified && (
                    <button
                      onClick={() => setShowPhoneVerification(true)}
                      style={{
                        padding: '10px 20px',
                        background: '#4caf50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      📱 Verify Phone
                    </button>
                  )}
                  <button
                    onClick={() => setShowPhoneUpdate(true)}
                    style={{
                      padding: '10px 20px',
                      background: '#2196f3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    🔄 Update Phone
                  </button>
                  {!biometricSetup && (
                    <button
                      onClick={handleBiometricSetup}
                      style={{
                        padding: '10px 20px',
                        background: '#ff9800',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      👆 Setup Biometric
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
          color: 'white',
          padding: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '5px' }}>
              🏦 Welcome, {customerData.customer.name}!
            </h1>
            <p style={{ fontSize: '1rem', opacity: 0.9, margin: 0 }}>
              Jilinde Credit Customer Portal
            </p>
          </div>
          <button
            onClick={onLogout}
            style={{
              padding: '10px 20px',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🚪 Logout
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e0e0e0',
          background: '#f8f9fa'
        }}>
          {[
            { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
            { id: 'loans', label: '🏦 Loans', icon: '🏦' },
            { id: 'profile', label: '👤 Profile', icon: '👤' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '15px 25px',
                background: activeTab === tab.id ? 'white' : 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '3px solid #4caf50' : '3px solid transparent',
                cursor: 'pointer',
                fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                color: activeTab === tab.id ? '#2e7d32' : '#666',
                fontSize: '1rem'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ padding: '40px' }}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default CustomerPortal;