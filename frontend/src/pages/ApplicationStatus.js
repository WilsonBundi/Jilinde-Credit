import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Card,
  Typography,
  Button,
  Avatar
} from '@mui/material';
import { CheckCircle, Home } from '@mui/icons-material';

function ApplicationStatus() {
  const navigate = useNavigate();

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Container maxWidth="sm">
        <Card sx={{ borderRadius: 3, textAlign: 'center', p: 4 }}>
          <Avatar sx={{ 
            mx: 'auto', 
            mb: 2, 
            bgcolor: 'success.main', 
            width: 64, 
            height: 64 
          }}>
            <CheckCircle sx={{ fontSize: 32, color: 'white' }} />
          </Avatar>
          
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Application Submitted!
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Your registration has been submitted successfully. Our team will review your application and contact you within 1-3 business days.
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            You will receive an SMS with your login PIN once your application is approved.
          </Typography>

          <Button
            variant="contained"
            startIcon={<Home />}
            onClick={() => navigate('/')}
            size="large"
          >
            Back to Home
          </Button>
        </Card>
      </Container>
    </Box>
  );
}

export default ApplicationStatus;