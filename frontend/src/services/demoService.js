// Demo Service for Netlify Deployment (No Backend Required)
// This provides mock data and simulated API responses

// Mock data
const mockCustomers = [
  {
    id: 'CUST-20260130-001',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+254712345678',
    email: 'john.doe@example.com',
    idNumber: '12345678',
    status: 'pending',
    submittedAt: '2026-01-30T10:00:00Z'
  },
  {
    id: 'CUST-20260130-002',
    firstName: 'Jane',
    lastName: 'Smith',
    phone: '+254723456789',
    email: 'jane.smith@example.com',
    idNumber: '87654321',
    status: 'approved',
    submittedAt: '2026-01-29T14:30:00Z'
  }
];

const mockStats = {
  totalApplications: 25,
  pendingApplications: 8,
  approvedApplications: 15,
  rejectedApplications: 2
};

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Demo API responses
export const demoService = {
  // Auth
  login: async (credentials) => {
    await delay(1000);
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      return {
        data: {
          token: 'demo-token-12345',
          user: {
            id: 1,
            username: 'admin',
            role: 'ADMIN',
            firstName: 'Admin',
            lastName: 'User'
          }
        }
      };
    }
    throw new Error('Invalid credentials');
  },

  // Customer registration
  registerCustomer: async (customerData) => {
    await delay(1500);
    const newCustomer = {
      id: `CUST-${Date.now()}`,
      ...customerData,
      status: 'pending',
      submittedAt: new Date().toISOString()
    };
    mockCustomers.push(newCustomer);
    return {
      data: {
        customerCode: newCustomer.id,
        message: 'Application submitted successfully! You will receive an email confirmation shortly.'
      }
    };
  },

  // Check phone availability
  checkPhone: async (phone) => {
    await delay(500);
    const exists = mockCustomers.some(c => c.phone === phone);
    if (exists) {
      throw new Error('Phone number already registered');
    }
    return {
      data: {
        message: 'Phone number is available',
        status: 'AVAILABLE'
      }
    };
  },

  // Get all applications
  getAllApplications: async () => {
    await delay(800);
    return {
      data: mockCustomers
    };
  },

  // Get dashboard stats
  getDashboardStats: async () => {
    await delay(600);
    return {
      data: mockStats
    };
  },

  // Approve application
  approveApplication: async (applicationId) => {
    await delay(1000);
    const customer = mockCustomers.find(c => c.id === applicationId);
    if (customer) {
      customer.status = 'approved';
      customer.pin = Math.floor(1000 + Math.random() * 9000).toString();
    }
    return {
      data: {
        status: 'approved',
        pin: customer?.pin || '1234',
        message: 'Application approved successfully. PIN sent to customer.'
      }
    };
  },

  // Reject application
  rejectApplication: async (applicationId, reason) => {
    await delay(1000);
    const customer = mockCustomers.find(c => c.id === applicationId);
    if (customer) {
      customer.status = 'rejected';
      customer.rejectionReason = reason;
    }
    return {
      data: {
        status: 'rejected',
        reason: reason,
        message: 'Application rejected. Customer notified via email.'
      }
    };
  }
};

// Check if we're in demo mode (deployed on Netlify)
export const isDemoMode = () => {
  return !process.env.REACT_APP_API_URL || 
         window.location.hostname.includes('netlify') ||
         window.location.hostname.includes('github.io');
};