import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import {
  AccountBalance,
  Person,
  AdminPanelSettings,
  TrendingUp,
  Security,
  Speed,
  Support,
} from '@mui/icons-material';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Speed />,
      title: 'Quick Loans',
      description: 'Get approved for loans in minutes, not days',
    },
    {
      icon: <Security />,
      title: 'Secure Platform',
      description: 'Bank-level security with advanced encryption',
    },
    {
      icon: <TrendingUp />,
      title: 'Build Credit',
      description: 'Improve your credit score with timely payments',
    },
    {
      icon: <Support />,
      title: '24/7 Support',
      description: 'Get help whenever you need it',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
          color: 'white',
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    mb: 3,
                    mx: { xs: 'auto', md: 0 },
                  }}
                >
                  <AccountBalance sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h2" fontWeight="bold" gutterBottom>
                  Jilinde Credit
                </Typography>
                <Typography variant="h5" sx={{ mb: 3, opacity: 0.9 }}>
                  Your trusted microfinance partner in Kenya
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, opacity: 0.8 }}>
                  Access quick loans, build your credit score, and grow your business with our digital microfinance platform.
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/customer-login')}
                    sx={{
                      bgcolor: '#ffffff',
                      color: '#2e7d32',
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      '&:hover': {
                        bgcolor: '#f5f5f5',
                      },
                      px: 4,
                      py: 1.5,
                    }}
                    startIcon={<Person />}
                  >
                    Customer Login
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/onboarding')}
                    sx={{
                      borderColor: '#ffffff',
                      borderWidth: 2,
                      color: '#ffffff',
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      '&:hover': {
                        borderColor: '#ffffff',
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                      },
                      px: 4,
                      py: 1.5,
                    }}
                  >
                    New Customer? Register
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Card
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'white',
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      Quick Stats
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="h4" fontWeight="bold">
                          10K+
                        </Typography>
                        <Typography variant="body2">
                          Happy Customers
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h4" fontWeight="bold">
                          KES 2B+
                        </Typography>
                        <Typography variant="body2">
                          Loans Disbursed
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h4" fontWeight="bold">
                          95%
                        </Typography>
                        <Typography variant="body2">
                          Approval Rate
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h4" fontWeight="bold">
                          24hrs
                        </Typography>
                        <Typography variant="body2">
                          Average Processing
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" textAlign="center" fontWeight="bold" gutterBottom>
          Why Choose Jilinde Credit?
        </Typography>
        <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
          We make microfinance simple, secure, and accessible for everyone
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Avatar
                    sx={{
                      bgcolor: 'primary.100',
                      color: 'primary.600',
                      width: 64,
                      height: 64,
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    {feature.icon}
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Ready to Get Started?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Join thousands of Kenyans who trust Jilinde Credit for their financial needs
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/onboarding')}
              sx={{ 
                px: 4, 
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
              }}
            >
              Apply for Loan
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/customer-login')}
              sx={{ 
                px: 4, 
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
              }}
            >
              Existing Customer
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Staff Access */}
      <Box sx={{ py: 4, bgcolor: '#f1f8e9' }}>
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <Typography variant="h6" color="text.primary" gutterBottom fontWeight="bold">
            Are you a Jilinde Credit staff member?
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/login')}
            startIcon={<AdminPanelSettings />}
            sx={{
              mt: 2,
              px: 3,
              py: 1,
              fontSize: '1rem',
              fontWeight: 'bold',
            }}
          >
            Access Staff Portal
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;