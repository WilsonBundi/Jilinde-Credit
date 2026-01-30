import { useState } from 'react';

const AdminLogin = ({ navigate }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simple admin authentication (in production, use proper JWT)
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      // Set admin session
      localStorage.setItem('adminAuthenticated', 'true');
      localStorage.setItem('adminLoginTime', Date.now().toString());
      navigate('/admin/dashboard');
    } else {
      setError('Invalid admin credentials');
    }
    
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '40px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '30px'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
            borderRadius: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            marginRight: '15px'
          }}>
            🛡️
          </div>
          <div>
            <h2 style={{ 
              margin: 0, 
              color: 'white', 
              fontSize: '1.8rem',
              fontWeight: 'bold'
            }}>
              Admin Access
            </h2>
            <p style={{ 
              margin: 0, 
              color: 'rgba(255, 255, 255, 0.8)', 
              fontSize: '0.9rem' 
            }}>
              Jilinde Credit Limited
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label style={{ 
              display: 'block', 
              color: 'white', 
              marginBottom: '8px',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}>
              Username
            </label>
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '1rem',
                backdropFilter: 'blur(10px)',
                boxSizing: 'border-box'
              }}
              placeholder="Enter admin username"
            />
          </div>

          <div style={{ marginBottom: '25px', textAlign: 'left' }}>
            <label style={{ 
              display: 'block', 
              color: 'white', 
              marginBottom: '8px',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '1rem',
                backdropFilter: 'blur(10px)',
                boxSizing: 'border-box'
              }}
              placeholder="Enter admin password"
            />
          </div>

          {error && (
            <div style={{
              background: 'rgba(244, 67, 54, 0.2)',
              border: '1px solid rgba(244, 67, 54, 0.5)',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '20px',
              color: 'white',
              fontSize: '0.9rem'
            }}>
              ❌ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px',
              background: loading 
                ? 'rgba(255, 255, 255, 0.2)' 
                : 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 8px 25px rgba(76, 175, 80, 0.3)',
              transition: 'all 0.3s ease',
              marginBottom: '20px'
            }}
          >
            {loading ? '🔄 Authenticating...' : '🔐 Login to Admin Panel'}
          </button>
        </form>

        {/* Back to Home */}
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'rgba(255, 255, 255, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            padding: '10px 20px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease'
          }}
        >
          ← Back to Home
        </button>

        {/* Demo Credentials */}
        <div style={{
          marginTop: '30px',
          padding: '15px',
          background: 'rgba(255, 193, 7, 0.2)',
          border: '1px solid rgba(255, 193, 7, 0.3)',
          borderRadius: '8px',
          fontSize: '0.8rem',
          color: 'rgba(255, 255, 255, 0.9)'
        }}>
          <strong>Demo Credentials:</strong><br/>
          Username: admin<br/>
          Password: admin123
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;