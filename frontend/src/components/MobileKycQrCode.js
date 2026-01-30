import React, { useState, useEffect } from 'react';

const MobileKycQrCode = ({ customerData, onSuccess, onError, onCancel }) => {
  const [qrCodeData, setQrCodeData] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(900); // 15 minutes in seconds
  const [sessionStatus, setSessionStatus] = useState('PENDING');

  useEffect(() => {
    createKycSession();
  }, []);

  useEffect(() => {
    if (sessionId) {
      const pollInterval = setInterval(pollSessionStatus, 2000); // Poll every 2 seconds
      return () => clearInterval(pollInterval);
    }
  }, [sessionId]);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onError('Session expired. Please try again.');
    }
  }, [timeRemaining]);

  const createKycSession = async () => {
    try {
      const response = await fetch('/api/mobile-kyc/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerData: JSON.stringify(customerData),
          baseUrl: window.location.origin
        })
      });

      if (response.ok) {
        const result = await response.json();
        setQrCodeData(result.qrCodeData);
        setSessionId(result.sessionId);
        setIsLoading(false);
      } else {
        throw new Error('Failed to create KYC session');
      }
    } catch (error) {
      console.error('Error creating KYC session:', error);
      onError('Failed to create mobile KYC session: ' + error.message);
    }
  };

  const pollSessionStatus = async () => {
    if (!sessionId) return;

    try {
      const response = await fetch(`/api/mobile-kyc/session/${sessionId}/status`);
      if (response.ok) {
        const status = await response.json();
        setSessionStatus(status.status);

        if (status.status === 'COMPLETED') {
          onSuccess({
            sessionId: sessionId,
            verificationData: status.verificationData,
            message: 'Mobile KYC verification completed successfully!'
          });
        }
      }
    } catch (error) {
      console.error('Error polling session status:', error);
    }
  };

  const generateQrCodeSvg = (text) => {
    // Simple QR code representation (in production, use a proper QR code library)
    const size = 200;
    const cellSize = size / 25;
    
    return (
      <svg width={size} height={size} style={{ border: '2px solid #333' }}>
        {/* QR code pattern simulation */}
        {Array.from({ length: 25 }, (_, i) => 
          Array.from({ length: 25 }, (_, j) => {
            const shouldFill = (i + j + text.length) % 3 === 0;
            return shouldFill ? (
              <rect
                key={`${i}-${j}`}
                x={j * cellSize}
                y={i * cellSize}
                width={cellSize}
                height={cellSize}
                fill="#000"
              />
            ) : null;
          })
        )}
        {/* Corner markers */}
        <rect x={0} y={0} width={cellSize * 7} height={cellSize * 7} fill="none" stroke="#000" strokeWidth="2"/>
        <rect x={size - cellSize * 7} y={0} width={cellSize * 7} height={cellSize * 7} fill="none" stroke="#000" strokeWidth="2"/>
        <rect x={0} y={size - cellSize * 7} width={cellSize * 7} height={cellSize * 7} fill="none" stroke="#000" strokeWidth="2"/>
      </svg>
    );
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = () => {
    if (qrCodeData?.url) {
      navigator.clipboard.writeText(qrCodeData.url);
      alert('📱 Mobile KYC link copied to clipboard!');
    }
  };

  if (isLoading) {
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
          <h2>Generating Mobile KYC Session...</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        maxWidth: '600px',
        width: '100%',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
          color: 'white',
          padding: '30px',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
            📱 Mobile KYC Verification
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, margin: 0 }}>
            Scan QR code with your mobile phone for secure biometric verification
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: '40px', textAlign: 'center' }}>
          {/* Security Notice */}
          <div style={{
            background: '#fff3cd',
            border: '2px solid #ffc107',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '30px'
          }}>
            <h3 style={{ color: '#856404', marginBottom: '15px' }}>
              🔒 Enhanced Security Protocol
            </h3>
            <p style={{ color: '#856404', margin: 0, lineHeight: '1.6' }}>
              For maximum security, KYC verification must be completed on a mobile device. 
              Laptop/desktop cameras are not permitted for biometric verification.
            </p>
          </div>

          {/* QR Code */}
          <div style={{
            background: '#f8f9fa',
            border: '2px solid #e9ecef',
            borderRadius: '16px',
            padding: '30px',
            marginBottom: '30px'
          }}>
            <h3 style={{ color: '#2e7d32', marginBottom: '20px' }}>
              📱 Scan with Mobile Phone
            </h3>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              marginBottom: '20px' 
            }}>
              {qrCodeData?.url && generateQrCodeSvg(qrCodeData.url)}
            </div>

            <div style={{
              background: sessionStatus === 'PENDING' ? '#e3f2fd' : 
                         sessionStatus === 'IN_PROGRESS' ? '#fff3e0' : '#e8f5e9',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <p style={{ 
                margin: 0, 
                fontWeight: 'bold',
                color: sessionStatus === 'PENDING' ? '#1976d2' : 
                       sessionStatus === 'IN_PROGRESS' ? '#f57c00' : '#2e7d32'
              }}>
                Status: {sessionStatus === 'PENDING' ? '⏳ Waiting for mobile scan' :
                         sessionStatus === 'IN_PROGRESS' ? '📱 KYC in progress on mobile' : 
                         '✅ Verification completed'}
              </p>
            </div>

            {/* Timer */}
            <div style={{
              background: timeRemaining < 300 ? '#ffebee' : '#e8f5e9',
              padding: '10px',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <p style={{ 
                margin: 0, 
                fontWeight: 'bold',
                color: timeRemaining < 300 ? '#c62828' : '#2e7d32'
              }}>
                ⏰ Time remaining: {formatTime(timeRemaining)}
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div style={{
            background: '#e3f2fd',
            border: '1px solid #2196f3',
            borderRadius: '12px',
            padding: '25px',
            marginBottom: '30px',
            textAlign: 'left'
          }}>
            <h4 style={{ color: '#1976d2', marginBottom: '15px' }}>
              📋 Instructions:
            </h4>
            <ol style={{ color: '#1976d2', lineHeight: '1.8', margin: 0 }}>
              <li>Open your mobile phone camera</li>
              <li>Scan the QR code above</li>
              <li>Follow the mobile KYC verification process</li>
              <li>Complete document scanning and face verification</li>
              <li>Return to this page for confirmation</li>
            </ol>
          </div>

          {/* Alternative Link */}
          <div style={{
            background: '#f3e5f5',
            border: '1px solid #9c27b0',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '30px'
          }}>
            <h4 style={{ color: '#7b1fa2', marginBottom: '15px' }}>
              📱 Alternative: Direct Link
            </h4>
            <p style={{ color: '#7b1fa2', marginBottom: '15px', fontSize: '0.9rem' }}>
              Can't scan QR code? Copy this link and open it on your mobile phone:
            </p>
            <div style={{
              background: 'white',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #9c27b0',
              marginBottom: '15px',
              wordBreak: 'break-all',
              fontSize: '0.9rem'
            }}>
              {qrCodeData?.url}
            </div>
            <button
              onClick={copyToClipboard}
              style={{
                padding: '10px 20px',
                background: '#9c27b0',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              📋 Copy Link
            </button>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <button
              onClick={onCancel}
              style={{
                padding: '12px 24px',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              ← Cancel
            </button>
            
            <button
              onClick={createKycSession}
              style={{
                padding: '12px 24px',
                background: '#2196f3',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              🔄 Generate New QR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileKycQrCode;