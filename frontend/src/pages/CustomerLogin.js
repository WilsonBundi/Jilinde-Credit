import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Avatar,
  Tabs,
  Tab,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  AccountBalance,
  Phone,
  Lock,
  Person,
  Visibility,
  VisibilityOff,
  AdminPanelSettings
} from '@mui/icons-material';

function CustomerLogin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [showPin, setShowPin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Customer login form
  const [customerForm, setCustomerForm] = useState({
    phone: '',
    pin: ''
  });
  const [customerError, setCustomerError] = useState('');
  const [customerLoading, setCustomerLoading] = useState(false);

  // Staff login form
  const [staffForm, setStaffForm] = useState({
    username: '',
    password: ''
  });
  const [staffError, setStaffError] = useState('');
  const [staffLoading, setStaffLoading] = useState(false);

  const handleCustomerLogin = async (e) => {
    e.preventDefault();
    setCustomerLoading(true);
    setCustomerError('');

    if (!customerForm.phone || !customerForm.pin) {
      setCustomerError('Please enter both phone number and PIN.');
      setCustomerLoading(false);
      return;
    }

    try {
      const response = await authService.login({
        phone: customerForm.phone,
        pin: customerForm.pin,
        userType: 'customer'
      });
      
      if (response.data.token && response.data.customer) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('customerData', JSON.stringify(response.data.customer));
        localStorage.setItem('userType', 'customer');
        navigate('/customer-portal');
      } else {
        setCustomerError('Invalid response from server. Please try again.');
      }
    } catch (error) {
      console.error('Customer login error:', error);
      setCustomerError(
        error.response?.data?.message || 
        'Invalid phone number or PIN. Please check your credentials.'
      );
    } finally {
      setCustomerLoading(false);
    }
  };

  const handleStaffLogin = async (e) => {
    e.preventDefault();
    setStaffLoading(true);
    setStaffError('');

    if (!staffForm.username || !staffForm.password) {
      setStaffError('Please enter both username and password.');
      setStaffLoading(false);
      return;
    }

    try {
      const response = await authService.login({
        username: staffForm.username,
        password: staffForm.password,
        userType: 'staff'
      });
      
      if (response.data.token && response.data.user) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('userType', 'staff');
        navigate('/dashboard');
      } else {
        setStaffError('Invalid response from server. Please try again.');
      }
    } catch (error) {
      console.error('Staff login error:', error);
      setStaffError(
        error.response?.data?.message || 
        'Invalid username or password. Please check your credentials.'
      );
    } finally {
      setStaffLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4
    }}>
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Avatar sx={{ 
            mx: 'auto', 
            mb: 2, 
            bgcolor: 'rgba(255, 255, 255, 0.2)', 
            width: 64, 
            height: 64 
          }}>
            <AccountBalance sx={{ fontSize: 32, color: 'white' }} />
          </Avatar>
          <Typography variant="h4" fontWeight="bold" color="white" gutterBottom>
            Jilinde Credit
          </Typography>
          <Typography variant="body1" color="rgba(255, 255, 255, 0.8)">
            Access your account
          </Typography>
        </Box>

        <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={activeTab} 
              onChange={(e, newValue) => setActiveTab(newValue)}
              variant="fullWidth"
            >
              <Tab 
                icon={<Person />} 
                label="Customer Login" 
                iconPosition="start"
              />
              <Tab 
                icon={<AdminPanelSettings />} 
                label="Staff Login" 
                iconPosition="start"
              />
            </Tabs>
          </Box>

          <CardContent sx={{ p: 4 }}>
            {activeTab === 0 ? (
              // Customer Login Form
              <Box>
                <Typography variant="h6" gutterBottom textAlign="center">
                  Customer Portal Access
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
                  Enter your registered phone number and PIN
                </Typography>

                {customerError && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {customerError}
                  </Alert>
                )}

                <form onSubmit={handleCustomerLogin}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    placeholder="+254712345678"
                    value={customerForm.phone}
                    onChange={(e) => setCustomerForm(prev => ({ ...prev, phone: e.target.value }))}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 3 }}
                    required
                  />

                  <TextField
                    fullWidth
                    label="PIN"
                    type={showPin ? 'text' : 'password'}
                    value={customerForm.pin}
                    onChange={(e) => setCustomerForm(prev => ({ ...prev, pin: e.target.value }))}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPin(!showPin)}
                            edge="end"
                          >
                            {showPin ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 3 }}
                    required
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={customerLoading}
                    sx={{ mb: 2, py: 1.5 }}
                  >
                    {customerLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>

                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Don't have an account?{' '}
                    <Button 
                      variant="text" 
                      onClick={() => navigate('/onboarding')}
                      sx={{ textTransform: 'none' }}
                    >
                      Register Here
                    </Button>
                  </Typography>
                </Box>

                <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    <strong>Need Help?</strong><br />
                    • Check your application status<br />
                    • Your PIN is sent via SMS after approval<br />
                    • Contact support: +254719696631
                  </Typography>
                </Box>
              </Box>
            ) : (
              // Staff Login Form
              <Box>
                <Typography variant="h6" gutterBottom textAlign="center">
                  Staff Portal Access
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
                  Enter your staff credentials
                </Typography>

                {staffError && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {staffError}
                  </Alert>
                )}

                <form onSubmit={handleStaffLogin}>
                  <TextField
                    fullWidth
                    label="Username"
                    value={staffForm.username}
                    onChange={(e) => setStaffForm(prev => ({ ...prev, username: e.target.value }))}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 3 }}
                    required
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={staffForm.password}
                    onChange={(e) => setStaffForm(prev => ({ ...prev, password: e.target.value }))}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 3 }}
                    required
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={staffLoading}
                    sx={{ mb: 2, py: 1.5 }}
                  >
                    {staffLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>

                <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    <strong>Staff Access Only</strong><br />
                    Contact your system administrator for login credentials.
                  </Typography>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Button
            variant="text"
            onClick={() => navigate('/')}
            sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
          >
            ← Back to Home
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default CustomerLogin;