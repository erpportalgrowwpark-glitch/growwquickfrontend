import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminUserTransactionHistory() {
  const { id } = useParams(); // Gets the userId from the URL
  const [userData, setUserData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  
  // Tab State for History Filtering
  const [historyTab, setHistoryTab] = useState('deposit'); // 'deposit', 'withdraw', 'interest'
  
  const navigate = useNavigate();

  const getAdminHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    const fetchUserHistory = async () => {
      try {
        const response = await axios.get(`https://quickgrowwbackend.onrender.com/api/admin/users/${id}/transactions`, getAdminHeaders());
        setUserData(response.data.user);
        setTransactions(response.data.transactions);
      } catch (error) {
        if (error.response?.status === 401) navigate('/admin-login');
        console.error('Error fetching data', error);
      }
    };
    fetchUserHistory();
  }, [id, navigate]);

  // HELPER: Format date to Indian standard DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const time = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    return `${day}/${month}/${year} ${time}`;
  };

  // Pre-calculate counts for the history sub-tabs
  const depositCount = transactions.filter(item => item.type === 'deposit').length;
  const withdrawCount = transactions.filter(item => item.type === 'withdraw').length;
  const interestCount = transactions.filter(item => item.type === 'interest').length;
  
  // Filtered transactions for the active tab
  const filteredTransactions = transactions.filter(item => item.type === historyTab);

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

          /* HISTORY SUB-TABS (PILLS) */
          .sub-tab-container {
            display: flex; justify-content: center; background: rgba(255, 255, 255, 0.05); padding: 6px; border-radius: 12px; margin-bottom: 25px; border: 1px solid rgba(255, 255, 255, 0.1); flex-wrap: wrap; gap: 5px;
          }
          .sub-tab-btn {
            background: transparent; border: none; color: #a8b2d1; padding: 10px 20px; cursor: pointer; font-weight: bold; font-size: 14px; border-radius: 8px; transition: all 0.3s ease; flex: 1; text-align: center; min-width: 100px; display: flex; align-items: center; justify-content: center; gap: 8px;
          }
          .sub-tab-btn.active { background-color: #0dcaf0; color: #ffffff; box-shadow: 0 4px 10px rgba(13, 202, 240, 0.3); }
          .sub-tab-btn:hover:not(.active) { background-color: rgba(255, 255, 255, 0.1); color: #ffffff; }

          /* COUNT BADGE INSIDE PILLS */
          .count-badge {
            background: rgba(0,0,0,0.3); padding: 2px 8px; border-radius: 10px; font-size: 12px; font-weight: bold;
          }
          .sub-tab-btn.active .count-badge { background: rgba(255,255,255,0.2); color: white; }

          /* TABLES & WRAPPERS */
          .table-wrapper {
            width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(0, 0, 0, 0.1);
          }
          .custom-table { width: 100%; border-collapse: collapse; color: #fff; min-width: 600px; }
          .custom-table th { 
            padding: 16px; 
            text-align: left; 
            border-bottom: 1px solid rgba(255,255,255,0.1); 
            color: #a8b2d1; 
            font-size: 13px; 
            text-transform: uppercase; 
            letter-spacing: 1px; 
            background: rgba(255, 255, 255, 0.02);
          }
          .custom-table td { 
            padding: 16px; 
            text-align: left; 
            border-bottom: 1px solid rgba(255,255,255,0.05); 
            white-space: nowrap; 
          }
          .custom-table tr:hover td {
            background: rgba(255, 255, 255, 0.03);
          }
          .custom-table tr:last-child td {
            border-bottom: none;
          }

          /* MOBILE RESPONSIVENESS */
          @media (max-width: 600px) {
            .page-wrapper { padding: 15px 10px !important; }
            .glass-container { padding: 25px 15px !important; border-radius: 16px !important; }
            .header-action { margin-bottom: 20px; }
            .user-info-card { flex-direction: column; align-items: flex-start; gap: 15px; }
            .user-info-right { text-align: left !important; border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 15px; width: 100%; }
            .sub-tab-btn { font-size: 12px; padding: 8px 5px; min-width: auto; }
          }
        `}
      </style>

      <div className="glass-container" style={containerStyle}>
        
        {/* HEADER */}
        <div className="header-action" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <h2 style={titleStyle}>User Transactions</h2>
          <button onClick={() => navigate('/admin-users')} className="btn-outline">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back
          </button>
        </div>

        {/* USER INFO PROFILE CARD */}
        {userData && (
          <div className="user-info-card" style={userInfoCardStyle}>
            <div>
              <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#a8b2d1', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Account Owner</p>
              <h3 style={{ margin: '0 0 5px 0', color: '#ffffff', fontSize: '22px' }}>{userData.name}</h3>
              <p style={{ margin: '0', color: '#8892b0', fontSize: '14px' }}>{userData.email}</p>
            </div>
            <div className="user-info-right" style={{ textAlign: 'right' }}>
              <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#a8b2d1', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Current Balance</p>
              <h3 style={{ margin: '0', color: '#00d27f', fontSize: '28px', fontWeight: '900' }}>₹{userData.walletBalance?.toFixed(2)}</h3>
            </div>
          </div>
        )}

        {/* HISTORY SUB-TABS (PILLS) */}
        <div className="sub-tab-container">
          <button className={`sub-tab-btn ${historyTab === 'deposit' ? 'active' : ''}`} onClick={() => setHistoryTab('deposit')}>
            Deposits <span className="count-badge">{depositCount}</span>
          </button>
          <button className={`sub-tab-btn ${historyTab === 'withdraw' ? 'active' : ''}`} onClick={() => setHistoryTab('withdraw')}>
            Withdrawals <span className="count-badge">{withdrawCount}</span>
          </button>
          <button className={`sub-tab-btn ${historyTab === 'interest' ? 'active' : ''}`} onClick={() => setHistoryTab('interest')}>
            Interest <span className="count-badge">{interestCount}</span>
          </button>
        </div>

        {/* TRANSACTION LIST SECTION */}
        {filteredTransactions.length === 0 ? (
          <div style={emptyStateStyle}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#a8b2d1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '15px' }}>
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <p style={{ color: '#a8b2d1', margin: 0, fontSize: '16px' }}>This user has no {historyTab} transactions yet.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map(item => (
                  <tr key={item._id}>
                    <td style={{ color: '#a8b2d1', fontSize: '14px' }}>
                      {formatDate(item.createdAt)}
                    </td>
                    <td>
                      <span style={{ 
                        color: item.type === 'withdraw' ? '#ff4757' : (item.type === 'deposit' ? '#00d27f' : '#0dcaf0'),
                        backgroundColor: item.type === 'withdraw' ? 'rgba(255,71,87,0.1)' : (item.type === 'deposit' ? 'rgba(0,210,127,0.1)' : 'rgba(13,202,240,0.1)'),
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        fontSize: '12px'
                      }}>
                        {item.type.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ color: item.type === 'withdraw' ? '#ff4757' : '#00d27f', fontWeight: 'bold', fontSize: '16px' }}>
                      {item.type === 'withdraw' ? '-' : '+'} ₹{item.amount}
                    </td>
                    <td>
                      <span style={statusBadgeStyle(item.status)}>
                        {item.status.toUpperCase()}
                      </span>
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
  maxWidth: '900px',
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

const userInfoCardStyle = {
  padding: '25px', 
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)', 
  borderRadius: '16px', 
  marginBottom: '30px', 
  display: 'flex', 
  justifyContent: 'space-between',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  alignItems: 'center'
};

const emptyStateStyle = {
  padding: '60px 20px', 
  textAlign: 'center', 
  background: 'rgba(255,255,255,0.02)', 
  borderRadius: '12px', 
  border: '1px dashed rgba(255,255,255,0.1)'
};

const statusBadgeStyle = (status) => {
  let bg = 'rgba(241, 196, 15, 0.2)'; let col = '#f1c40f'; // Pending yellow
  if (status === 'approved') { bg = 'rgba(0, 210, 127, 0.2)'; col = '#00d27f'; }
  if (status === 'rejected') { bg = 'rgba(255, 71, 87, 0.2)'; col = '#ff4757'; }
  return { 
    padding: '6px 12px', 
    borderRadius: '12px', 
    fontSize: '12px', 
    fontWeight: 'bold', 
    color: col, 
    backgroundColor: bg,
    whiteSpace: 'nowrap'
  };
};