import { useState } from 'react';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import CustomerDashboard from './pages/CustomerDashboard';
import LandingPage from './components/LandingPage';
// MOBILE KYC IMPORTS - COMMENTED OUT TEMPORARILY
// import MobileKycQrCode from './components/MobileKycQrCode';
// import MobileKycVerification from './pages/MobileKycVerification';

// Enhanced Registration Component with Security Features
const Registration = ({ onBack, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMobileKyc, setShowMobileKyc] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    
    // Identity Verification
    idNumber: '',
    idType: 'national_id',
    idDocument: null,
    
    // Document Verification (CRITICAL SECURITY)
    documentFirstName: '',
    documentLastName: '',
    documentIdNumber: '',
    documentDateOfBirth: '',
    documentGender: '',
    
    // Address Information
    county: '',
    subCounty: '',
    ward: '',
    village: '',
    
    // Employment Information
    employmentStatus: '',
    employer: '',
    monthlyIncome: '',
    
    // Biometric Consent
    biometricConsent: false,
    kycCompleted: false,
    customerId: null
  });

  const steps = [
    { number: 1, title: 'Personal Information', icon: '👤' },
    { number: 2, title: 'Identity Verification', icon: '🆔' },
    { number: 3, title: 'Address Details', icon: '🏠' },
    { number: 4, title: 'Employment Info', icon: '💼' },
    // { number: 5, title: 'KYC Biometric Setup', icon: '🔒' }, // COMMENTED OUT - KYC TEMPORARILY DISABLED
    { number: 5, title: 'Final Consent', icon: '✅' }
  ];

  const [validationErrors, setValidationErrors] = useState({});
  const [phoneCheckStatus, setPhoneCheckStatus] = useState('');

  const validateField = (field, value) => {
    const errors = { ...validationErrors };
    
    switch (field) {
      case 'firstName':
      case 'lastName':
        if (!value || value.length < 2) {
          errors[field] = 'Must be at least 2 characters';
        } else {
          delete errors[field];
        }
        break;
      case 'phone':
        const phoneRegex = /^(\+254|0)[7][0-9]{8}$/;
        if (!value) {
          errors[field] = 'Phone number is required';
        } else if (!phoneRegex.test(value)) {
          errors[field] = 'Enter valid Kenyan phone number (e.g., +254712345678 or 0712345678)';
        } else {
          delete errors[field];
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          errors[field] = 'Email is required';
        } else if (!emailRegex.test(value)) {
          errors[field] = 'Enter a valid email address';
        } else {
          delete errors[field];
        }
        break;
      case 'dateOfBirth':
        if (!value) {
          errors[field] = 'Date of birth is required';
        } else {
          const birthDate = new Date(value);
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          if (age < 18) {
            errors[field] = 'Must be at least 18 years old';
          } else if (age > 100) {
            errors[field] = 'Please enter a valid date of birth';
          } else {
            delete errors[field];
          }
        }
        break;
      case 'idNumber':
        if (!value) {
          errors[field] = 'ID number is required';
        } else if (value.length < 6) {
          errors[field] = 'ID number must be at least 6 characters';
        } else {
          delete errors[field];
        }
        break;
      case 'monthlyIncome':
        const income = parseFloat(value);
        if (!value) {
          errors[field] = 'Monthly income is required';
        } else if (income < 1000) {
          errors[field] = 'Minimum monthly income is KES 1,000';
        } else {
          delete errors[field];
        }
        break;
      default:
        if (!value) {
          errors[field] = 'This field is required';
        } else {
          delete errors[field];
        }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Validate field on change
    validateField(field, value);
    
    // Check for duplicate phone number when phone is entered
    if (field === 'phone' && value.length >= 10) {
      checkPhoneAvailability(value);
    }
  };

  const checkPhoneAvailability = async (phoneNumber) => {
    setPhoneCheckStatus('checking');
    try {
      const response = await fetch('/api/onboarding/check-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: phoneNumber })
      });

      if (response.ok) {
        setPhoneCheckStatus('available');
      } else {
        let errorData;
        const text = await response.text();
        try {
          errorData = text ? JSON.parse(text) : { error: 'UNKNOWN_ERROR' };
        } catch (e) {
          errorData = { error: 'PARSE_ERROR', message: 'Invalid response format' };
        }
        
        if (errorData.error === 'PHONE_IN_USE') {
          setPhoneCheckStatus('unavailable');
          setValidationErrors(prev => ({
            ...prev,
            phone: 'This phone number is already registered. Please use a different number.'
          }));
        } else {
          setPhoneCheckStatus('error');
        }
      }
    } catch (error) {
      console.error('Phone check error:', error);
      setPhoneCheckStatus('error');
    }
  };

  const handleFileUpload = (field, file) => {
    if (file) {
      // Generate a shorter hash for document integrity
      const reader = new FileReader();
      reader.onload = function(e) {
        const content = e.target.result;
        // Create a simple hash using file name, size, and first 100 characters
        const simpleHash = btoa(file.name + file.size + content.slice(0, 100)).slice(0, 50); // Limit to 50 characters
        setFormData(prev => ({
          ...prev,
          [field]: file,
          documentHash: simpleHash,
          documentFileName: file.name
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: file
      }));
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.firstName && formData.lastName && formData.phone && 
               formData.email && formData.dateOfBirth && formData.gender;
      case 2:
        return formData.idNumber && formData.idType; // Simplified - removed document verification requirements
        // && formData.idDocument &&
        // formData.documentFirstName && formData.documentLastName && 
        // formData.documentIdNumber && formData.documentDateOfBirth && formData.documentGender;
      case 3:
        return formData.county && formData.subCounty && formData.ward && formData.village;
      case 4:
        return formData.employmentStatus && formData.monthlyIncome;
      // case 5: // KYC STEP COMMENTED OUT
      //   return formData.biometricConsent;
      case 5: // FINAL CONSENT (was step 6)
        return formData.biometricConsent; // Using biometricConsent for final consent
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      // KYC step check commented out - skip directly to final step
      // if (currentStep === 5 && !formData.kycCompleted) {
      //   // Don't advance to step 6 until KYC is completed
      //   alert('Please complete the KYC biometric verification before proceeding.');
      //   return;
      // }
      setCurrentStep(prev => Math.min(prev + 1, 5)); // Changed from 6 to 5
    } else {
      alert('Please fill in all required fields before proceeding.');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // MOBILE KYC HANDLERS - COMMENTED OUT TEMPORARILY
  // const handleKycSuccess = (result) => {
  //   console.log('Mobile KYC Success:', result);
  //   setFormData(prev => ({ 
  //     ...prev, 
  //     kycCompleted: true, 
  //     customerId: result.sessionId || 'KYC_' + Date.now() 
  //   }));
  //   setShowMobileKyc(false);
  //   alert('✅ Mobile KYC verification completed successfully!\n' + result.message);
  // };

  // const handleKycError = (error) => {
  //   console.error('Mobile KYC Error:', error);
  //   setShowMobileKyc(false);
  //   alert('❌ Mobile KYC Verification Failed:\n' + error);
  // };

  // const handleKycCancel = () => {
  //   setShowMobileKyc(false);
  // };

  const handleSubmit = async () => {
    if (!validateStep(5)) { // Changed from 6 to 5
      alert('Please complete all required fields.'); // Removed KYC verification requirement
      return;
    }

    setIsSubmitting(true);
    try {
      // First, verify phone number is not in use
      const phoneCheckResponse = await fetch('/api/onboarding/check-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: formData.phone })
      });

      if (!phoneCheckResponse.ok) {
        let errorData;
        const text = await phoneCheckResponse.text();
        try {
          errorData = text ? JSON.parse(text) : { error: 'UNKNOWN_ERROR' };
        } catch (e) {
          errorData = { error: 'PARSE_ERROR', message: 'Invalid response format' };
        }
        
        if (errorData.error === 'PHONE_IN_USE') {
          alert('❌ This phone number is already registered with another account. Please use a different number.');
          setIsSubmitting(false);
          return;
        }
      }

      // Submit application with proper field mapping and document verification
      const response = await fetch('/api/onboarding/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          email: formData.email,
          nationalId: formData.idNumber, // Map idNumber to nationalId
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          address: `${formData.village}, ${formData.ward}, ${formData.subCounty}, ${formData.county}`, // Combine address fields
          occupation: formData.employer || formData.employmentStatus,
          monthlyIncome: parseFloat(formData.monthlyIncome) || 0,
          maritalStatus: 'single', // Default value
          digitalLiteracyLevel: 3, // Default value
          preferredLanguage: 'english', // Default value
          voiceAssistanceEnabled: false, // Default value
          
          // Basic ID type (REQUIRED FIELD)
          idType: formData.idType || 'national_id' // Default to national_id if not set
          
          // CRITICAL: Document verification data (TEMPORARILY COMMENTED OUT)
          // idType: formData.idType,
          // documentFileName: formData.documentFileName,
          // documentHash: formData.documentHash,
          // documentFirstName: formData.documentFirstName,
          // documentLastName: formData.documentLastName,
          // documentIdNumber: formData.documentIdNumber,
          // documentDateOfBirth: formData.documentDateOfBirth,
          // documentGender: formData.documentGender
        })
      });

      if (response.ok) {
        let result;
        const text = await response.text();
        try {
          result = text ? JSON.parse(text) : { applicationId: 'APP-' + Date.now(), message: 'Application submitted successfully!' };
        } catch (e) {
          result = { applicationId: 'APP-' + Date.now(), message: 'Application submitted successfully!' };
        }
        
        onSuccess({
          applicationId: result.customerCode || result.applicationId,
          message: result.message || 'Application submitted successfully! You will receive an email confirmation and SMS verification code shortly.'
        });
      } else {
        let errorData;
        const text = await response.text();
        try {
          errorData = text ? JSON.parse(text) : { message: 'Application submission failed' };
        } catch (e) {
          errorData = { message: 'Application submission failed' };
        }
        throw new Error(errorData.message || 'Application submission failed');
      }
    } catch (error) {
      console.error('Application submission error:', error);
      alert('❌ ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h3 style={{ marginBottom: '30px', color: '#2e7d32', fontSize: '1.5rem' }}>
              👤 Personal Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  style={{
                    ...inputStyle,
                    borderColor: validationErrors.firstName ? '#f44336' : '#e0e0e0'
                  }}
                  required
                />
                {validationErrors.firstName && (
                  <p style={{ fontSize: '0.9rem', color: '#f44336', marginTop: '5px' }}>
                    {validationErrors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  style={{
                    ...inputStyle,
                    borderColor: validationErrors.lastName ? '#f44336' : '#e0e0e0'
                  }}
                  required
                />
                {validationErrors.lastName && (
                  <p style={{ fontSize: '0.9rem', color: '#f44336', marginTop: '5px' }}>
                    {validationErrors.lastName}
                  </p>
                )}
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+254712345678 or 0712345678"
                  style={{
                    ...inputStyle,
                    borderColor: validationErrors.phone ? '#f44336' : 
                                phoneCheckStatus === 'available' ? '#4caf50' :
                                phoneCheckStatus === 'unavailable' ? '#f44336' : '#e0e0e0'
                  }}
                  required
                />
                {phoneCheckStatus === 'checking' && (
                  <p style={{ fontSize: '0.9rem', color: '#2196f3', marginTop: '5px' }}>
                    🔄 Checking availability...
                  </p>
                )}
                {phoneCheckStatus === 'available' && (
                  <p style={{ fontSize: '0.9rem', color: '#4caf50', marginTop: '5px' }}>
                    ✅ Phone number is available
                  </p>
                )}
                {phoneCheckStatus === 'unavailable' && (
                  <p style={{ fontSize: '0.9rem', color: '#f44336', marginTop: '5px' }}>
                    ❌ This phone number is already registered
                  </p>
                )}
                {validationErrors.phone && (
                  <p style={{ fontSize: '0.9rem', color: '#f44336', marginTop: '5px' }}>
                    {validationErrors.phone}
                  </p>
                )}
                <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
                  📱 Each phone number can only be used for one account
                </p>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Date of Birth *
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Gender *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  style={inputStyle}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h3 style={{ marginBottom: '30px', color: '#2e7d32', fontSize: '1.5rem' }}>
              🆔 Identity Verification
            </h3>
            <div style={{ marginBottom: '30px', padding: '20px', background: '#fff3cd', borderRadius: '8px', border: '1px solid #ffeaa7' }}>
              <p style={{ margin: 0, color: '#856404' }}>
                <strong>⚠️ CRITICAL REQUIREMENT:</strong> Your ID details must EXACTLY match the uploaded document. 
                Any discrepancies will result in automatic application rejection. Double-check all information before proceeding.
              </p>
            </div>
            <div style={{ marginBottom: '30px', padding: '20px', background: '#f8d7da', borderRadius: '8px', border: '1px solid #f5c6cb' }}>
              <p style={{ margin: 0, color: '#721c24', fontWeight: 'bold' }}>
                🔒 DOCUMENT VERIFICATION REQUIRED: You must manually enter the EXACT details from your ID document below. 
                Our system will cross-verify these details with your personal information to prevent fraud.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  ID Type *
                </label>
                <select
                  value={formData.idType}
                  onChange={(e) => handleInputChange('idType', e.target.value)}
                  style={inputStyle}
                  required
                >
                  <option value="national_id">National ID</option>
                  <option value="passport">Passport</option>
                  <option value="alien_id">Alien ID</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  ID Number *
                </label>
                <input
                  type="text"
                  value={formData.idNumber}
                  onChange={(e) => handleInputChange('idNumber', e.target.value)}
                  placeholder="Enter EXACTLY as shown on your ID document"
                  style={inputStyle}
                  required
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Upload ID Document *
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileUpload('idDocument', e.target.files[0])}
                  style={{
                    ...inputStyle,
                    padding: '12px',
                    cursor: 'pointer'
                  }}
                  required
                />
                <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '8px' }}>
                  Upload a clear, high-quality photo or scan of your ID document. Both sides required for National ID.
                </p>
              </div>
            </div>
            
            {/* Document Verification Section */}
            <div style={{ marginTop: '40px', padding: '25px', background: '#f8f9fa', borderRadius: '12px', border: '2px solid #dc3545' }}>
              <h4 style={{ color: '#dc3545', marginBottom: '20px', fontSize: '1.3rem' }}>
                🔍 MANDATORY: Enter Details EXACTLY as shown on your uploaded document
              </h4>
              <p style={{ color: '#721c24', marginBottom: '20px', fontSize: '0.95rem' }}>
                <strong>WARNING:</strong> These details will be automatically cross-verified with your personal information above. 
                Any mismatch will result in immediate application rejection.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#dc3545' }}>
                    First Name (From Document) *
                  </label>
                  <input
                    type="text"
                    value={formData.documentFirstName || ''}
                    onChange={(e) => handleInputChange('documentFirstName', e.target.value)}
                    placeholder="Enter EXACTLY as shown on document"
                    style={{
                      ...inputStyle,
                      borderColor: '#dc3545',
                      backgroundColor: '#fff5f5'
                    }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#dc3545' }}>
                    Last Name (From Document) *
                  </label>
                  <input
                    type="text"
                    value={formData.documentLastName || ''}
                    onChange={(e) => handleInputChange('documentLastName', e.target.value)}
                    placeholder="Enter EXACTLY as shown on document"
                    style={{
                      ...inputStyle,
                      borderColor: '#dc3545',
                      backgroundColor: '#fff5f5'
                    }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#dc3545' }}>
                    ID Number (From Document) *
                  </label>
                  <input
                    type="text"
                    value={formData.documentIdNumber || ''}
                    onChange={(e) => handleInputChange('documentIdNumber', e.target.value)}
                    placeholder="Enter EXACTLY as shown on document"
                    style={{
                      ...inputStyle,
                      borderColor: '#dc3545',
                      backgroundColor: '#fff5f5'
                    }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#dc3545' }}>
                    Date of Birth (From Document) *
                  </label>
                  <input
                    type="date"
                    value={formData.documentDateOfBirth || ''}
                    onChange={(e) => handleInputChange('documentDateOfBirth', e.target.value)}
                    style={{
                      ...inputStyle,
                      borderColor: '#dc3545',
                      backgroundColor: '#fff5f5'
                    }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#dc3545' }}>
                    Gender (From Document) *
                  </label>
                  <select
                    value={formData.documentGender || ''}
                    onChange={(e) => handleInputChange('documentGender', e.target.value)}
                    style={{
                      ...inputStyle,
                      borderColor: '#dc3545',
                      backgroundColor: '#fff5f5'
                    }}
                    required
                  >
                    <option value="">Select as shown on document</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
              
              <div style={{ marginTop: '20px', padding: '15px', background: '#d1ecf1', borderRadius: '8px', border: '1px solid #bee5eb' }}>
                <p style={{ margin: 0, color: '#0c5460', fontSize: '0.9rem' }}>
                  💡 <strong>Tip:</strong> Double-check each field against your physical document before proceeding. 
                  Our system will automatically detect any inconsistencies.
                </p>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <h3 style={{ marginBottom: '30px', color: '#2e7d32', fontSize: '1.5rem' }}>
              🏠 Address Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  County *
                </label>
                <input
                  type="text"
                  value={formData.county}
                  onChange={(e) => handleInputChange('county', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Sub-County *
                </label>
                <input
                  type="text"
                  value={formData.subCounty}
                  onChange={(e) => handleInputChange('subCounty', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Ward *
                </label>
                <input
                  type="text"
                  value={formData.ward}
                  onChange={(e) => handleInputChange('ward', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Village/Estate *
                </label>
                <input
                  type="text"
                  value={formData.village}
                  onChange={(e) => handleInputChange('village', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div>
            <h3 style={{ marginBottom: '30px', color: '#2e7d32', fontSize: '1.5rem' }}>
              💼 Employment Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Employment Status *
                </label>
                <select
                  value={formData.employmentStatus}
                  onChange={(e) => handleInputChange('employmentStatus', e.target.value)}
                  style={inputStyle}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="employed">Employed</option>
                  <option value="self_employed">Self Employed</option>
                  <option value="business_owner">Business Owner</option>
                  <option value="unemployed">Unemployed</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Employer/Business Name
                </label>
                <input
                  type="text"
                  value={formData.employer}
                  onChange={(e) => handleInputChange('employer', e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Monthly Income (KES) *
                </label>
                <input
                  type="number"
                  value={formData.monthlyIncome}
                  onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
                  placeholder="50000"
                  style={inputStyle}
                  required
                />
              </div>
            </div>
          </div>
        );

      // case 5: // KYC BIOMETRIC STEP - COMMENTED OUT TEMPORARILY
      //   return (
      //     <div>
      //       <h3 style={{ marginBottom: '30px', color: '#2e7d32', fontSize: '1.5rem' }}>
      //         🔒 KYC Biometric Verification
      //       </h3>
      //       ... KYC content commented out ...
      //     </div>
      //   );

      case 5: // FINAL CONSENT (was case 6)
        return (
          <div>
            <h3 style={{ marginBottom: '30px', color: '#2e7d32', fontSize: '1.5rem' }}>
              ✅ Final Consent & Submission
            </h3>
            <div style={{ marginBottom: '30px', padding: '20px', background: '#e8f5e9', borderRadius: '8px', border: '1px solid #4caf50' }}>
              <h4 style={{ color: '#2e7d32', marginBottom: '15px' }}>🔒 Security Protocol</h4>
              <p style={{ margin: 0, color: '#2e7d32', lineHeight: '1.6' }}>
                Your application will be reviewed by our admin team. Upon approval, you will receive:
                <br/>• Email confirmation with application status
                <br/>• SMS with your secure login PIN
                <br/>• Access to customer portal for loan applications
                <br/>• KYC verification will be completed during first login (if required)
              </p>
            </div>
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📋</div>
              <p style={{ fontSize: '1.1rem', marginBottom: '30px', color: '#666' }}>
                All required steps completed. Ready to submit your application for admin review.
                {/* KYC verification will be handled separately if needed. */}
              </p>
              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.biometricConsent}
                    onChange={(e) => handleInputChange('biometricConsent', e.target.checked)}
                    style={{ marginRight: '10px', transform: 'scale(1.3)' }}
                    required
                  />
                  <span style={{ fontSize: '1.1rem' }}>
                    I consent to data processing and admin review process *
                    {/* Biometric verification consent removed temporarily */}
                  </span>
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '16px',
    boxSizing: 'border-box'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        maxWidth: '900px',
        width: '100%',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
          color: 'white',
          padding: '30px',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
            🏦 Enhanced Customer Registration
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, margin: 0 }}>
            Complete all steps for secure loan application with admin approval
          </p>
        </div>

        {/* Progress Steps */}
        <div style={{
          padding: '30px',
          borderBottom: '1px solid #e0e0e0',
          background: '#f8f9fa'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            {steps.map((step) => (
              <div
                key={step.number}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flex: '1',
                  minWidth: '120px'
                }}
              >
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: currentStep >= step.number ? '#4caf50' : '#e0e0e0',
                  color: currentStep >= step.number ? 'white' : '#666',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  marginBottom: '8px',
                  transition: 'all 0.3s ease'
                }}>
                  {currentStep > step.number ? '✓' : step.icon}
                </div>
                <span style={{
                  fontSize: '0.9rem',
                  textAlign: 'center',
                  color: currentStep >= step.number ? '#2e7d32' : '#666',
                  fontWeight: currentStep === step.number ? 'bold' : 'normal'
                }}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div style={{ padding: '40px' }}>
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div style={{
          padding: '30px',
          borderTop: '1px solid #e0e0e0',
          background: '#f8f9fa',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <div>
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                style={{
                  padding: '12px 24px',
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                ← Previous
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ color: '#666', fontSize: '0.9rem' }}>
              Step {currentStep} of {steps.length}
            </span>
            
            {currentStep < steps.length ? (
              <button
                onClick={nextStep}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{
                  padding: '15px 30px',
                  background: isSubmitting ? '#ccc' : 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer'
                }}
              >
                {isSubmitting ? '⏳ Submitting...' : '🚀 Submit for Admin Review'}
              </button>
            )}
          </div>
        </div>

        {/* Back to Home */}
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              color: '#666',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '0.9rem'
            }}
          >
            ← Back to Home
          </button>
        </div>
      </div>

      {/* MOBILE KYC QR CODE MODAL - COMMENTED OUT TEMPORARILY */}
      {/* {showMobileKyc && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            maxWidth: '100vw',
            maxHeight: '100vh'
          }}>
            <MobileKycQrCode
              customerData={formData}
              onSuccess={handleKycSuccess}
              onError={handleKycError}
              onCancel={handleKycCancel}
            />
          </div>
        </div>
      )} */}
    </div>
  );
};

// Application Status Component
const ApplicationStatus = ({ applicationData, onBack }) => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        padding: '50px 40px',
        borderRadius: '20px',
        maxWidth: '600px',
        width: '100%',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '20px' }}>🎉</h1>
        <h2 style={{ marginBottom: '20px', fontSize: '2rem' }}>Application Submitted Successfully!</h2>
        <p style={{ fontSize: '1.3rem', marginBottom: '30px', lineHeight: '1.6' }}>
          {applicationData.message}
        </p>
        
        <div style={{ 
          background: 'rgba(255,255,255,0.1)', 
          padding: '25px', 
          borderRadius: '12px', 
          marginBottom: '30px',
          textAlign: 'left'
        }}>
          <h3 style={{ marginBottom: '15px', color: '#fff' }}>📋 What Happens Next:</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '10px' }}>✅ <strong>Email Confirmation:</strong> Sent to your registered email</li>
            <li style={{ marginBottom: '10px' }}>👨‍💼 <strong>Admin Review:</strong> 1-3 business days</li>
            <li style={{ marginBottom: '10px' }}>📱 <strong>SMS PIN:</strong> Sent upon approval</li>
            {/* <li style={{ marginBottom: '10px' }}>🔐 <strong>Biometric Setup:</strong> During first login</li> */}
            <li style={{ marginBottom: '10px' }}>🔐 <strong>Account Setup:</strong> Complete during first login</li>
          </ul>
        </div>

        <div style={{ 
          background: 'rgba(255,255,255,0.1)', 
          padding: '20px', 
          borderRadius: '12px', 
          marginBottom: '30px' 
        }}>
          <p style={{ margin: 0, fontSize: '1.1rem' }}>
            <strong>Application ID:</strong> {applicationData.applicationId}
          </p>
          <p style={{ margin: '10px 0 0 0', fontSize: '0.9rem', opacity: 0.8 }}>
            Keep this ID for reference
          </p>
        </div>

        <button
          onClick={onBack}
          style={{
            padding: '15px 30px',
            background: 'white',
            color: '#2e7d32',
            border: 'none',
            borderRadius: '10px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}
        >
          🏠 Back to Home
        </button>
      </div>
    </div>
  );
};

// Router Component
function AppRouter() {
  const [currentRoute, setCurrentRoute] = useState(window.location.pathname);
  const [applicationData, setApplicationData] = useState(null);

  // Listen for route changes
  window.addEventListener('popstate', () => {
    setCurrentRoute(window.location.pathname);
  });

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentRoute(path);
  };

  const handleRegistrationSuccess = (data) => {
    setApplicationData(data);
    navigate('/status');
  };

  // Route handling
  switch (currentRoute) {
    case '/admin':
      return <AdminLogin navigate={navigate} />;
    
    case '/admin/dashboard':
      return <AdminDashboard navigate={navigate} />;
    
    case '/customer':
      return <CustomerDashboard />;
    
    case '/register':
      return <Registration onBack={() => navigate('/')} onSuccess={handleRegistrationSuccess} />;
    
    case '/status':
      return <ApplicationStatus applicationData={applicationData} onBack={() => navigate('/')} />;
    
    default:
      // MOBILE KYC ROUTE - COMMENTED OUT TEMPORARILY
      // Check for mobile KYC route pattern
      // if (currentRoute.startsWith('/mobile-kyc/')) {
      //   return <MobileKycVerification />;
      // }
      
      return <LandingPage navigate={navigate} />;
  }
}

export default AppRouter;