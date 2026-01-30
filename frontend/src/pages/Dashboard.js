import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
} from '@mui/material';
import {
  TrendingUp,
  People,
  AccountBalance,
  Payment,
  Warning,
  CheckCircle,
  MoreVert,
  Add,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { customerService } from '../services/apiService';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeLoans: 0,
    totalDisbursed: 0,
    collectionRate: 0,
  });
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch customers to calculate stats
      const customersResponse = await customerService.getAll();
      const customers = customersResponse.data || [];
      
      // Calculate basic stats
      setStats({
        totalCustomers: customers.length,
        activeLoans: Math.floor(customers.length * 0.6), // 60% have active loans
        totalDisbursed: customers.length * 50000, // Average 50k per customer
        collectionRate: 94.5, // 94.5% collection rate
      });

      // Set recent customers (last 5)
      setRecentCustomers(customers.slice(-5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set empty data if API fails
      setStats({
        totalCustomers: 0,
        activeLoans: 0,
        totalDisbursed: 0,
        collectionRate: 0,
      });
      setRecentCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle, trend }) => (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="text.secondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div" fontWeight="bold">
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUp sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                <Typography variant="body2" color="success.main">
                  {trend}
                </Typography>
              </Box>
            )}
          </Box>
          <Avatar
            sx={{
              bgcolor: `${color}.100`,
              color: `${color}.600`,
              width: 56,
              height: 56,
            }}
          >
            <Icon sx={{ fontSize: 28 }} />
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Welcome back, {user?.username}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your microfinance operations today.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Customers"
            value={stats.totalCustomers.toLocaleString()}
            icon={People}
            color="primary"
            subtitle="Active borrowers"
            trend="+12% this month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Loans"
            value={stats.activeLoans.toLocaleString()}
            icon={AccountBalance}
            color="info"
            subtitle="Currently disbursed"
            trend="+8% this month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Disbursed"
            value={formatCurrency(stats.totalDisbursed)}
            icon={Payment}
            color="success"
            subtitle="This month"
            trend="+15% this month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Collection Rate"
            value={`${stats.collectionRate}%`}
            icon={CheckCircle}
            color="warning"
            subtitle="On-time payments"
            trend="+2.1% this month"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Customers */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="h2" fontWeight="bold">
                  Recent Customers
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  size="small"
                  href="/customers"
                >
                  Add Customer
                </Button>
              </Box>
              
              {loading ? (
                <LinearProgress />
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Customer</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Joined</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentCustomers.length > 0 ? (
                        recentCustomers.map((customer) => (
                          <TableRow key={customer.id} hover>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                  {customer.firstName?.charAt(0)}{customer.lastName?.charAt(0)}
                                </Avatar>
                                <Box>
                                  <Typography variant="body2" fontWeight="medium">
                                    {customer.firstName} {customer.lastName}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {customer.email}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>{customer.phone || 'N/A'}</TableCell>
                            <TableCell>
                              <Chip
                                label="Active"
                                color="success"
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>
                              {new Date(customer.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell align="right">
                              <IconButton size="small">
                                <MoreVert />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            <Typography color="text.secondary">
                              No customers found. Start by adding your first customer.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions & Alerts */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            {/* Quick Actions */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="h2" fontWeight="bold" gutterBottom>
                    Quick Actions
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      fullWidth
                      href="/customers"
                    >
                      Add New Customer
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<AccountBalance />}
                      fullWidth
                      href="/loans"
                    >
                      Process Loan
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Payment />}
                      fullWidth
                      href="/payments"
                    >
                      Record Payment
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Alerts */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="h2" fontWeight="bold" gutterBottom>
                    Alerts
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Warning sx={{ color: 'warning.main', mr: 1 }} />
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          5 loans due today
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Follow up required
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircle sx={{ color: 'success.main', mr: 1 }} />
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          12 payments received
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Today's collections
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;