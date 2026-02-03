import api from './authService';
import { demoService } from './demoService';

// Check if backend is accessible
let backendAccessible = true;

// Onboarding API with demo fallback
export const onboardingService = {
  submitApplication: async (applicationData) => {
    if (!backendAccessible) {
      console.log('Using demo mode for application submission');
      return demoService.registerCustomer(applicationData);
    }
    
    try {
      return await api.post('/onboarding/register', applicationData);
    } catch (error) {
      console.error('Backend not accessible, falling back to demo mode');
      backendAccessible = false;
      return demoService.registerCustomer(applicationData);
    }
  },
  
  checkPhone: async (phone) => {
    if (!backendAccessible) {
      console.log('Using demo mode for phone check');
      return demoService.checkPhone(phone);
    }
    
    try {
      return await api.post('/onboarding/check-phone', { phone });
    } catch (error) {
      console.error('Backend not accessible for phone check, falling back to demo mode');
      backendAccessible = false;
      return demoService.checkPhone(phone);
    }
  },
  
  getApplicationStatus: (applicationId) => {
    return api.get(`/onboarding/status/${applicationId}`);
  },
  
  uploadDocument: (documentType, file) => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('type', documentType);
    return api.post('/onboarding/upload-document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  verifyBiometric: (biometricData) => {
    return api.post('/onboarding/verify-biometric', biometricData);
  },
};

// Customer API
export const customerService = {
  getAll: (params = {}) => {
    return api.get('/customers', { params });
  },
  
  getById: (id) => {
    return api.get(`/customers/${id}`);
  },
  
  create: (customerData) => {
    return api.post('/customers', customerData);
  },
  
  update: (id, customerData) => {
    return api.put(`/customers/${id}`, customerData);
  },
  
  delete: (id) => {
    return api.delete(`/customers/${id}`);
  },
  
  search: (query) => {
    return api.get(`/customers/search?q=${encodeURIComponent(query)}`);
  },
  
  approve: (id) => {
    return api.post(`/customers/${id}/approve`);
  },
  
  reject: (id) => {
    return api.post(`/customers/${id}/reject`);
  },
};

// Loan API
export const loanService = {
  getAll: (params = {}) => {
    return api.get('/loans', { params });
  },
  
  getById: (id) => {
    return api.get(`/loans/${id}`);
  },
  
  create: (loanData) => {
    return api.post('/loans', loanData);
  },
  
  update: (id, loanData) => {
    return api.put(`/loans/${id}`, loanData);
  },
  
  approve: (id, approvalData) => {
    return api.post(`/loans/${id}/approve`, approvalData);
  },
  
  disburse: (id, disbursementData) => {
    return api.post(`/loans/${id}/disburse`, disbursementData);
  },
  
  getRepaymentSchedule: (id) => {
    return api.get(`/loans/${id}/schedule`);
  },
  
  getByCustomer: (customerId) => {
    return api.get(`/customers/${customerId}/loans`);
  },
};

// Payment API
export const paymentService = {
  getAll: (params = {}) => {
    return api.get('/payments', { params });
  },
  
  getById: (id) => {
    return api.get(`/payments/${id}`);
  },
  
  create: (paymentData) => {
    return api.post('/payments', paymentData);
  },
  
  processMobileMoneyPayment: (paymentData) => {
    return api.post('/payments/mobile-money', paymentData);
  },
  
  getByLoan: (loanId) => {
    return api.get(`/loans/${loanId}/payments`);
  },
  
  getByCustomer: (customerId) => {
    return api.get(`/customers/${customerId}/payments`);
  },
  
  getReceipt: (id) => {
    return api.get(`/payments/${id}/receipt`);
  },
};

// Dashboard API with demo fallback
export const dashboardService = {
  getStats: async () => {
    if (!backendAccessible) {
      console.log('Using demo mode for dashboard stats');
      return demoService.getDashboardStats();
    }
    
    try {
      return await api.get('/dashboard/stats');
    } catch (error) {
      console.error('Backend not accessible for stats, falling back to demo mode');
      backendAccessible = false;
      return demoService.getDashboardStats();
    }
  },
  
  getAllApplications: async () => {
    if (!backendAccessible) {
      console.log('Using demo mode for applications list');
      return demoService.getAllApplications();
    }
    
    try {
      return await api.get('/admin/applications');
    } catch (error) {
      console.error('Backend not accessible for applications, falling back to demo mode');
      backendAccessible = false;
      return demoService.getAllApplications();
    }
  },
  
  approveApplication: async (applicationId) => {
    if (!backendAccessible) {
      console.log('Using demo mode for application approval');
      return demoService.approveApplication(applicationId);
    }
    
    try {
      return await api.post(`/admin/applications/${applicationId}/approve`);
    } catch (error) {
      console.error('Backend not accessible for approval, falling back to demo mode');
      backendAccessible = false;
      return demoService.approveApplication(applicationId);
    }
  },
  
  rejectApplication: async (applicationId, reason) => {
    if (!backendAccessible) {
      console.log('Using demo mode for application rejection');
      return demoService.rejectApplication(applicationId, reason);
    }
    
    try {
      return await api.post(`/admin/applications/${applicationId}/reject`, { reason });
    } catch (error) {
      console.error('Backend not accessible for rejection, falling back to demo mode');
      backendAccessible = false;
      return demoService.rejectApplication(applicationId, reason);
    }
  },
  
  getRecentActivity: () => {
    return api.get('/dashboard/recent-activity');
  },
  
  getPortfolioSummary: () => {
    return api.get('/dashboard/portfolio-summary');
  },
};

// Reports API
export const reportService = {
  getPortfolioReport: (params = {}) => {
    return api.get('/reports/portfolio', { params });
  },
  
  getCollectionReport: (params = {}) => {
    return api.get('/reports/collections', { params });
  },
  
  getRegulatoryReport: (reportType, params = {}) => {
    return api.get(`/reports/regulatory/${reportType}`, { params });
  },
  
  exportReport: (reportType, format = 'pdf', params = {}) => {
    return api.get(`/reports/${reportType}/export`, {
      params: { ...params, format },
      responseType: 'blob',
    });
  },
};

// Loan Products API
export const loanProductService = {
  getAll: () => {
    return api.get('/loan-products');
  },
  
  getById: (id) => {
    return api.get(`/loan-products/${id}`);
  },
  
  create: (productData) => {
    return api.post('/loan-products', productData);
  },
  
  update: (id, productData) => {
    return api.put(`/loan-products/${id}`, productData);
  },
  
  delete: (id) => {
    return api.delete(`/loan-products/${id}`);
  },
};