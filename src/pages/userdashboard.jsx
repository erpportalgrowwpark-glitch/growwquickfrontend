import { useNavigate } from 'react-router-dom';

export default function UserDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/'); 
  };

  return (
    <div style={pageStyle}>
      {/* INJECTED CSS FOR HOVERS AND BUTTON EFFECTS */}
      <style>
        {`
          body {
            margin: 0; 
            background: linear-gradient(135deg, #000d22 0%, #002056 50%, #0a192f 100%);
            background-attachment: fixed;
          }
          .btn-primary {
            background-color: #00d27f; 
            color: white;
            padding: 16px 30px;
            border: none;
            border-radius: 10px;
            font-weight: bold;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
            transform: translateY(-3px); 
          }
          .btn-danger {
            background-color: transparent; 
            color: #ff4757;
            padding: 14px 30px;
            border: 2px solid #ff4757;
            border-radius: 10px;
            font-weight: bold;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            width: 100%;
            margin-top: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
          }
          .btn-danger:hover {
            background-color: #ff4757;
            color: white;
            box-shadow: 0 8px 20px rgba(255, 71, 87, 0.3);
            transform: translateY(-2px); 
          }
        `}
      </style>

      <div style={containerStyle}>
        {/* LOGO INTEGRATION - SQUARE BOX */}
        <div style={logoContainerStyle}>
          <img src="/growwpark_logo.jpg" alt="GrowwPark Logo" style={logoStyle} />
        </div>

        <h2 style={titleStyle}>User Dashboard</h2>
        <p style={subtitleStyle}>Manage your wealth and investments</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '30px' }}>
          <button onClick={() => navigate('/wallet')} className="btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
              <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
            </svg>
            Access My Wallet
          </button>
          
          <button onClick={() => navigate('/investments')} className="btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
              <polyline points="17 6 23 6 23 12"></polyline>
            </svg>
            Manage Investments
          </button>
          
          <button onClick={handleLogout} className="btn-danger">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout Session
          </button>
        </div>
      </div>
    </div>
  );
}

// INLINE STYLES
const pageStyle = {
  background: 'linear-gradient(135deg, #000d22 0%, #002056 50%, #0a192f 100%)', 
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  padding: '20px',
  boxSizing: 'border-box'
};

const containerStyle = {
  background: 'rgba(10, 25, 47, 0.7)', 
  backdropFilter: 'blur(16px)', 
  WebkitBackdropFilter: 'blur(16px)', 
  border: '1px solid rgba(255, 255, 255, 0.2)', 
  padding: '50px 40px',
  borderRadius: '20px', 
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)', 
  textAlign: 'center',
  maxWidth: '450px',
  width: '100%'
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
  margin: '0 0 10px 0',
  fontSize: '26px',
  fontWeight: '800',
  letterSpacing: '-0.5px'
};

const subtitleStyle = {
  color: '#a8b2d1',
  margin: '0 0 10px 0',
  fontSize: '15px',
  lineHeight: '1.6'
};