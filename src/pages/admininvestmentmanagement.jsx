import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminInvestmentManagement() {
  const [rates, setRates] = useState([]);
  const [newRate, setNewRate] = useState('');
  const [riskLevel, setRiskLevel] = useState('Safe'); // Default risk level
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const getAdminHeaders = () => {
    const adminToken = localStorage.getItem('adminToken');
    return { headers: { Authorization: `Bearer ${adminToken}` } };
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      const response = await axios.get('https://quickgrowwbackend.onrender.com/api/admin-investment/rates');
      setRates(response.data);
    } catch (error) {
      console.error('Error fetching rates', error);
    }
  };

  const handleAddRate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://quickgrowwbackend.onrender.com/api/admin-investment/rates',
        { rate: newRate, riskLevel },
        getAdminHeaders()
      );
      setMessage(response.data.message);
      setNewRate('');
      setRiskLevel('Safe'); // Reset to default
      fetchRates();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to add rate');
    }
  };

  const handleDeleteRate = async (id) => {
    if (!window.confirm('Are you sure you want to delete this percentage?')) return;
    try {
      const response = await axios.delete(`https://quickgrowwbackend.onrender.com/api/admin-investment/rates/${id}`, getAdminHeaders());
      setMessage(response.data.message);
      fetchRates();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to delete rate');
    }
  };

  const getRiskBadgeColor = (level) => {
    if (level === 'Safest') return '#00d27f'; // Brand Green
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

          .btn-danger-outline {
            background-color: transparent;
            color: #ff4757;
            padding: 10px 20px;
            border: 2px solid #ff4757;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .btn-danger-outline:hover {
            background-color: rgba(255, 71, 87, 0.1);
            transform: translateY(-2px);
          }

          /* RATE CARD DESIGN */
          .rate-card {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 20px 25px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.3s ease;
          }
          .rate-card:hover {
            border-color: rgba(0, 210, 127, 0.4);
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
          }

          /* RISK TOGGLE BUTTONS */
          .risk-toggle-btn {
            flex: 1;
            padding: 12px 10px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            transition: all 0.2s ease;
            white-space: nowrap;
          }

          /* MOBILE RESPONSIVENESS */
          @media (max-width: 600px) {
            .page-wrapper { padding: 15px 10px !important; }
            .glass-container { padding: 25px 20px !important; border-radius: 16px !important; }
            .rate-card {
              flex-direction: column;
              align-items: flex-start;
              gap: 15px;
              padding: 20px;
            }
            .rate-card-actions { width: 100%; display: flex; justify-content: flex-end; }
            .risk-toggles { flex-direction: column; }
          }
        `}
      </style>

      <div className="glass-container" style={containerStyle}>

        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px', gap: '15px', flexWrap: 'wrap' }}>
          <h2 style={titleStyle}>Investment Rates</h2>
          <button onClick={() => navigate('/admin-dashboard')} style={{ width: '36px', height: '36px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: '#ff4757', color: 'white', border: 'none', cursor: 'pointer', flexShrink: 0, boxShadow: '0 4px 10px rgba(255, 71, 87, 0.3)' }} title="Go Back">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
        </div>

        {/* ADD NEW RATE FORM */}
        <div style={formBoxStyle}>
          <h3 style={sectionTitleStyle}>Add New Percentage Option</h3>

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

          <form onSubmit={handleAddRate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            <div>
              <label style={labelStyle}>Percentage Rate (%)</label>
              <input
                type="number" step="0.01" placeholder="e.g. 1.5" required
                value={newRate} onChange={(e) => setNewRate(e.target.value)}
                className="custom-input"
              />
            </div>

            <div>
              <label style={labelStyle}>Risk Assessment Tag</label>
              <div className="risk-toggles" style={{ display: 'flex', gap: '10px' }}>
                {['Safest', 'Safe', 'High Risk'].map(level => {
                  const isActive = riskLevel === level;
                  const activeColor = getRiskBadgeColor(level);
                  return (
                    <button
                      type="button"
                      key={level}
                      onClick={() => setRiskLevel(level)}
                      className="risk-toggle-btn"
                      style={{
                        border: `2px solid ${isActive ? activeColor : 'rgba(255,255,255,0.2)'}`,
                        backgroundColor: isActive ? activeColor : 'rgba(255,255,255,0.02)',
                        color: isActive ? '#fff' : '#a8b2d1',
                        boxShadow: isActive ? `0 4px 10px ${activeColor}40` : 'none'
                      }}
                    >
                      {getRiskIcon(level)}
                      {level}
                    </button>
                  );
                })}
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
              Save & Publish Rate
            </button>
          </form>
        </div>

        {/* ACTIVE RATES LIST */}
        <h3 style={{ ...sectionTitleStyle, marginTop: '40px' }}>Active Available Rates</h3>

        {rates.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
            <p style={{ color: '#a8b2d1', margin: 0, fontSize: '15px' }}>No interest rates added yet. Users cannot make investments right now.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {rates.map(rateObj => {
              const riskTag = rateObj.riskLevel || 'NO LEVEL';
              return (
                <div key={rateObj._id} className="rate-card">

                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div>
                      <p style={{ margin: '0 0 5px 0', fontSize: '11px', color: '#8892b0', textTransform: 'uppercase', letterSpacing: '1px' }}>Daily Rate</p>
                      <h2 style={{ margin: 0, color: '#00d27f', fontSize: '28px', fontWeight: '900' }}>{rateObj.rate}%</h2>
                    </div>

                    <div style={{
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: `1px solid ${getRiskBadgeColor(riskTag)}`,
                      color: getRiskBadgeColor(riskTag),
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {getRiskIcon(riskTag)}
                      {riskTag}
                    </div>
                  </div>

                  <div className="rate-card-actions">
                    <button onClick={() => handleDeleteRate(rateObj._id)} className="btn-danger-outline" style={{ padding: '10px 20px' }}>
                      Delete Rate
                    </button>
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
  maxWidth: '700px',
  width: '100%',
  boxSizing: 'border-box'
};

const formBoxStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  padding: '30px',
  borderRadius: '16px',
  marginBottom: '20px'
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
  margin: '0 0 20px 0',
  fontSize: '18px',
  fontWeight: 'bold',
  borderBottom: '2px solid rgba(0, 210, 127, 0.3)',
  paddingBottom: '10px',
  display: 'inline-block'
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