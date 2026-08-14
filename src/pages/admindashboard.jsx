import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken'); 
    navigate('/'); 
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
          
          /* ADMIN ACTION BUTTONS */
          .admin-btn {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 15px;
            width: 100%;
            padding: 16px 25px;
            border: none;
            border-radius: 12px;
            font-weight: bold;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            color: white;
          }
          
          .btn-wallet { 
            background-color: #0dcaf0; 
            box-shadow: 0 4px 15px rgba(13, 202, 240, 0.2); 
          }
          .btn-wallet:hover { 
            background-color: #31d2f2; 
            transform: translateY(-3px); 
            box-shadow: 0 8px 20px rgba(13, 202, 240, 0.4); 
          }

          .btn-invest { 
            background-color: #f39c12; 
            box-shadow: 0 4px 15px rgba(243, 156, 18, 0.2); 
          }
          .btn-invest:hover { 
            background-color: #f1c40f; 
            transform: translateY(-3px); 
            box-shadow: 0 8px 20px rgba(243, 156, 18, 0.4); 
          }

          .btn-users { 
            background-color: #6f42c1; 
            box-shadow: 0 4px 15px rgba(111, 66, 193, 0.2); 
          }
          .btn-users:hover { 
            background-color: #8352ce; 
            transform: translateY(-3px); 
            box-shadow: 0 8px 20px rgba(111, 66, 193, 0.4); 
          }

          .btn-bank { 
            background-color: #00d27f; 
            box-shadow: 0 4px 15px rgba(0, 210, 127, 0.2); 
          }
          .btn-bank:hover { 
            background-color: #00b36b; 
            transform: translateY(-3px); 
            box-shadow: 0 8px 20px rgba(0, 210, 127, 0.4); 
          }

          /* OUTLINE LOGOUT BUTTON */
          .btn-danger-outline {
            background-color: transparent;
            color: #ff4757;
            padding: 14px 25px;
            border: 2px solid #ff4757;
            border-radius: 12px;
            font-weight: bold;
            font-size: 15px;
            cursor: pointer;
            transition: all 0.3s ease;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
          }
          .btn-danger-outline:hover {
            background-color: rgba(255, 71, 87, 0.1);
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(255, 71, 87, 0.2);
          }

          /* MOBILE RESPONSIVENESS */
          @media (max-width: 600px) {
            .page-wrapper { padding: 15px 10px !important; }
            .glass-container { padding: 30px 20px !important; border-radius: 16px !important; }
            .admin-btn { font-size: 15px; padding: 14px 20px; }
            .logo-box { width: 80px !important; height: 80px !important; margin-bottom: 15px !important; }
          }
        `}
      </style>

      <div className="glass-container" style={containerStyle}>
        
        {/* LOGO INTEGRATION - SQUARE BOX */}
        <div className="logo-box" style={logoContainerStyle}>
          <img src="/growwpark_logo.jpg" alt="GrowwPark Logo" style={logoStyle} />
        </div>

        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
          <h2 style={titleStyle}>Admin Dashboard</h2>
          <p style={subtitleStyle}>Master Control Panel</p>
        </div>
        
        {/* MAIN ACTION BUTTONS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '35px' }}>
          
          <button onClick={() => navigate('/admin-wallet')} className="admin-btn btn-wallet">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="2" y1="10" x2="22" y2="10"></line>
            </svg>
            Wallet Management
          </button>
          
          <button onClick={() => navigate('/admin-investment')} className="admin-btn btn-invest">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
              <polyline points="17 6 23 6 23 12"></polyline>
            </svg>
            Investment Management
          </button>
          
          <button onClick={() => navigate('/admin-users')} className="admin-btn btn-users">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Manage Users
          </button>

          <button onClick={() => navigate('/admin-bank')} className="admin-btn btn-bank">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 22 7 12 2"></polygon>
              <polyline points="2 17 22 17"></polyline>
              <polyline points="2 22 22 22"></polyline>
              <line x1="6" y1="17" x2="6" y2="9"></line>
              <line x1="18" y1="17" x2="18" y2="9"></line>
              <line x1="12" y1="17" x2="12" y2="9"></line>
            </svg>
            Update Bank Details
          </button>

        </div>

        {/* LOGOUT BUTTON */}
        <button onClick={handleLogout} className="btn-danger-outline">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Logout Admin
        </button>

      </div>
    </div>
  );
}

// STYLES
const pageStyle = {
  background: 'linear-gradient(135deg, #000d22 0%, #002056 50%, #0a192f 100%)', 
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
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
  padding: '40px 30px',
  borderRadius: '20px', 
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)', 
  maxWidth: '500px',
  width: '100%',
  boxSizing: 'border-box'
};

const logoContainerStyle = {
  width: '90px',
  height: '90px',
  backgroundColor: '#ffffff', 
  borderRadius: '12px', 
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 20px auto', 
  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)' 
};

const logoStyle = {
  maxWidth: '85%', 
  maxHeight: '85%',
  objectFit: 'contain' 
};

const titleStyle = {
  color: '#ffffff', 
  margin: '0 0 5px 0',
  fontSize: '28px',
  fontWeight: '800',
  letterSpacing: '-0.5px'
};

const subtitleStyle = {
  color: '#00d27f',
  margin: '0',
  fontSize: '14px',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: '2px'
};