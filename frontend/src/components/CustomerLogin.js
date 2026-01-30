import { useState } from 'react';

const CustomerLogin = ({ onBack, onLoginSuccess }) => {
  const [loginData, setLoginData] = useState({
    phone: '',
    pin: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    setLoginData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/customer/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
      });

      if (response.ok) {
        let result;
        const text = await response.text();
        try {
          result = text ? JSON.parse(text) : null;
        } catch (e) {
          result = null;
        }
        
        if (result) {
          onLoginSuccess(result);
        } else {
          throw new Error('Invalid response from server');
        }
      } else {
        let errorData;
        const text = await response.text();
        try {
          errorData = text ? JSON.parse(text) : { message: 'Invalid phone number or PIN' };
        } catch (e) {
          errorData = { message: 'Invalid phone number or PIN' };
        }
        throw new Error(errorData.message || 'Invalid phone number or PIN');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Invalid phone number or PIN. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
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
        maxWidth: '500px',
        width: '100%',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
          color: 'white',
          padding: '40px',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
            👤 Customer Login
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, margin: 0 }}>
            Enter your phone number and PIN to access your account
          </p>
        </div>

        {/* Login Form */}
        <div style={{ padding: '40px' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                Phone Number *
              </label>
              <input
                type="tel"
                value={loginData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+254712345678"
                style={{
                  width: '100%',
                  padding: '15px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                PIN *
              </label>
              <input
                type="password"
                value={loginData.pin}
                onChange={(e) => handleInputChange('pin', e.target.value)}
                placeholder="Enter your 4-digit PIN"
                maxLength="4"
                style={{
                  width: '100%',
                  padding: '15px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  letterSpacing: '2px'
                }}
                required
              />
            </div>

            {error && (
              <div style={{
                marginBottom: '20px',
                padding: '15px',
                background: '#ffebee',
                border: '1px solid #ffcdd2',
                borderRadius: '8px',
                color: '#c62828'
              }}>
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '15px',
                background: isLoading ? '#ccc' : 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                marginBottom: '20px'
              }}
            >
              {isLoading ? '⏳ Logging in...' : '🔐 Login to Account'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div style={{
            padding: '20px',
            background: '#f8f9fa',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>📱 Need Help?</h4>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
              Your PIN is sent via SMS after your application is approved by our admin team. 
              If you haven't received it, please contact support at +254719696631.
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
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
      </div>
    </div>
  );
};

export default CustomerLogin;