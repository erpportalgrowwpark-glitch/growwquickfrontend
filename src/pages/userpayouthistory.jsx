import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function UserPayoutHistory() {
  const [payouts, setPayouts] = useState([]);
  const [activeInvestments, setActiveInvestments] = useState([]); // Store all active plans
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch wallet history and filter ONLY interest payouts
        const histRes = await axios.get('https://quickgrowwbackend.onrender.com/api/wallet/history', getAuthHeaders());
        const interestData = histRes.data.filter(item => item.type === 'interest');
        setPayouts(interestData);

        // Fetch all active investments
        const invRes = await axios.get('https://quickgrowwbackend.onrender.com/api/investment/my-investments', getAuthHeaders());
        const activePlans = invRes.data.filter(inv => inv.status === 'active');
        setActiveInvestments(activePlans);

      } catch (error) {
        if (error.response?.status === 401) navigate('/login');
      }
    };
    fetchData();
  }, [navigate]);

  // HELPER: Format date to Indian standard DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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

          /* UPCOMING PAYOUT CARD DESIGN */
          .upcoming-card {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-left: 4px solid #00d27f;
            border-radius: 12px;
            padding: 20px 25px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          }
          .upcoming-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            background: linear-gradient(135deg, rgba(0, 210, 127, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
          }

          /* TABLES & WRAPPERS */
          .table-wrapper {
            width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
          .custom-table { width: 100%; border-collapse: collapse; margin-top: 15px; color: #fff; min-width: 500px; }
          .custom-table th { padding: 12px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.1); color: #a8b2d1; }
          .custom-table td { padding: 12px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.05); white-space: nowrap; }

          /* MOBILE RESPONSIVENESS */
          @media (max-width: 600px) {
            .page-wrapper { padding: 15px 10px !important; }
            .glass-container { padding: 25px 20px !important; border-radius: 16px !important; }
            .upcoming-card {
              flex-direction: column;
              align-items: flex-start;
              gap: 20px;
              padding: 20px;
            }
            .card-right {
              align-self: flex-start !important;
              text-align: left !important;
              width: 100%;
              border-top: 1px solid rgba(255, 255, 255, 0.1);
              padding-top: 15px;
            }
          }
        `}
      </style>

      <div className="glass-container" style={containerStyle}>

        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', gap: '15px', flexWrap: 'wrap' }}>
          <h2 style={titleStyle}>Payout History</h2>
          <button onClick={() => navigate('/investments')} style={{ width: '36px', height: '36px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: '#ff4757', color: 'white', border: 'none', cursor: 'pointer', flexShrink: 0, boxShadow: '0 4px 10px rgba(255, 71, 87, 0.3)' }} title="Go Back">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
        </div>

        {/* UPCOMING PAYOUTS SECTION */}
        <h3 style={sectionTitleStyle}>Upcoming Scheduled Payouts</h3>

        {activeInvestments.length === 0 ? (
          <div style={emptyStateStyle}>
            <p style={{ color: '#a8b2d1', margin: 0, fontSize: '15px' }}>You have no active investments scheduled for payouts.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '40px' }}>
            {activeInvestments.map(inv => {
              // Calculate how much interest they will receive on this specific plan
              const expectedInterest = (inv.principalAmount * (inv.dailyRate / 100)) * inv.payoutFrequency;

              return (
                <div key={inv._id} className="upcoming-card">

                  {/* Left Side: Investment Details */}
                  <div>
                    <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#8892b0', textTransform: 'uppercase', letterSpacing: '1px' }}>Investment Plan</p>
                    <p style={{ margin: '0 0 5px 0', fontSize: '16px', color: '#ffffff' }}>
                      <strong style={{ color: '#00d27f', fontSize: '20px' }}>₹{inv.principalAmount}</strong> @ {inv.dailyRate}% Daily
                    </p>
                    <p style={{ margin: '0', fontSize: '14px', color: '#a8b2d1' }}>Frequency: Every <b>{inv.payoutFrequency} Days</b></p>
                  </div>

                  {/* Right Side: Next Payout Details */}
                  <div className="card-right" style={{ textAlign: 'right' }}>
                    <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#8892b0', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px' }}>Next Payout</p>
                    <h2 style={{ margin: '0 0 8px 0', color: '#00d27f', fontSize: '24px' }}>+ ₹{expectedInterest.toFixed(2)}</h2>

                    {/* Formatted Date Badge */}
                    <p style={{
                      margin: '0',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: '#0dcaf0',
                      backgroundColor: 'rgba(13, 202, 240, 0.1)',
                      border: '1px solid rgba(13, 202, 240, 0.2)',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      {formatDate(inv.nextPayoutDate)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* HISTORICAL PAYOUTS SECTION */}
        <h3 style={sectionTitleStyle}>Automated Earnings History</h3>

        {payouts.length === 0 ? (
          <div style={emptyStateStyle}>
            <p style={{ color: '#a8b2d1', margin: 0, fontSize: '15px' }}>No interest payouts received yet. Your automated payouts will appear here.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Date Received</th>
                  <th>Type</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map(item => (
                  <tr key={item._id}>
                    <td>{formatDate(item.createdAt)}</td>
                    <td>
                      <span style={{
                        backgroundColor: 'rgba(13, 202, 240, 0.1)',
                        color: '#0dcaf0',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {item.type.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ color: '#00d27f', fontWeight: 'bold', fontSize: '15px' }}>
                      + ₹{item.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

const sectionTitleStyle = {
  color: '#ffffff',
  borderBottom: '1px solid rgba(255,255,255,0.1)',
  paddingBottom: '12px',
  marginBottom: '20px',
  fontSize: '18px',
  fontWeight: 'bold'
};

const emptyStateStyle = {
  padding: '30px 20px',
  textAlign: 'center',
  background: 'rgba(255,255,255,0.02)',
  borderRadius: '12px',
  border: '1px dashed rgba(255,255,255,0.1)',
  marginBottom: '40px'
};