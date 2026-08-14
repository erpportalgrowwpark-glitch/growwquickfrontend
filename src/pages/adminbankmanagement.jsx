import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminBankManagement() {
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [branchName, setBranchName] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const getAdminHeaders = () => {
    const token = localStorage.getItem('adminToken');
    // For this specific GET route we reuse the standard auth token format but passing adminToken
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    const fetchCurrentDetails = async () => {
      try {
        const response = await axios.get('https://quickgrowwbackend.onrender.com/api/admin-bank', getAdminHeaders());
        if (response.data) {
          setBankName(response.data.bankName);
          setAccountName(response.data.accountName);
          setAccountNumber(response.data.accountNumber);
          setIfscCode(response.data.ifscCode);
          setBranchName(response.data.branchName);
        }
      } catch (error) {
        if (error.response?.status === 401) navigate('/admin-login');
      }
    };
    fetchCurrentDetails();
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://quickgrowwbackend.onrender.com/api/admin-bank/update',
        { bankName, accountName, accountNumber, ifscCode, branchName },
        getAdminHeaders()
      );
      setMessage(response.data.message);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update details');
    }
  };

  return (
    <div className="page-wrapper" style={pageStyle}>
      {/* INJECTED CSS FOR PROFESSIONAL STYLING AND MOBILE RESPONSIVENESS */}
      <style>
        {`
          * { box-sizing: border-box; }
          body {
            margin: 0; 
            background: linear-gradient(135deg, #000d22 0%, #002056 50%, #0a192f 100%);
            background-attachment: fixed;
          }
          
          .custom-input {
            background-color: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #ffffff;
            padding: 14px 15px;
            border-radius: 8px;
            font-size: 15px;
            transition: all 0.3s ease;
            outline: none;
            width: 100%;
          }
          .custom-input::placeholder { color: #a8b2d1; }
          .custom-input:focus {
            border-color: #00d27f;
            box-shadow: 0 0 10px rgba(0, 210, 127, 0.2);
            background-color: rgba(255, 255, 255, 0.1);
          }

          .btn-primary {
            background-color: #00d27f; 
            color: white;
            padding: 16px 25px;
            border: none;
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 210, 127, 0.2);
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
          }
          .btn-primary:hover {
            background-color: #00b36b;
            box-shadow: 0 8px 20px rgba(0, 210, 127, 0.4);
            transform: translateY(-2px); 
          }

          .btn-outline {
            background-color: transparent;
            color: #a8b2d1;
            padding: 10px 20px;
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            font-weight: bold;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .btn-outline:hover {
            background-color: rgba(255, 255, 255, 0.05);
            color: #ffffff;
            border-color: rgba(255, 255, 255, 0.4);
            transform: translateY(-2px);
          }

          /* MOBILE RESPONSIVENESS */
          @media (max-width: 600px) {
            .page-wrapper { padding: 15px 10px !important; }
            .glass-container { padding: 25px 20px !important; border-radius: 16px !important; }
          }
        `}
      </style>

      <div className="glass-container" style={containerStyle}>

        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px', gap: '15px', flexWrap: 'wrap' }}>
          <h2 style={titleStyle}>Platform Bank Details</h2>
          <button onClick={() => navigate('/admin-dashboard')} style={{ width: '36px', height: '36px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: '#ff4757', color: 'white', border: 'none', cursor: 'pointer', flexShrink: 0, boxShadow: '0 4px 10px rgba(255, 71, 87, 0.3)' }} title="Go Back">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
        </div>

        <div style={formBoxStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
            <div style={{ backgroundColor: 'rgba(0, 210, 127, 0.1)', padding: '12px', borderRadius: '12px', color: '#00d27f' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="2" y1="10" x2="22" y2="10"></line>
              </svg>
            </div>
            <div>
              <h3 style={{ margin: '0 0 5px 0', color: '#ffffff', fontSize: '18px' }}>Official Receiving Account</h3>
              <p style={{ margin: '0', fontSize: '14px', color: '#a8b2d1', lineHeight: '1.5' }}>
                These details will be securely displayed to all users when they attempt to make a deposit. Ensure they are completely accurate.
              </p>
            </div>
          </div>

          {message && (
            <div style={{
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '25px',
              backgroundColor: message.includes('success') ? 'rgba(0, 210, 127, 0.1)' : 'rgba(220, 53, 69, 0.1)',
              border: `1px solid ${message.includes('success') ? '#00d27f' : '#dc3545'}`,
              color: message.includes('success') ? '#00d27f' : '#ff4757',
              fontWeight: 'bold',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              {message}
            </div>
          )}

          <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            <div>
              <label style={labelStyle}>Bank Name</label>
              <input
                type="text"
                placeholder="e.g. HDFC Bank, ICICI Bank"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                required
                className="custom-input"
              />
            </div>

            <div>
              <label style={labelStyle}>Account Holder Name</label>
              <input
                type="text"
                placeholder="e.g. GrowwPark Pvt Ltd"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                required
                className="custom-input"
              />
            </div>

            <div>
              <label style={labelStyle}>Account Number</label>
              <input
                type="text"
                placeholder="Enter valid account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
                className="custom-input"
                style={{ fontFamily: 'monospace', letterSpacing: '1px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '150px' }}>
                <label style={labelStyle}>IFSC Code</label>
                <input
                  type="text"
                  placeholder="e.g. HDFC0001234"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                  required
                  className="custom-input"
                  style={{ textTransform: 'uppercase' }}
                />
              </div>

              <div style={{ flex: 1, minWidth: '150px' }}>
                <label style={labelStyle}>Branch Name</label>
                <input
                  type="text"
                  placeholder="e.g. MG Road Branch"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  required
                  className="custom-input"
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '15px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              Save & Update Details
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

// STYLES
const pageStyle = {
  background: 'linear-gradient(135deg, #000d22 0%, #002056 50%, #0a192f 100%)',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  padding: '40px 20px',
  boxSizing: 'border-box'
};

const containerStyle = {
  background: 'rgba(10, 25, 47, 0.7)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  padding: '40px',
  borderRadius: '20px',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
  maxWidth: '650px',
  width: '100%',
  boxSizing: 'border-box'
};

const formBoxStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  padding: '30px',
  borderRadius: '16px'
};

const titleStyle = {
  color: '#ffffff',
  margin: '0',
  fontSize: '26px',
  fontWeight: '800',
  letterSpacing: '-0.5px'
};

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontSize: '13px',
  fontWeight: 'bold',
  color: '#a8b2d1',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};