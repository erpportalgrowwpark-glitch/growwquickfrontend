import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function UserInvestmentsHistory() {
  const [investments, setInvestments] = useState([]);
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const invRes = await axios.get('https://quickgrowwbackend.onrender.com/api/investment/my-investments', getAuthHeaders());
        setInvestments(invRes.data);
      } catch (error) {
        if (error.response?.status === 401) navigate('/login');
      }
    };
    fetchInvestments();
  }, [navigate]);

  // HELPER: Format date to Indian standard DD/MM/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // HELPER: Calculate remaining lock-in days (180 days total)
  const calculateDaysRemaining = (dateString) => {
    const lockInDays = 180;
    const createdDate = new Date(dateString);
    const currentDate = new Date();

    // Calculate time difference in milliseconds
    const diffTime = currentDate - createdDate;
    // Convert to days
    const daysPassed = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const daysRemaining = lockInDays - daysPassed;

    return daysRemaining > 0 ? daysRemaining : 0;
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

          /* INVESTMENT CARD DESIGN */
          .inv-card {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 20px 25px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          }
          .inv-card:hover {
            border-color: rgba(0, 210, 127, 0.4);
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            background: linear-gradient(135deg, rgba(0, 210, 127, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
          }

          .card-section {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }

          /* MOBILE RESPONSIVENESS */
          @media (max-width: 600px) {
            .page-wrapper { padding: 15px 10px !important; }
            .glass-container { padding: 25px 20px !important; border-radius: 16px !important; }
            .inv-card {
              flex-direction: column;
              align-items: flex-start;
              gap: 20px;
              padding: 20px;
            }
            .card-section {
              width: 100%;
            }
            .card-center {
              border-top: 1px solid rgba(255, 255, 255, 0.1);
              padding-top: 15px;
            }
            .card-right {
              align-self: flex-start !important;
              text-align: left !important;
            }
          }
        `}
      </style>

      <div className="glass-container" style={containerStyle}>

        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px', gap: '15px', flexWrap: 'wrap' }}>
          <h2 style={titleStyle}>Active Investments</h2>
          <button onClick={() => navigate('/investments')} style={{ width: '36px', height: '36px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: '#ff4757', color: 'white', border: 'none', cursor: 'pointer', flexShrink: 0, boxShadow: '0 4px 10px rgba(255, 71, 87, 0.3)' }} title="Go Back">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
        </div>

        {investments.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#a8b2d1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '15px' }}>
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
            <p style={{ color: '#a8b2d1', margin: 0, fontSize: '16px' }}>You have no active investments yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {investments.map(inv => {
              const daysRemaining = calculateDaysRemaining(inv.createdAt);

              return (
                <div key={inv._id} className="inv-card">

                  {/* Left: Principal Amount, Date & Days Remaining */}
                  <div className="card-section">
                    <p style={{ margin: 0, fontSize: '12px', color: '#8892b0', textTransform: 'uppercase', letterSpacing: '1px' }}>Principal</p>
                    <h3 style={{ margin: '0', color: '#00d27f', fontSize: '24px', fontWeight: '900' }}>₹{inv.principalAmount}</h3>

                    <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#a8b2d1' }}>
                      <span style={{ color: '#ffffff' }}>Locked on:</span> {formatDate(inv.createdAt)}
                    </p>

                    {/* DYNAMIC DAYS REMAINING */}
                    <p style={{
                      margin: '4px 0 0 0',
                      fontSize: '13px',
                      color: daysRemaining > 0 ? '#f39c12' : '#00d27f',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      {daysRemaining > 0 ? (
                        <>⏳ {daysRemaining} Days Remaining</>
                      ) : (
                        <>✅ Unlocked (Matured)</>
                      )}
                    </p>
                  </div>

                  {/* Center: Rates & Frequency */}
                  <div className="card-section card-center" style={{ textAlign: 'left' }}>
                    <p style={{ margin: 0, fontSize: '12px', color: '#8892b0', textTransform: 'uppercase', letterSpacing: '1px' }}>Returns</p>
                    <p style={{ margin: '0', fontWeight: 'bold', color: '#ffffff', fontSize: '16px' }}>{inv.dailyRate}% Daily Rate</p>
                    <p style={{ margin: '0', fontSize: '13px', color: '#0dcaf0', fontWeight: 'bold' }}>Payouts every {inv.payoutFrequency} Days</p>
                  </div>

                  {/* Right: Status */}
                  <div className="card-section card-right" style={{ textAlign: 'right', alignSelf: 'center' }}>
                    <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#8892b0', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</p>
                    <span style={statusBadgeStyle(inv.status)}>
                      {inv.status.toUpperCase()}
                    </span>
                  </div>

                </div>
              );
            })}
          </div>
        )}
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
  maxWidth: '800px',
  width: '100%',
  boxSizing: 'border-box'
};

const titleStyle = {
  color: '#ffffff',
  margin: '0',
  fontSize: '26px',
  fontWeight: '800',
  letterSpacing: '-0.5px'
};

const statusBadgeStyle = (status) => {
  let bg = 'rgba(241, 196, 15, 0.2)'; let col = '#f1c40f'; // Pending yellow
  if (status === 'active' || status === 'approved') { bg = 'rgba(0, 210, 127, 0.2)'; col = '#00d27f'; }
  if (status === 'completed' || status === 'closed') { bg = 'rgba(13, 202, 240, 0.2)'; col = '#0dcaf0'; }
  if (status === 'rejected') { bg = 'rgba(255, 71, 87, 0.2)'; col = '#ff4757'; }
  return {
    padding: '6px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: col,
    backgroundColor: bg,
    whiteSpace: 'nowrap',
    display: 'inline-block'
  };
};