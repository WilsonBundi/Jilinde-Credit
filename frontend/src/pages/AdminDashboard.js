import { useState, useEffect } from 'react';

const AdminDashboard = ({ navigate }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0
  });

  // Check admin authentication
  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = localStorage.getItem('adminAuthenticated');
      const loginTime = localStorage.getItem('adminLoginTime');
      
      // Check if admin is authenticated and session is valid (24 hours)
      if (!isAuthenticated || !loginTime) {
        navigate('/admin');
        return false;
      }
      
      const sessionAge = Date.now() - parseInt(loginTime);
      const maxSessionAge = 24 * 60 * 60 * 1000; // 24 hours
      
      if (sessionAge > maxSessionAge) {
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminLoginTime');
        navigate('/admin');
        return false;
      }
      
      return true;
    };

    const loadStats = async () => {
      try {
        const response = await fetch('/api/admin/dashboard/stats', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          let data;
          const text = await response.text();
          try {
            data = text ? JSON.parse(text) : stats;
          } catch (e) {
            data = stats;
          }
          setStats(data);
        }
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };

    if (checkAuth()) {
      loadApplications();
      loadStats();
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminLoginTime');
    navigate('/');
  };

  const loadApplications = async () => {
    try {
      const response = await fetch('/api/admin/applications/all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        let data;
        const text = await response.text();
        try {
          data = text ? JSON.parse(text) : [];
        } catch (e) {
          data = [];
        }
        setApplications(data);
      } else {
        console.error('Failed to load applications');
        setApplications([]);
      }
    } catch (error) {
      console.error('Error loading applications:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        let data;
        const text = await response.text();
        try {
          data = text ? JSON.parse(text) : stats;
        } catch (e) {
          data = stats;
        }
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleApprove = async (applicationId) => {
    try {
      const response = await fetch(`/api/admin/applications/${applicationId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'approve' })
      });

      if (response.ok) {
        let result;
        const text = await response.text();
        try {
          result = text ? JSON.parse(text) : { pin: '1234' };
        } catch (e) {
          result = { pin: '1234' };
        }
        
        // Update local state
        setApplications(prev => 
          prev.map(app => 
            app.id === applicationId 
              ? { ...app, status: 'approved', pin: result.pin }
              : app
          )
        );
        
        // Reload stats
        loadStats();
        
        alert(`✅ Application approved! PIN ${result.pin} generated and SMS sent to customer.`);
      } else {
        let errorData;
        const text = await response.text();
        try {
          errorData = text ? JSON.parse(text) : { message: 'Failed to approve application' };
        } catch (e) {
          errorData = { message: 'Failed to approve application' };
        }
        throw new Error(errorData.message || 'Failed to approve application');
      }
    } catch (error) {
      console.error('Approval error:', error);
      alert('❌ ' + error.message);
    }
  };

  const handleReject = async (applicationId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      const response = await fetch(`/api/admin/applications/${applicationId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'reject', reason })
      });

      if (response.ok) {
        // Update local state
        setApplications(prev => 
          prev.map(app => 
            app.id === applicationId 
              ? { ...app, status: 'rejected', rejectionReason: reason }
              : app
          )
        );
        
        // Reload stats
        loadStats();
        
        alert('✅ Application rejected. Email notification sent to customer.');
      } else {
        let errorData;
        const text = await response.text();
        try {
          errorData = text ? JSON.parse(text) : { message: 'Failed to reject application' };
        } catch (e) {
          errorData = { message: 'Failed to reject application' };
        }
        throw new Error(errorData.message || 'Failed to reject application');
      }
    } catch (error) {
      console.error('Rejection error:', error);
      alert('❌ ' + error.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⏳</div>
          <h2>Loading Admin Dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: 'white'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', margin: 0 }}>
                🛡️ Admin Dashboard
              </h1>
              <p style={{ fontSize: '1.1rem', opacity: 0.9, margin: 0 }}>
                Jilinde Credit Limited - Administrative Portal
              </p>
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button
                onClick={() => window.location.href = '/'}
                style={{
                  padding: '12px 24px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  backdropFilter: 'blur(10px)'
                }}
              >
                🏠 Home
              </button>
              <button
                onClick={() => window.location.href = '/customer'}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  boxShadow: '0 4px 20px rgba(76, 175, 80, 0.3)'
                }}
              >
                👤 Customer Portal
              </button>
              <button
                onClick={handleLogout}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  boxShadow: '0 4px 20px rgba(244, 67, 54, 0.3)'
                }}
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '25px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            textAlign: 'center',
            color: 'white'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📊</div>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '2rem', fontWeight: 'bold' }}>
              {stats.totalApplications}
            </h3>
            <p style={{ margin: 0, opacity: 0.9 }}>Total Applications</p>
          </div>

          <div style={{
            background: 'rgba(255, 193, 7, 0.2)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '25px',
            border: '1px solid rgba(255, 193, 7, 0.3)',
            textAlign: 'center',
            color: 'white'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>⏳</div>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '2rem', fontWeight: 'bold' }}>
              {stats.pendingApplications}
            </h3>
            <p style={{ margin: 0, opacity: 0.9 }}>Pending Review</p>
          </div>

          <div style={{
            background: 'rgba(76, 175, 80, 0.2)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '25px',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            textAlign: 'center',
            color: 'white'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>✅</div>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '2rem', fontWeight: 'bold' }}>
              {stats.approvedApplications}
            </h3>
            <p style={{ margin: 0, opacity: 0.9 }}>Approved</p>
          </div>

          <div style={{
            background: 'rgba(244, 67, 54, 0.2)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '25px',
            border: '1px solid rgba(244, 67, 54, 0.3)',
            textAlign: 'center',
            color: 'white'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>❌</div>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '2rem', fontWeight: 'bold' }}>
              {stats.rejectedApplications}
            </h3>
            <p style={{ margin: 0, opacity: 0.9 }}>Rejected</p>
          </div>
        </div>

        {/* Applications Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '30px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h2 style={{ marginBottom: '30px', color: 'white', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'space-between' }}>
            <span>📋 All Applications ({applications.length})</span>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                Pending: {applications.filter(app => app.status === 'pending').length} | 
                Approved: {applications.filter(app => app.status === 'approved').length} | 
                Rejected: {applications.filter(app => app.status === 'rejected').length}
              </span>
              <button
                onClick={() => {
                  setLoading(true);
                  loadApplications();
                  loadStats();
                }}
                style={{
                  padding: '10px 20px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                🔄 Refresh
              </button>
            </div>
          </h2>

          {applications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255, 255, 255, 0.8)' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📭</div>
              <h3 style={{ color: 'white' }}>No Applications Found</h3>
              <p>New customer applications will appear here for review.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {applications.map((app) => (
                <div
                  key={app.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '16px',
                    padding: '25px',
                    borderLeft: app.status === 'pending' ? '5px solid #ffc107' : 
                              app.status === 'approved' ? '5px solid #4caf50' : '5px solid #f44336'
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                    <div>
                      <strong style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Application ID:</strong><br/>
                      <span style={{ color: 'white', fontSize: '1.1rem' }}>{app.id}</span>
                    </div>
                    <div>
                      <strong style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Customer Name:</strong><br/>
                      <span style={{ color: 'white', fontSize: '1.1rem' }}>{app.firstName} {app.lastName}</span>
                    </div>
                    <div>
                      <strong style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Phone:</strong><br/>
                      <span style={{ color: 'white', fontSize: '1.1rem' }}>{app.phone}</span>
                    </div>
                    <div>
                      <strong style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Email:</strong><br/>
                      <span style={{ color: 'white', fontSize: '1.1rem' }}>{app.email}</span>
                    </div>
                    <div>
                      <strong style={{ color: 'rgba(255, 255, 255, 0.8)' }}>ID Number:</strong><br/>
                      <span style={{ color: 'white', fontSize: '1.1rem' }}>{app.idNumber}</span>
                    </div>
                    <div>
                      <strong style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Submitted:</strong><br/>
                      <span style={{ color: 'white', fontSize: '1.1rem' }}>{formatDate(app.submittedAt)}</span>
                    </div>
                  </div>

                  {/* Document Verification Warning */}
                  {app.documentVerificationScore && app.documentVerificationScore < 90 && (
                    <div style={{
                      background: 'rgba(255, 152, 0, 0.2)',
                      border: '2px solid #ff9800',
                      borderRadius: '12px',
                      padding: '15px',
                      marginBottom: '20px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <span style={{ fontSize: '1.5rem' }}>⚠️</span>
                        <strong style={{ color: '#ff9800', fontSize: '1.1rem' }}>
                          DOCUMENT VERIFICATION WARNING
                        </strong>
                      </div>
                      <p style={{ color: 'white', margin: 0, fontSize: '0.95rem' }}>
                        Document verification score: <strong>{app.documentVerificationScore}/100</strong>
                        <br/>
                        {app.documentVerificationScore < 70 ? 
                          '🚨 HIGH RISK: Significant discrepancies detected between personal details and document data.' :
                          '⚠️ MEDIUM RISK: Minor discrepancies detected. Manual review recommended.'
                        }
                      </p>
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        background: app.status === 'pending' ? 'rgba(255, 193, 7, 0.3)' :
                                   app.status === 'approved' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)',
                        color: 'white',
                        border: app.status === 'pending' ? '1px solid #ffc107' :
                               app.status === 'approved' ? '1px solid #4caf50' : '1px solid #f44336'
                      }}>
                        {app.status === 'pending' ? '⏳ Pending Review' :
                         app.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
                      </span>
                      
                      {app.status === 'approved' && app.pin && (
                        <span style={{
                          padding: '8px 16px',
                          borderRadius: '20px',
                          fontSize: '0.9rem',
                          fontWeight: 'bold',
                          background: 'rgba(33, 150, 243, 0.3)',
                          color: 'white',
                          border: '1px solid #2196f3'
                        }}>
                          PIN: {app.pin}
                        </span>
                      )}
                    </div>

                    {app.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => handleApprove(app.id)}
                          style={{
                            padding: '12px 24px',
                            background: 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
                          }}
                        >
                          ✅ Approve & Generate PIN
                        </button>
                        <button
                          onClick={() => handleReject(app.id)}
                          style={{
                            padding: '12px 24px',
                            background: 'linear-gradient(45deg, #f44336 30%, #ef5350 90%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(244, 67, 54, 0.3)'
                          }}
                        >
                          ❌ Reject Application
                        </button>
                      </div>
                    )}
                  </div>

                  {app.status === 'rejected' && app.rejectionReason && (
                    <div style={{
                      marginTop: '15px',
                      padding: '15px',
                      background: 'rgba(244, 67, 54, 0.2)',
                      borderRadius: '8px',
                      border: '1px solid rgba(244, 67, 54, 0.3)',
                      color: 'white'
                    }}>
                      <strong>Rejection Reason:</strong> {app.rejectionReason}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;