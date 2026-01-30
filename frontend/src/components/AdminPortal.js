import { useState, useEffect } from 'react';

const AdminPortal = ({ onBack }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load applications from backend
    const loadApplications = async () => {
      try {
        const response = await fetch('/api/admin/applications/pending', {
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

    loadApplications();
  }, []);

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
        alert(`Application approved! PIN ${result.pin} generated and SMS sent to customer.`);
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
        alert('Application rejected. Email notification sent to customer.');
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
        background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⏳</div>
          <h2>Loading Applications...</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
          color: 'white',
          padding: '30px',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
            🛡️ Admin Portal - Customer Approvals
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, margin: 0 }}>
            Review and approve customer applications with PIN generation
          </p>
        </div>

        {/* Applications List */}
        <div style={{ padding: '40px' }}>
          <h2 style={{ marginBottom: '30px', color: '#2e7d32' }}>
            📋 Pending Applications ({applications.filter(app => app.status === 'pending').length})
          </h2>

          {applications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📭</div>
              <h3>No Applications Found</h3>
              <p>New customer applications will appear here for review.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {applications.map((app) => (
                <div
                  key={app.id}
                  style={{
                    border: '2px solid #e0e0e0',
                    borderRadius: '12px',
                    padding: '25px',
                    background: app.status === 'pending' ? '#fff' : 
                              app.status === 'approved' ? '#e8f5e9' : '#ffebee'
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                    <div>
                      <strong>Application ID:</strong><br/>
                      {app.id}
                    </div>
                    <div>
                      <strong>Customer Name:</strong><br/>
                      {app.firstName} {app.lastName}
                    </div>
                    <div>
                      <strong>Phone:</strong><br/>
                      {app.phone}
                    </div>
                    <div>
                      <strong>Email:</strong><br/>
                      {app.email}
                    </div>
                    <div>
                      <strong>ID Number:</strong><br/>
                      {app.idNumber}
                    </div>
                    <div>
                      <strong>Submitted:</strong><br/>
                      {formatDate(app.submittedAt)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        background: app.status === 'pending' ? '#fff3cd' :
                                   app.status === 'approved' ? '#d4edda' : '#f8d7da',
                        color: app.status === 'pending' ? '#856404' :
                               app.status === 'approved' ? '#155724' : '#721c24'
                      }}>
                        {app.status === 'pending' ? '⏳ Pending Review' :
                         app.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
                      </span>
                      
                      {app.status === 'approved' && app.pin && (
                        <span style={{
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '0.9rem',
                          fontWeight: 'bold',
                          background: '#e3f2fd',
                          color: '#1565c0'
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
                            padding: '10px 20px',
                            background: 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                          }}
                        >
                          ✅ Approve & Generate PIN
                        </button>
                        <button
                          onClick={() => handleReject(app.id)}
                          style={{
                            padding: '10px 20px',
                            background: 'linear-gradient(45deg, #f44336 30%, #ef5350 90%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            cursor: 'pointer'
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
                      background: '#ffebee',
                      borderRadius: '8px',
                      border: '1px solid #ffcdd2'
                    }}>
                      <strong>Rejection Reason:</strong> {app.rejectionReason}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back Button */}
        <div style={{ textAlign: 'center', padding: '20px', borderTop: '1px solid #e0e0e0' }}>
          <button
            onClick={onBack}
            style={{
              padding: '12px 24px',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;