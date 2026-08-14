import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminWalletManagement() {
  // Main Tab State (Pending vs History)
  const [activeTab, setActiveTab] = useState('pending');

  // Sub Tab State for History Filtering
  const [historyTab, setHistoryTab] = useState('deposit'); // 'deposit', 'withdraw', 'interest'

  const [requests, setRequests] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const navigate = useNavigate();

  const getAdminHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    fetchRequests();
    fetchHistory();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('https://quickgrowwbackend.onrender.com/api/admin/wallet/requests', getAdminHeaders());
      setRequests(response.data);
    } catch (error) {
      if (error.response?.status === 401) navigate('/admin-login');
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await axios.get('https://quickgrowwbackend.onrender.com/api/admin/wallet/history', getAdminHeaders());
      setHistory(response.data);
    } catch (error) {
      console.error('Failed to fetch history', error);
    }
  };

  const handleResolve = async (requestId, action) => {
    try {
      await axios.post('https://quickgrowwbackend.onrender.com/api/admin/wallet/resolve', { requestId, action }, getAdminHeaders());
      fetchRequests();
      fetchHistory();
      setSelectedRequest(null);
    } catch (error) {
      alert('Error resolving request');
    }
  };

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
  const depositCount = history.filter(item => item.type === 'deposit').length;
  const withdrawCount = history.filter(item => item.type === 'withdraw').length;
  const interestCount = history.filter(item => item.type === 'interest').length;

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
          
          /* BUTTONS */
          .btn-primary { background-color: #00d27f; color: white; padding: 12px 20px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; transition: all 0.3s ease; }
          .btn-primary:hover { background-color: #00b36b; transform: translateY(-2px); }
          
          .btn-danger { background-color: #ff4757; color: white; padding: 12px 20px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; transition: all 0.3s ease; }
          .btn-danger:hover { background-color: #ff6b81; transform: translateY(-2px); }

          .btn-outline { background-color: transparent; color: #a8b2d1; padding: 8px 15px; border: 2px solid rgba(255, 255, 255, 0.2); border-radius: 8px; font-weight: bold; font-size: 13px; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; gap: 6px; }
          .btn-outline:hover { background-color: rgba(255, 255, 255, 0.05); color: #ffffff; border-color: rgba(255, 255, 255, 0.4); transform: translateY(-2px); }

          /* MAIN TABS */
          .main-tab {
            background: transparent; border: none; color: #a8b2d1; padding: 15px 25px; cursor: pointer; font-weight: bold; font-size: 16px; border-bottom: 3px solid transparent; transition: all 0.3s ease; flex: 1; text-align: center; position: relative;
          }
          .main-tab.active { color: #0dcaf0; border-bottom: 3px solid #0dcaf0; }
          .main-tab:hover:not(.active) { color: #ffffff; background: rgba(255,255,255,0.02); }

          /* HISTORY SUB-TABS (PILLS) */
          .sub-tab-container {
            display: flex; justify-content: center; background: rgba(255, 255, 255, 0.05); padding: 6px; border-radius: 12px; margin-bottom: 20px; border: 1px solid rgba(255, 255, 255, 0.1); flex-wrap: wrap; gap: 5px;
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

          /* TABLES */
          .table-wrapper { width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .custom-table { width: 100%; border-collapse: collapse; color: #fff; min-width: 500px; }
          .custom-table th { padding: 15px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.1); color: #a8b2d1; background: rgba(0,0,0,0.2); font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
          .custom-table td { padding: 15px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.05); white-space: nowrap; font-size: 15px; }
          .custom-table tr:hover { background: rgba(255,255,255,0.02); }

          /* NOTIFICATION BADGE FOR PENDING TAB */
          .notif-badge {
            background: #ff4757; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; margin-left: 8px; font-weight: 900; box-shadow: 0 2px 5px rgba(255,71,87,0.4);
          }

          /* MOBILE RESPONSIVENESS */
          @media (max-width: 600px) {
            .page-wrapper { padding: 15px 10px !important; }
            .glass-container { padding: 20px 15px !important; border-radius: 16px !important; }
            .main-tab { font-size: 14px; padding: 12px 10px; }
            .sub-tab-btn { font-size: 12px; padding: 8px 5px; min-width: auto; }
            .modal-content { padding: 20px 15px !important; width: 95% !important; }
            .modal-actions { flex-direction: column; gap: 10px; }
            .modal-actions button { width: 100%; }
          }
        `}
      </style>

      <div className="glass-container" style={containerStyle}>

        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '15px', flexWrap: 'wrap' }}>
          <h2 style={titleStyle}>Wallet Management</h2>
          <button onClick={() => navigate('/admin-dashboard')} style={{ width: '36px', height: '36px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: '#ff4757', color: 'white', border: 'none', cursor: 'pointer', flexShrink: 0, boxShadow: '0 4px 10px rgba(255, 71, 87, 0.3)' }} title="Go Back">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
        </div>

        {/* MAIN TABS (Pending vs History) */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '25px', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '12px 12px 0 0', overflow: 'hidden' }}>
          <button
            onClick={() => setActiveTab('pending')}
            className={`main-tab ${activeTab === 'pending' ? 'active' : ''}`}
          >
            Pending Requests
            {requests.length > 0 && <span className="notif-badge">{requests.length}</span>}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`main-tab ${activeTab === 'history' ? 'active' : ''}`}
          >
            Resolution History
          </button>
        </div>

        {/* --- PENDING REQUESTS VIEW --- */}
        {activeTab === 'pending' && (
          requests.length === 0 ? (
            <div style={emptyStateStyle}>
              <p style={{ margin: 0, color: '#00d27f', fontSize: '16px', fontWeight: 'bold' }}>All caught up! No pending requests.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Request Type</th>
                    <th>Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map(req => (
                    <tr key={req._id}>
                      <td style={{ fontWeight: 'bold' }}>{req.userId?.name || 'Unknown User'}</td>
                      <td>
                        <span style={{
                          color: req.type === 'deposit' ? '#00d27f' : '#ff4757',
                          backgroundColor: req.type === 'deposit' ? 'rgba(0,210,127,0.1)' : 'rgba(255,71,87,0.1)',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontWeight: 'bold',
                          fontSize: '12px'
                        }}>
                          {req.type.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ fontWeight: 'bold' }}>₹{req.amount}</td>
                      <td>
                        <button
                          onClick={() => setSelectedRequest(req)}
                          style={{ backgroundColor: '#0dcaf0', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', boxShadow: '0 2px 5px rgba(13,202,240,0.3)' }}
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* --- TRANSACTION HISTORY VIEW --- */}
        {activeTab === 'history' && (
          <div>
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

            {/* FILTERED HISTORY TABLE */}
            {history.filter(item => item.type === historyTab).length === 0 ? (
              <div style={emptyStateStyle}>
                <p style={{ margin: 0, color: '#a8b2d1' }}>No resolved {historyTab} history found.</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Date Resolved</th>
                      <th>User</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.filter(item => item.type === historyTab).map(item => (
                      <tr key={item._id}>
                        <td style={{ color: '#a8b2d1', fontSize: '13px' }}>{formatDate(item.updatedAt)}</td>
                        <td style={{ fontWeight: 'bold' }}>{item.userId?.name || 'Unknown User'}</td>
                        <td style={{ color: item.type === 'withdraw' ? '#ff4757' : '#00d27f', fontWeight: 'bold' }}>
                          {item.type === 'withdraw' ? '-' : '+'} ₹{item.amount}
                        </td>
                        <td><span style={statusBadgeStyle(item.status)}>{item.status.toUpperCase()}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* VIEW DETAILS MODAL */}
      {selectedRequest && (
        <div style={modalOverlayStyle}>
          <div className="modal-content" style={modalContentStyle}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px', marginBottom: '20px', gap: '15px', flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0, color: 'white', fontSize: '20px' }}>Review {selectedRequest.type.toUpperCase()}</h3>
              <button onClick={() => setSelectedRequest(null)} style={{ background: 'none', border: 'none', color: '#a8b2d1', cursor: 'pointer', fontSize: '24px', lineHeight: 1 }}>&times;</button>
            </div>

            <div style={modalDataBoxStyle}>
              <p style={detailRowStyle}><span style={detailLabelStyle}>User:</span> <span style={detailValueStyle}>{selectedRequest.userId?.name}</span></p>
              <p style={detailRowStyle}><span style={detailLabelStyle}>Email:</span> <span style={detailValueStyle}>{selectedRequest.userId?.email}</span></p>

              {/* DISPLAY DEPOSIT LOGIC */}
              {selectedRequest.type === 'deposit' && (
                <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
                  <p style={detailRowStyle}><span style={detailLabelStyle}>Requested Amount:</span> <span style={{ ...detailValueStyle, color: '#00d27f', fontSize: '18px' }}>₹{selectedRequest.amount}</span></p>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px', marginTop: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <p style={{ margin: '0 0 5px 0', fontSize: '11px', color: '#a8b2d1', textTransform: 'uppercase', letterSpacing: '1px' }}>UTR / Transaction ID</p>
                    <p style={{ margin: 0, color: 'white', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '1px' }}>{selectedRequest.utr}</p>
                  </div>
                </div>
              )}

              {/* DISPLAY WITHDRAWAL LOGIC WITH TDS */}
              {selectedRequest.type === 'withdraw' && (
                <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
                  <p style={detailRowStyle}><span style={detailLabelStyle}>Gross Amount:</span> <span style={detailValueStyle}>₹{selectedRequest.amount}</span></p>
                  <p style={detailRowStyle}><span style={detailLabelStyle}>TDS (1%):</span> <span style={{ ...detailValueStyle, color: '#ff4757' }}>- ₹{selectedRequest.tdsAmount}</span></p>

                  <div style={{ backgroundColor: 'rgba(0, 210, 127, 0.1)', border: '1px solid rgba(0, 210, 127, 0.3)', padding: '15px', borderRadius: '8px', marginTop: '15px', textAlign: 'center' }}>
                    <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#00d27f', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Net Amount to Pay</p>
                    <p style={{ margin: 0, color: '#00d27f', fontSize: '28px', fontWeight: '900' }}>₹{selectedRequest.netAmount}</p>
                  </div>

                  <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px', marginTop: '15px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#a8b2d1', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>User Bank Details</p>
                    <p style={detailRowStyle}><span style={detailLabelStyle}>Bank:</span> <span style={detailValueStyle}>{selectedRequest.bankName}</span></p>
                    <p style={detailRowStyle}><span style={detailLabelStyle}>Branch:</span> <span style={detailValueStyle}>{selectedRequest.branchName}</span></p>
                    <p style={detailRowStyle}><span style={detailLabelStyle}>A/C No:</span> <span style={{ ...detailValueStyle, fontFamily: 'monospace' }}>{selectedRequest.accountNumber}</span></p>
                    <p style={detailRowStyle}><span style={detailLabelStyle}>IFSC:</span> <span style={{ ...detailValueStyle, fontFamily: 'monospace' }}>{selectedRequest.ifscCode}</span></p>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-actions" style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
              <button onClick={() => handleResolve(selectedRequest._id, 'accept')} className="btn-primary" style={{ flex: 1 }}>Approve & Pay</button>
              <button onClick={() => handleResolve(selectedRequest._id, 'reject')} className="btn-danger" style={{ flex: 1 }}>Reject</button>
            </div>

          </div>
        </div>
      )}
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

const emptyStateStyle = {
  padding: '40px 20px',
  textAlign: 'center',
  background: 'rgba(255,255,255,0.02)',
  borderRadius: '12px',
  border: '1px dashed rgba(255,255,255,0.1)'
};

const statusBadgeStyle = (status) => {
  let bg = 'rgba(241, 196, 15, 0.2)'; let col = '#f1c40f'; // Pending yellow
  if (status === 'approved') { bg = 'rgba(0, 210, 127, 0.2)'; col = '#00d27f'; }
  if (status === 'rejected') { bg = 'rgba(255, 71, 87, 0.2)'; col = '#ff4757'; }
  return { padding: '5px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', color: col, backgroundColor: bg, whiteSpace: 'nowrap' };
};

/* MODAL STYLES */
const modalOverlayStyle = {
  position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
  backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  padding: '15px', boxSizing: 'border-box'
};

const modalContentStyle = {
  background: 'linear-gradient(135deg, #112240 0%, #0a192f 100%)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  padding: '30px',
  borderRadius: '16px',
  maxWidth: '450px',
  width: '100%',
  textAlign: 'left',
  boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
  maxHeight: '90vh',
  overflowY: 'auto'
};

const modalDataBoxStyle = {
  backgroundColor: 'rgba(255,255,255,0.02)',
  padding: '0',
  borderRadius: '8px'
};

const detailRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  margin: '8px 0',
  alignItems: 'center'
};

const detailLabelStyle = {
  color: '#a8b2d1',
  fontSize: '14px'
};

const detailValueStyle = {
  color: 'white',
  fontWeight: 'bold',
  fontSize: '15px'
};