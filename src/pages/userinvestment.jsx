import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function UserInvestment() {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [availableRates, setAvailableRates] = useState([]);
  const [dailyRate, setDailyRate] = useState('');
  const [payoutFrequency, setPayoutFrequency] = useState('5');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const balRes = await axios.get('https://quickgrowwbackend.onrender.com/api/wallet/balance', getAuthHeaders());
      setBalance(balRes.data.balance);

      const ratesRes = await axios.get('https://quickgrowwbackend.onrender.com/api/admin-investment/rates');
      setAvailableRates(ratesRes.data);

      if (ratesRes.data.length > 0) {
        setDailyRate(ratesRes.data[0].rate);
      }
    } catch (error) {
      if (error.response?.status === 401) navigate('/login');
    }
  };

  const handleInvest = async (e) => {
    e.preventDefault();
    if (Number(amount) < 5000) {
      setMessage('Minimum investment amount is ₹5000');
      return;
    }

    // UPDATED WARNING POPUP
    if (!window.confirm(`WARNING: Your money will be locked for the next 6 months (180 days).\n\nAre you sure you want to lock in ₹${amount} at ${dailyRate}% daily?`)) {
      return;
    }

    try {
      const response = await axios.post(
        'https://quickgrowwbackend.onrender.com/api/investment/invest',
        { amount, dailyRate, payoutFrequency },
        getAuthHeaders()
      );
      setMessage(response.data.message);
      setAmount('');
      fetchData();
      setTimeout(() => navigate('/investment-history'), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Investment failed');
    }
  };

  const selectedRateObj = availableRates.find(r => r.rate === Number(dailyRate));

  const getRiskBadgeColor = (level) => {
    if (level === 'Safest') return '#28a745'; // Green
    if (level === 'Safe') return '#f39c12'; // Orange
    if (level === 'High Risk') return '#ff4757'; // Premium Red
    return '#6c757d';
  };

  // PROFESSIONAL SVG ICONS FOR RISK LEVELS
  const getRiskIcon = (level) => {
    if (level === 'Safest') {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      );
    }
    if (level === 'Safe') {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9 12l2 2 4-4"></path>
        </svg>
      );
    }
    if (level === 'High Risk') {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      );
    }
    return null;
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
          .custom-input, .custom-select {
            background-color: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #ffffff;
            padding: 12px 15px;
            border-radius: 8px;
            font-size: 15px;
            transition: all 0.3s ease;
            outline: none;
            width: 100%;
          }
          .custom-input::placeholder { color: #a8b2d1; }
          .custom-input:focus, .custom-select:focus {
            border-color: #00d27f;
            box-shadow: 0 0 10px rgba(0, 210, 127, 0.2);
            background-color: rgba(255, 255, 255, 0.1);
          }
          .custom-select option {
            background-color: #0a192f;
            color: #ffffff;
          }
          
          .btn-primary {
            background-color: #00d27f; 
            color: white;
            padding: 14px 25px;
            border: none;
            border-radius: 8px;
            font-weight: bold;
            font-size: 15px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 210, 127, 0.2);
            width: 100%;
          }
          .btn-primary:hover {
            background-color: #00b36b;
            box-shadow: 0 8px 20px rgba(0, 210, 127, 0.4);
            transform: translateY(-2px); 
          }

          .btn-outline {
            background-color: transparent;
            color: #a8b2d1;
            padding: 12px 25px;
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            font-weight: bold;
            font-size: 15px;
            cursor: pointer;
            transition: all 0.3s ease;
            width: 100%;
          }
          .btn-outline:hover {
            background-color: rgba(255, 255, 255, 0.05);
            color: #ffffff;
            border-color: rgba(255, 255, 255, 0.4);
            transform: translateY(-2px);
          }

          @media (max-width: 600px) {
            .page-wrapper { padding: 15px 10px !important; }
            .glass-container { padding: 25px 20px !important; border-radius: 16px !important; }
            .rate-row { flex-direction: column !important; align-items: stretch !important; }
            .risk-badge { width: 100% !important; justify-content: center !important; }
          }
        `}
      </style>

      {/* Main Content Wrapper (Used to align Container and Warning perfectly) */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '500px' }}>

        {/* INVESTMENT CONTAINER */}
        <div className="glass-container" style={containerStyle}>

          {/* HEADER */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', gap: '15px', flexWrap: 'wrap' }}>
            <h2 style={titleStyle}>Start Investment</h2>
            <button onClick={() => navigate('/investments')} style={{ width: '36px', height: '36px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: '#ff4757', color: 'white', border: 'none', cursor: 'pointer', flexShrink: 0, boxShadow: '0 4px 10px rgba(255, 71, 87, 0.3)' }} title="Go Back">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
          </div>

          {/* WALLET BALANCE CARD */}
          <div style={balanceCardStyle}>
            <p style={{ margin: '0 0 5px 0', color: '#a8b2d1', fontSize: '14px' }}>Available Wallet Balance:</p>
            <h3 style={{ margin: 0, color: '#00d27f', fontSize: '26px', fontWeight: '900' }}>₹{balance}</h3>
          </div>

          {message && (
            <div style={{
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
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

          {availableRates.length === 0 ? (
            <div style={{ padding: '20px', backgroundColor: 'rgba(255, 193, 7, 0.1)', border: '1px solid #ffc107', color: '#ffc107', borderRadius: '12px', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '15px' }}>Investment plans are currently being updated by the admin. Please check back later!</p>
              <button onClick={() => navigate('/investments')} className="btn-outline" style={{ marginTop: '15px' }}>Go Back</button>
            </div>
          ) : (
            <form onSubmit={handleInvest} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              <div>
                <label style={labelStyle}>Investment Amount (₹) - Min ₹5000</label>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  min="5000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="custom-input"
                />
              </div>

              {/* DYNAMIC RISK ASSESSMENT BADGE UI */}
              <div>
                <label style={labelStyle}>Daily Interest Rate</label>
                <div className="rate-row" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <select
                    value={dailyRate}
                    onChange={(e) => setDailyRate(e.target.value)}
                    required
                    className="custom-select"
                    style={{ flex: 1 }}
                  >
                    {availableRates.map(rateObj => (
                      <option key={rateObj._id} value={rateObj.rate}>{rateObj.rate}% per day</option>
                    ))}
                  </select>

                  {selectedRateObj && (
                    <div className="risk-badge" style={{
                      padding: '12px 15px',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      color: 'white',
                      backgroundColor: getRiskBadgeColor(selectedRateObj.riskLevel),
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                      fontSize: '14px',
                      minWidth: '130px' // Uniform sizing for all badges
                    }}>
                      {getRiskIcon(selectedRateObj.riskLevel)}
                      <span style={{ letterSpacing: '0.5px' }}>{selectedRateObj.riskLevel.toUpperCase()}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label style={labelStyle}>Interest Payout Frequency</label>
                <select
                  value={payoutFrequency}
                  onChange={(e) => setPayoutFrequency(e.target.value)}
                  required
                  className="custom-select"
                >
                  <option value="5">Every 5 Days</option>
                  <option value="10">Every 10 Days</option>
                  <option value="20">Every 20 Days</option>
                  <option value="30">Every 30 Days</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn-primary">Lock Investment</button>
                <button type="button" onClick={() => navigate('/investments')} className="btn-outline">Cancel</button>
              </div>

            </form>
          )}
        </div>

        {/* 180 DAYS LOCK-IN WARNING BOX */}
        <div style={{
          marginTop: '20px',
          padding: '15px 20px',
          backgroundColor: 'rgba(255, 71, 87, 0.05)',
          border: '1px solid rgba(255, 71, 87, 0.3)',
          borderRadius: '12px',
          color: '#ff4757',
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', lineHeight: '1.4' }}>
            Warning: Your money will be securely locked for the next 6 months (180 days).
          </p>
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
  width: '100%',
  boxSizing: 'border-box'
};

const balanceCardStyle = {
  background: 'linear-gradient(135deg, rgba(0, 210, 127, 0.1) 0%, rgba(0, 210, 127, 0.05) 100%)',
  border: '1px solid rgba(0, 210, 127, 0.2)',
  padding: '20px',
  borderRadius: '12px',
  marginBottom: '25px',
  textAlign: 'center'
};

const titleStyle = {
  color: '#ffffff',
  margin: '0',
  fontSize: '24px',
  fontWeight: '800'
};

const labelStyle = {
  display: 'block',
  marginBottom: '6px',
  fontSize: '13px',
  fontWeight: 'bold',
  color: '#a8b2d1',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};