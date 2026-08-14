import { useNavigate } from 'react-router-dom';

export default function UserInvestmentHub() {
  const navigate = useNavigate();

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
          
          /* HUB ACTION BUTTONS */
          .hub-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            width: 100%;
            padding: 16px 25px;
            border: none;
            border-radius: 12px;
            font-weight: bold;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .btn-invest { 
            background-color: #00d27f; 
            color: white; 
            box-shadow: 0 4px 15px rgba(0, 210, 127, 0.2); 
          }
          .btn-invest:hover { 
            background-color: #00b36b; 
            transform: translateY(-3px); 
            box-shadow: 0 8px 20px rgba(0, 210, 127, 0.4); 
          }

          .btn-view { 
            background-color: #0dcaf0; 
            color: white; 
            box-shadow: 0 4px 15px rgba(13, 202, 240, 0.2); 
          }
          .btn-view:hover { 
            background-color: #31d2f2; 
            transform: translateY(-3px); 
            box-shadow: 0 8px 20px rgba(13, 202, 240, 0.4); 
          }

          .btn-payout { 
            background-color: #f39c12; 
            color: white; 
            box-shadow: 0 4px 15px rgba(243, 156, 18, 0.2); 
          }
          .btn-payout:hover { 
            background-color: #f1c40f; 
            transform: translateY(-3px); 
            box-shadow: 0 8px 20px rgba(243, 156, 18, 0.4); 
          }

          /* OUTLINE BACK BUTTON */
          .btn-outline {
            background-color: transparent;
            color: #a8b2d1;
            padding: 14px 25px;
            border: 2px solid rgba(255, 255, 255, 0.2);
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
          .btn-outline:hover {
            background-color: rgba(255, 255, 255, 0.05);
            color: #ffffff;
            border-color: rgba(255, 255, 255, 0.4);
            transform: translateY(-2px);
          }

          /* MOBILE RESPONSIVENESS */
          @media (max-width: 600px) {
            .page-wrapper { padding: 15px 10px !important; }
            .glass-container { padding: 30px 20px !important; border-radius: 16px !important; }
            .hub-btn { font-size: 15px; padding: 14px 20px; }
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
          <h2 style={titleStyle}>Investment Hub</h2>
          <p style={subtitleStyle}>Manage your active investments and track payouts.</p>
        </div>
        
        {/* MAIN ACTION BUTTONS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '35px' }}>
          
          <button onClick={() => navigate('/invest-now')} className="hub-btn btn-invest">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
              <polyline points="17 6 23 6 23 12"></polyline>
            </svg>
            Start New Investment
          </button>
          
          <button onClick={() => navigate('/investment-history')} className="hub-btn btn-view">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
              <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
            </svg>
            View Active Investments
          </button>
          
          <button onClick={() => navigate('/payout-history')} className="hub-btn btn-payout">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            Track Payout History
          </button>

        </div>

        {/* BACK BUTTON */}
        <button onClick={() => navigate('/dashboard')} className="btn-outline">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Dashboard
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
  margin: '0 0 10px 0',
  fontSize: '28px',
  fontWeight: '800',
  letterSpacing: '-0.5px'
};

const subtitleStyle = {
  color: '#a8b2d1',
  margin: '0',
  fontSize: '15px',
  lineHeight: '1.6'
};