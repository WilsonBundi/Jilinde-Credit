import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
} from '@mui/material';
import {
  AccountBalance,
  Payment,
  Person,
  History,
  Add,
  CheckCircle,
  Schedule,
  Phone,
  Email,
  LocationOn,
  Logout,
  Notifications,
} from '@mui/icons-material';

const CustomerPortal = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [customer] = useState({
    id: 1,
    customerCode: 'CUST001',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+254712345678',
    email: 'john.doe@email.com',
    address: 'Nairobi, Kenya',
    monthlyIncome: 50000,
    creditScore: 750,
    joinDate: '2024-01-15',
  });

  const [loans] = useState([
    {
      id: 1,
      loanNumber: 'LOAN001',
      amount: 100000,
      outstandingBalance: 75000,
      interestRate: 15,
      status: 'Active',
      disbursementDate: '2024-01-25',
      maturityDate: '2025-01-25',
      nextPaymentDate: '2024-03-25',
      nextPaymentAmount: 9583,
      monthlyPayment: 9583,
      paymentsRemaining: 8,
    }
  ]);

  const [payments] = useState([
    {
      id: 1,
      paymentNumber: 'PAY001',
      amount: 9583,
      principalAmount: 7583,
      interestAmount: 2000,
      paymentDate: '2024-02-25',
      status: 'Completed',
      method: 'M-Pesa',
      reference: 'MM789012345',
    },
    {
      id: 2,
      paymentNumber: 'PAY002',
      amount: 9583,
      principalAmount: 7678,
      interestAmount: 1905,
      paymentDate: '2024-01-25',
      status: 'Completed',
      method: 'M-Pesa',
      reference: 'MM789012344',
    }
  ]);

  const [openLoanApplication, setOpenLoanApplication] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);
  const [loanApplication, setLoanApplication] = useState({
    amount: '',
    purpose: '',
    duration: '',
  });
  const [paymentData, setPaymentData] = useState({
    amount: '',
    method: 'M-Pesa',
    reference: '',
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleLoanApplication = () => {
    // Handle loan application submission
    console.log('Loan application:', loanApplication);
    setOpenLoanApplication(false);
    // Reset form
    setLoanApplication({ amount: '', purpose: '', duration: '' });
  };

  const handlePayment = () => {
    // Handle payment submission
    console.log('Payment:', paymentData);
    setOpenPayment(false);
    // Reset form
    setPaymentData({ amount: '', method: 'M-Pesa', reference: '' });
  };

  const handleLogout = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('customerData');
    navigate('/login');
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle, action }) => (
    <Card sx={{ height: '100%', position: 'relative' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography color="text.secondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h5" component="div" fontWeight="bold">
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar
            sx={{
              bgcolor: `${color}.100`,
              color: `${color}.600`,
              width: 48,
              height: 48,
            }}
          >
            <Icon />
          </Avatar>
        </Box>
        {action && (
          <Button
            variant="outlined"
            size="small"
            fullWidth
            onClick={action.onClick}
            startIcon={action.icon}
          >
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Top Navigation */}
      <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)' }}>
        <Toolbar>
          <Avatar sx={{ mr: 2, bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
            <AccountBalance />
          </Avatar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Jilinde Credit Portal
          </Typography>
          <IconButton color="inherit" sx={{ mr: 1 }}>
            <Notifications />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={handleProfileMenuOpen}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
              {customer.firstName.charAt(0)}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleProfileMenuClose}>
              <Person sx={{ mr: 1 }} /> Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: 'primary.main',
              mr: 2,
              fontSize: '1.5rem',
            }}
          >
            {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Welcome, {customer.firstName}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Customer ID: {customer.customerCode} • Member since {new Date(customer.joinDate).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Loans"
            value={loans.filter(l => l.status === 'Active').length}
            icon={AccountBalance}
            color="primary"
            subtitle="Current borrowings"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Outstanding Balance"
            value={formatCurrency(loans.reduce((sum, loan) => sum + loan.outstandingBalance, 0))}
            icon={Payment}
            color="warning"
            subtitle="Total amount due"
            action={{
              label: 'Make Payment',
              icon: <Payment />,
              onClick: () => setOpenPayment(true)
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Credit Score"
            value={customer.creditScore}
            icon={CheckCircle}
            color="success"
            subtitle="Excellent rating"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Next Payment"
            value={loans[0] ? formatCurrency(loans[0].nextPaymentAmount) : 'N/A'}
            icon={Schedule}
            color="info"
            subtitle={loans[0] ? `Due ${new Date(loans[0].nextPaymentDate).toLocaleDateString()}` : 'No active loans'}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Active Loans */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  My Loans
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setOpenLoanApplication(true)}
                >
                  Apply for Loan
                </Button>
              </Box>

              {loans.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Loan Details</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Next Payment</TableCell>
                        <TableCell>Progress</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loans.map((loan) => (
                        <TableRow key={loan.id}>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {loan.loanNumber}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {loan.interestRate}% • {loan.paymentsRemaining} payments left
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {formatCurrency(loan.amount)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Outstanding: {formatCurrency(loan.outstandingBalance)}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={loan.status}
                              color={loan.status === 'Active' ? 'success' : 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {formatCurrency(loan.nextPaymentAmount)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Due: {new Date(loan.nextPaymentDate).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ width: '100%' }}>
                              <LinearProgress
                                variant="determinate"
                                value={((loan.amount - loan.outstandingBalance) / loan.amount) * 100}
                                sx={{ mb: 1 }}
                              />
                              <Typography variant="caption" color="text.secondary">
                                {Math.round(((loan.amount - loan.outstandingBalance) / loan.amount) * 100)}% paid
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <AccountBalance sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Active Loans
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Ready to get started? Apply for your first loan today.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setOpenLoanApplication(true)}
                  >
                    Apply for Loan
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions & Profile */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            {/* Quick Actions */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Quick Actions
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={<Payment />}
                      fullWidth
                      onClick={() => setOpenPayment(true)}
                      disabled={loans.length === 0}
                    >
                      Make Payment
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Add />}
                      fullWidth
                      onClick={() => setOpenLoanApplication(true)}
                    >
                      Apply for Loan
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<History />}
                      fullWidth
                    >
                      Payment History
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Profile Summary */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Profile Summary
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Phone sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                      <Typography variant="body2">{customer.phone}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Email sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                      <Typography variant="body2">{customer.email}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOn sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                      <Typography variant="body2">{customer.address}</Typography>
                    </Box>
                    <Button variant="outlined" size="small" startIcon={<Person />}>
                      Update Profile
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Recent Payments */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Recent Payments
              </Typography>
              {payments.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Payment Details</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Method</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {payments.slice(0, 5).map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {payment.paymentNumber}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Ref: {payment.reference}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {formatCurrency(payment.amount)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Principal: {formatCurrency(payment.principalAmount)}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={payment.method}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            {new Date(payment.paymentDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={payment.status}
                              color="success"
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No payment history available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Loan Application Dialog */}
      <Dialog open={openLoanApplication} onClose={() => setOpenLoanApplication(false)} maxWidth="md" fullWidth>
        <DialogTitle>Apply for a New Loan</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Loan Amount (KES)"
                  type="number"
                  value={loanApplication.amount}
                  onChange={(e) => setLoanApplication({...loanApplication, amount: e.target.value})}
                  helperText="Minimum: KES 10,000 • Maximum: KES 500,000"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Loan Duration</InputLabel>
                  <Select
                    value={loanApplication.duration}
                    onChange={(e) => setLoanApplication({...loanApplication, duration: e.target.value})}
                    label="Loan Duration"
                  >
                    <MenuItem value="6">6 Months</MenuItem>
                    <MenuItem value="12">12 Months</MenuItem>
                    <MenuItem value="18">18 Months</MenuItem>
                    <MenuItem value="24">24 Months</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Purpose of Loan"
                  multiline
                  rows={3}
                  value={loanApplication.purpose}
                  onChange={(e) => setLoanApplication({...loanApplication, purpose: e.target.value})}
                  placeholder="Please describe how you plan to use this loan..."
                />
              </Grid>
            </Grid>
            
            <Alert severity="info" sx={{ mt: 2 }}>
              Your application will be reviewed within 24 hours. You'll receive an SMS notification once approved.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLoanApplication(false)}>Cancel</Button>
          <Button 
            onClick={handleLoanApplication} 
            variant="contained"
            disabled={!loanApplication.amount || !loanApplication.duration || !loanApplication.purpose}
          >
            Submit Application
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={openPayment} onClose={() => setOpenPayment(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Make a Payment</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Payment Amount (KES)"
                  type="number"
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})}
                  helperText={loans[0] ? `Next payment due: ${formatCurrency(loans[0].nextPaymentAmount)}` : ''}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Payment Method</InputLabel>
                  <Select
                    value={paymentData.method}
                    onChange={(e) => setPaymentData({...paymentData, method: e.target.value})}
                    label="Payment Method"
                  >
                    <MenuItem value="M-Pesa">M-Pesa</MenuItem>
                    <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                    <MenuItem value="Airtel Money">Airtel Money</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Reference Number"
                  value={paymentData.reference}
                  onChange={(e) => setPaymentData({...paymentData, reference: e.target.value})}
                  placeholder="Enter transaction reference"
                  helperText="Enter the reference number from your mobile money or bank transaction"
                />
              </Grid>
            </Grid>
            
            <Alert severity="warning" sx={{ mt: 2 }}>
              Please ensure you have completed the payment through your chosen method before submitting this form.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPayment(false)}>Cancel</Button>
          <Button 
            onClick={handlePayment} 
            variant="contained"
            disabled={!paymentData.amount || !paymentData.reference}
          >
            Submit Payment
          </Button>
        </DialogActions>
      </Dialog>
      </Box>
    </Box>
  );
};

export default CustomerPortal;