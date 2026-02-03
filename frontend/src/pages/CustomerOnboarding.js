import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
} from '@mui/material';

const steps = [
  'Personal Information',
  'Contact Details',
  'Employment Information',
  'Review & Submit'
];

const CustomerOnboarding = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    idNumber: '',
    employer: '',
    monthlyIncome: '',
    loanAmount: '',
    loanPurpose: ''
  });

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to success page
      navigate('/customer-portal', { 
        state: { 
          message: 'Registration successful! Your application is being reviewed.',
          customerData: formData
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={handleInputChange('firstName')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={handleInputChange('lastName')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="ID Number"
                value={formData.idNumber}
                onChange={handleInputChange('idNumber')}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Phone Number"
                value={formData.phone}
                onChange={handleInputChange('phone')}
                placeholder="+254712345678"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                type="email"
                label="Email Address"
                value={formData.email}
                onChange={handleInputChange('email')}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Employer"
                value={formData.employer}
                onChange={handleInputChange('employer')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="number"
                label="Monthly Income (KES)"
                value={formData.monthlyIncome}
                onChange={handleInputChange('monthlyIncome')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="number"
                label="Loan Amount Requested (KES)"
                value={formData.loanAmount}
                onChange={handleInputChange('loanAmount')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={3}
                label="Loan Purpose"
                value={formData.loanPurpose}
                onChange={handleInputChange('loanPurpose')}
              />
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Your Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography><strong>Name:</strong> {formData.firstName} {formData.lastName}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography><strong>ID Number:</strong> {formData.idNumber}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography><strong>Phone:</strong> {formData.phone}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography><strong>Email:</strong> {formData.email}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography><strong>Employer:</strong> {formData.employer}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography><strong>Monthly Income:</strong> KES {formData.monthlyIncome}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography><strong>Loan Amount:</strong> KES {formData.loanAmount}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography><strong>Loan Purpose:</strong> {formData.loanPurpose}</Typography>
              </Grid>
            </Grid>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Customer Registration
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
            Complete your registration to apply for a loan
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ mb: 4 }}>
            {renderStepContent(activeStep)}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </Button>
            ) : (
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            )}
          </Box>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button onClick={() => navigate('/')} color="inherit">
              ← Back to Home
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default CustomerOnboarding;