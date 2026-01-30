import { useState, useEffect } from 'react';
import { loanService } from '../services/apiService';
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
  TextField,
  InputAdornment,
  Chip,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { Search, Add, AccountBalance } from '@mui/icons-material';

function Loans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await loanService.getAll();
      setLoans(response.data || []);
    } catch (error) {
      console.error('Error fetching loans:', error);
      setError('Failed to load loans. Please try again.');
      setLoans([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredLoans = loans.filter(loan =>
    loan.loanNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE': return 'success';
      case 'PENDING': return 'warning';
      case 'APPROVED': return 'info';
      case 'DISBURSED': return 'success';
      case 'COMPLETED': return 'default';
      case 'DEFAULTED': return 'error';
      case 'REJECTED': return 'error';
      default: return 'default';
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Loan Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{ bgcolor: 'primary.main' }}
        >
          New Loan Application
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Search loans by number, customer, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          {loans.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <AccountBalance sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Loans Found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchTerm ? 'No loans match your search criteria.' : 'No loan applications have been submitted yet.'}
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Loan Number</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Principal Amount</TableCell>
                    <TableCell>Interest Rate</TableCell>
                    <TableCell>Term</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Application Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredLoans.map((loan) => (
                    <TableRow key={loan.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {loan.loanNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {loan.customerName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatCurrency(loan.principalAmount)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {loan.interestRate}%
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {loan.termMonths} months
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={loan.status || 'PENDING'}
                          color={getStatusColor(loan.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {loan.applicationDate ? new Date(loan.applicationDate).toLocaleDateString() : 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Button size="small" variant="outlined">
                          View Details
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
    </Box>
  );
}

export default Loans;