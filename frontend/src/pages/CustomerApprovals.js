import { useState, useEffect } from 'react';
import { customerService } from '../services/apiService';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';
import { CheckCircle, Cancel, Visibility, Person } from '@mui/icons-material';

function CustomerApprovals() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPendingApplications();
  }, []);

  const fetchPendingApplications = async () => {
    try {
      setLoading(true);
      setError('');
      // Fetch customers with PENDING status
      const response = await customerService.getAll({ status: 'PENDING' });
      setApplications(response.data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError('Failed to load pending applications. Please try again.');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewApplication = (application) => {
    setSelectedApplication(application);
    setDialogOpen(true);
  };

  const handleApproveApplication = async (applicationId) => {
    setApprovalLoading(true);
    try {
      // Call backend API to approve customer
      await customerService.approve(applicationId);
      
      // Refresh the applications list
      await fetchPendingApplications();
      
      setDialogOpen(false);
      setSelectedApplication(null);
    } catch (error) {
      console.error('Error approving application:', error);
      setError('Failed to approve application. Please try again.');
    } finally {
      setApprovalLoading(false);
    }
  };

  const handleRejectApplication = async (applicationId) => {
    setApprovalLoading(true);
    try {
      // Call backend API to reject customer
      await customerService.reject(applicationId);
      
      // Refresh the applications list
      await fetchPendingApplications();
      
      setDialogOpen(false);
      setSelectedApplication(null);
    } catch (error) {
      console.error('Error rejecting application:', error);
      setError('Failed to reject application. Please try again.');
    } finally {
      setApprovalLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Customer Application Approvals
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Review and approve pending customer applications
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          {applications.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Person sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Pending Applications
              </Typography>
              <Typography variant="body2" color="text.secondary">
                All customer applications have been processed.
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Customer Code</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>Occupation</TableCell>
                    <TableCell>Monthly Income</TableCell>
                    <TableCell>Application Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applications.map((application) => (
                    <TableRow key={application.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {application.customerCode}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {application.firstName} {application.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {application.nationalId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{application.phone}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {application.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {application.occupation || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatCurrency(application.monthlyIncome)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {application.createdAt ? new Date(application.createdAt).toLocaleDateString() : 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label="PENDING"
                          color="warning"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Visibility />}
                          onClick={() => handleViewApplication(application)}
                        >
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Application Review Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Review Customer Application
        </DialogTitle>
        <DialogContent>
          {selectedApplication && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Personal Information</Typography>
                <Typography variant="body2"><strong>Name:</strong> {selectedApplication.firstName} {selectedApplication.lastName}</Typography>
                <Typography variant="body2"><strong>National ID:</strong> {selectedApplication.nationalId}</Typography>
                <Typography variant="body2"><strong>Date of Birth:</strong> {selectedApplication.dateOfBirth}</Typography>
                <Typography variant="body2"><strong>Gender:</strong> {selectedApplication.gender}</Typography>
                <Typography variant="body2"><strong>Marital Status:</strong> {selectedApplication.maritalStatus}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Contact & Employment</Typography>
                <Typography variant="body2"><strong>Phone:</strong> {selectedApplication.phone}</Typography>
                <Typography variant="body2"><strong>Email:</strong> {selectedApplication.email}</Typography>
                <Typography variant="body2"><strong>Address:</strong> {selectedApplication.address}</Typography>
                <Typography variant="body2"><strong>Occupation:</strong> {selectedApplication.occupation}</Typography>
                <Typography variant="body2"><strong>Monthly Income:</strong> {formatCurrency(selectedApplication.monthlyIncome)}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Credit Assessment</Typography>
                <Typography variant="body2"><strong>Baseline Credit Score:</strong> {selectedApplication.customerProfile?.baselineCreditScore || 'N/A'}</Typography>
                <Typography variant="body2"><strong>Risk Category:</strong> {selectedApplication.customerProfile?.riskCategory || 'N/A'}</Typography>
                <Typography variant="body2"><strong>Application Date:</strong> {selectedApplication.createdAt ? new Date(selectedApplication.createdAt).toLocaleDateString() : 'N/A'}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Cancel />}
            onClick={() => handleRejectApplication(selectedApplication?.id)}
            disabled={approvalLoading}
          >
            Reject
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircle />}
            onClick={() => handleApproveApplication(selectedApplication?.id)}
            disabled={approvalLoading}
          >
            {approvalLoading ? 'Processing...' : 'Approve'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CustomerApprovals;