import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function UserWallet() {
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);
  const [savedBanks, setSavedBanks] = useState([]);
  const [adminBankDetails, setAdminBankDetails] = useState(null);
  const [message, setMessage] = useState('');

  // Tab State for History Filtering
  const [activeTab, setActiveTab] = useState('deposit'); // 'deposit', 'withdraw', or 'interest'

  // Deposit States
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [utr, setUtr] = useState('');

  // Withdraw States
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');

  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const balRes = await axios.get('https://quickgrowwbackend.onrender.com/api/wallet/balance', getAuthHeaders());
      setBalance(balRes.data.balance);

      const histRes = await axios.get('https://quickgrowwbackend.onrender.com/api/wallet/history', getAuthHeaders());
      setHistory(histRes.data);

      const banksRes = await axios.get('https://quickgrowwbackend.onrender.com/api/bank', getAuthHeaders());
      setSavedBanks(banksRes.data);

      const adminBankRes = await axios.get('https://quickgrowwbackend.onrender.com/api/admin-bank', getAuthHeaders());
      setAdminBankDetails(adminBankRes.data);
    } catch (error) {
      if (error.response?.status === 401) navigate('/login');
    }
  };

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://quickgrowwbackend.onrender.com/api/wallet/deposit', { amount: Number(depositAmount), utr }, getAuthHeaders());
      setMessage(response.data.message);
      setDepositAmount(''); setUtr('');
      fetchWalletData();
      setTimeout(() => { setShowDepositModal(false); setMessage(''); }, 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Deposit request failed');
    }
  };

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://quickgrowwbackend.onrender.com/api/wallet/withdraw', { amount: Number(withdrawAmount), bankName, branchName, accountNumber, ifscCode }, getAuthHeaders());
      setMessage(response.data.message);
      fetchWalletData();
      setWithdrawAmount(''); setBankName(''); setBranchName(''); setAccountNumber(''); setIfscCode('');
      setTimeout(() => { setShowWithdrawModal(false); setMessage(''); }, 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Withdraw request failed');
    }
  };

  const autoFillBank = (bank) => {
    setBankName(bank.bankName);
    setBranchName(bank.branchName);
    setAccountNumber(bank.accountNumber);
    setIfscCode(bank.ifscCode);
  };

  // Filter history based on active tab
  const filteredHistory = history.filter(item => item.type === activeTab);

  return (
    <div className="page-wrapper" style={pageStyle}>
      {/* INJECTED CSS FOR RESPONSIVENESS AND TABS */}
      <style>
        {`
          /* GLOBAL FIX FOR MOBILE OVERFLOWS */
          * {
            box-sizing: border-box;
          }
          
          body {
            margin: 0; 
            background: linear-gradient(135deg, #000d22 0%, #002056 50%, #0a192f 100%);
            background-attachment: fixed;
          }
          .custom-input {
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
          .custom-input:focus {
            border-color: #00d27f;
            box-shadow: 0 0 10px rgba(0, 210, 127, 0.2);
            background-color: rgba(255, 255, 255, 0.1);
          }
          
          /* BUTTONS */
          .btn-primary, .btn-danger-solid, .btn-info-solid {
            color: white;
            padding: 12px 25px;
            border: none;
            border-radius: 8px;
            font-weight: bold;
            font-size: 15px;
            cursor: pointer;
            transition: all 0.3s ease;
            width: 100%;
          }
          .btn-primary { background-color: #00d27f; box-shadow: 0 4px 15px rgba(0, 210, 127, 0.2); }
          .btn-primary:hover { background-color: #00b36b; transform: translateY(-2px); }
          
          .btn-danger-solid { background-color: #ff4757; box-shadow: 0 4px 15px rgba(255, 71, 87, 0.2); }
          .btn-danger-solid:hover { background-color: #ff6b81; transform: translateY(-2px); }
          
          .btn-info-solid { background-color: #0dcaf0; box-shadow: 0 4px 15px rgba(13, 202, 240, 0.2); }
          .btn-info-solid:hover { background-color: #31d2f2; transform: translateY(-2px); }

          .btn-outline, .btn-danger-outline {
            background-color: transparent;
            padding: 12px 25px;
            border-radius: 8px;
            font-weight: bold;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.3s ease;
            width: 100%;
          }
          .btn-outline { color: #00d27f; border: 2px solid #00d27f; }
          .btn-outline:hover { background-color: rgba(0, 210, 127, 0.1); transform: translateY(-2px); }
          
          .btn-danger-outline { color: #ff4757; border: 2px solid #ff4757; }
          .btn-danger-outline:hover { background-color: rgba(255, 71, 87, 0.1); transform: translateY(-2px); }

          /* HIGHLIGHTED CENTER TABS */
          .tab-container {
            display: flex;
            justify-content: center;
            background: rgba(255, 255, 255, 0.05);
            padding: 6px;
            border-radius: 12px;
            margin-bottom: 20px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            flex-wrap: nowrap;
          }
          .tab-btn {
            background: transparent;
            border: none;
            color: #a8b2d1;
            padding: 10px 15px;
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
            border-radius: 8px;
            transition: all 0.3s ease;
            flex: 1;
            text-align: center;
          }
          .tab-btn.active {
            background-color: #00d27f;
            color: #ffffff;
            box-shadow: 0 4px 10px rgba(0, 210, 127, 0.3);
          }

          /* TABLES & CARDS */
          .table-wrapper {
            width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
          .custom-table { width: 100%; border-collapse: collapse; margin-top: 15px; color: #fff; min-width: 400px; }
          .custom-table th { padding: 12px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.1); color: #a8b2d1; }
          .custom-table td { padding: 12px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.05); white-space: nowrap; }
          
          .bank-slider {
            display: flex; gap: 10px; overflow-x: auto; padding-bottom: 10px; -webkit-overflow-scrolling: touch;
          }
          .bank-card {
            min-width: 120px; padding: 10px;
            background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.2);
            border-radius: 8px; cursor: pointer; text-align: center; color: white;
            flex-shrink: 0;
          }
          .bank-card:hover { border-color: #00d27f; background: rgba(0,210,127,0.1); }
          
          /* DEBIT CARD CHIP */
          .card-chip {
            width: 45px; height: 35px;
            background: linear-gradient(135deg, #e0c389 0%, #c19b45 100%);
            border-radius: 6px; position: relative; overflow: hidden; border: 1px solid #8e6a21;
          }
          .card-chip::after { content: ''; position: absolute; top: 50%; left: 0; width: 100%; height: 1px; background: rgba(0,0,0,0.3); }
          .card-chip::before { content: ''; position: absolute; left: 50%; top: 0; width: 1px; height: 100%; background: rgba(0,0,0,0.3); }

          /* DEBIT CARD DECORATION */
          .card-circle-1 { position: absolute; right: -20px; bottom: -20px; width: 150px; height: 150px; border-radius: 50%; background: rgba(255,255,255,0.03); z-index: 1; }
          .card-circle-2 { position: absolute; right: 50px; bottom: -40px; width: 100px; height: 100px; border-radius: 50%; background: rgba(0, 210, 127, 0.05); z-index: 1; }

          /* MOBILE RESPONSIVENESS */
          @media (min-width: 601px) {
            .action-buttons-grid {
              display: flex;
              gap: 15px;
            }
            .modal-actions {
              display: flex;
              gap: 10px;
            }
          }

          @media (max-width: 600px) {
            .page-wrapper { padding: 15px 10px !important; }
            .glass-container { padding: 20px 15px !important; border-radius: 16px !important; }
            
            .action-buttons-grid {
              display: flex;
              flex-direction: column;
              gap: 12px;
            }
            .modal-actions {
              display: flex;
              flex-direction: column;
              gap: 10px;
            }

            .debit-card { padding: 20px 15px !important; }
            .card-balance-text { font-size: 26px !important; }
            .card-num-text { font-size: 13px !important; }
            
            .tab-container { padding: 4px; border-radius: 8px; }
            .tab-btn { font-size: 12px; padding: 8px 2px; }
            
            .modal-content { padding: 20px 15px !important; width: 95% !important; margin: 0 auto; }
            
            h2 { font-size: 22px !important; }
          }
          
          @media (max-width: 380px) {
            .card-balance-text { font-size: 22px !important; }
            .card-num-text { font-size: 11px !important; letter-spacing: 1px !important; }
            .tab-btn { font-size: 10px; }
          }
        `}
      </style>

      <div className="glass-container" style={containerStyle}>

        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', gap: '15px', flexWrap: 'wrap' }}>
          <h2 style={titleStyle}>My Wallet</h2>
          <button onClick={() => navigate('/dashboard')} style={{ width: '36px', height: '36px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: '#ff4757', color: 'white', border: 'none', cursor: 'pointer', flexShrink: 0, boxShadow: '0 4px 10px rgba(255, 71, 87, 0.3)' }} title="Go Back">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
        </div>

        {/* PREMIUM VIRTUAL DEBIT CARD - PERFECT DIMENSIONS */}
        <div className="debit-card" style={debitCardStyle}>
          <div className="card-circle-1"></div>
          <div className="card-circle-2"></div>

          {/* Card Top: Chip & Brand */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 2 }}>
            <div className="card-chip"></div>
            <div style={{ fontStyle: 'italic', fontWeight: 'bold', color: 'rgba(255,255,255,0.7)', fontSize: '18px' }}>
              GrowwPark
            </div>
          </div>

          {/* Card Bottom: Details & Huge Balance on Right */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 2 }}>
            <div style={{ textAlign: 'left' }}>
              <p style={{ margin: '0 0 5px 0', fontSize: '11px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '2px' }}>
                Virtual Wallet
              </p>
              <p className="card-num-text" style={{ margin: 0, fontSize: '15px', color: 'rgba(255,255,255,0.9)', letterSpacing: '3px', fontFamily: 'monospace' }}>
                **** **** 8892
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '0 0 5px 0', fontSize: '11px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Balance
              </p>
              <h1 className="card-balance-text" style={{ margin: 0, color: '#00d27f', fontSize: '30px', fontWeight: '900', textShadow: '0 2px 10px rgba(0,210,127,0.3)' }}>
                ₹{balance}
              </h1>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="action-buttons-grid" style={{ marginBottom: '40px' }}>
          <button onClick={() => setShowDepositModal(true)} className="btn-primary">Deposit</button>
          <button onClick={() => setShowWithdrawModal(true)} className="btn-danger-solid">Withdraw</button>
          <button onClick={() => navigate('/bank-management')} className="btn-info-solid">Banks</button>
        </div>

        {/* HIGHLIGHTED CENTERED TABS */}
        <div style={{ textAlign: 'center' }}>

          <div className="tab-container">
            <button className={`tab-btn ${activeTab === 'deposit' ? 'active' : ''}`} onClick={() => setActiveTab('deposit')}>Deposits</button>
            <button className={`tab-btn ${activeTab === 'withdraw' ? 'active' : ''}`} onClick={() => setActiveTab('withdraw')}>Withdrawals</button>
            <button className={`tab-btn ${activeTab === 'interest' ? 'active' : ''}`} onClick={() => setActiveTab('interest')}>Interest</button>
          </div>

          {filteredHistory.length === 0 ? (
            <p style={{ color: '#a8b2d1', textAlign: 'center', margin: '30px 0' }}>No {activeTab} transactions found.</p>
          ) : (
            <div className="table-wrapper">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map(item => (
                    <tr key={item._id}>
                      <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td><b>{item.type.toUpperCase()}</b></td>
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
      </div>

      {/* DEPOSIT MODAL */}
      {showDepositModal && (
        <div style={modalOverlayStyle}>
          <div className="modal-content" style={modalContentStyle}>
            <h3 style={{ marginTop: 0, color: 'white' }}>Deposit Funds</h3>

            <div style={adminBankBoxStyle}>
              <p style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 'bold', color: '#00d27f' }}>Admin Bank Details:</p>
              {adminBankDetails ? (
                <div style={{ fontSize: '14px', color: '#a8b2d1', lineHeight: '1.6' }}>
                  <p style={{ margin: '2px 0' }}><strong>Bank:</strong> {adminBankDetails.bankName}</p>
                  <p style={{ margin: '2px 0' }}><strong>Name:</strong> {adminBankDetails.accountName}</p>
                  <p style={{ margin: '2px 0' }}><strong>A/C No:</strong> {adminBankDetails.accountNumber}</p>
                  <p style={{ margin: '2px 0' }}><strong>IFSC:</strong> {adminBankDetails.ifscCode}</p>
                </div>
              ) : (
                <p style={{ fontSize: '14px', color: '#ff4757' }}>Bank details unavailable. Contact Admin.</p>
              )}
            </div>

            {message && <p style={{ color: message.includes('success') ? '#00d27f' : '#ff4757' }}>{message}</p>}

            <form onSubmit={handleDepositSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input type="number" placeholder="Enter Amount (₹)" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} required className="custom-input" />
              <input type="text" placeholder="Enter UTR / Txn ID" value={utr} onChange={(e) => setUtr(e.target.value)} required className="custom-input" />
              <div className="modal-actions" style={{ marginTop: '5px' }}>
                <button type="submit" className="btn-primary">Submit</button>
                <button type="button" onClick={() => setShowDepositModal(false)} className="btn-danger-outline">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WITHDRAW MODAL */}
      {showWithdrawModal && (
        <div style={modalOverlayStyle}>
          <div className="modal-content" style={{ ...modalContentStyle, maxWidth: '500px' }}>
            <h3 style={{ marginTop: 0, color: 'white' }}>Withdraw Funds</h3>

            {savedBanks.length > 0 && (
              <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#a8b2d1' }}>Tap a saved bank to auto-fill:</p>
                <div className="bank-slider">
                  {savedBanks.map(bank => (
                    <div key={bank._id} onClick={() => autoFillBank(bank)} className="bank-card">
                      <b>{bank.bankName}</b>
                      <div style={{ fontSize: '12px', color: '#a8b2d1' }}>*{bank.accountNumber.slice(-4)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {message && <p style={{ color: message.includes('success') ? '#00d27f' : '#ff4757' }}>{message}</p>}

            <form onSubmit={handleWithdrawSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input type="number" placeholder="Withdraw Amount (₹)" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} required className="custom-input" />

              {/* LIVE TDS CALCULATION UI */}
              {withdrawAmount && Number(withdrawAmount) > 0 && (
                <div style={tdsBoxStyle}>
                  <p style={{ margin: '2px 0', color: '#a8b2d1' }}>Gross Withdrawal: <b>₹{Number(withdrawAmount)}</b></p>
                  <p style={{ margin: '2px 0', color: '#ff4757' }}>TDS Deduction (1%): <b>- ₹{(Number(withdrawAmount) * 0.01).toFixed(2)}</b></p>
                  <p style={{ margin: '10px 0 0 0', fontWeight: 'bold', color: '#00d27f', fontSize: '18px' }}>
                    Net to Bank: ₹{(Number(withdrawAmount) - (Number(withdrawAmount) * 0.01)).toFixed(2)}
                  </p>
                </div>
              )}

              <input type="text" placeholder="Bank Name" value={bankName} onChange={(e) => setBankName(e.target.value)} required className="custom-input" />
              <input type="text" placeholder="Branch Name" value={branchName} onChange={(e) => setBranchName(e.target.value)} required className="custom-input" />
              <input type="text" placeholder="Account Number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required className="custom-input" />
              <input type="text" placeholder="IFSC Code" value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} required className="custom-input" />

              <div className="modal-actions" style={{ marginTop: '5px' }}>
                <button type="submit" className="btn-primary">Request</button>
                <button type="button" onClick={() => setShowWithdrawModal(false)} className="btn-danger-outline">Cancel</button>
              </div>
            </form>
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
  maxWidth: '800px',
  width: '100%',
  boxSizing: 'border-box'
};

const debitCardStyle = {
  background: 'linear-gradient(135deg, #1a2a40 0%, #0a192f 100%)',
  border: '1px solid rgba(0, 210, 127, 0.3)',
  padding: '25px 30px',
  borderRadius: '16px',
  margin: '0 auto 30px auto',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
  position: 'relative',
  overflow: 'hidden',
  color: 'white',
  maxWidth: '400px',
  width: '100%',
  aspectRatio: '1.586 / 1',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  boxSizing: 'border-box'
};

const titleStyle = {
  color: '#ffffff',
  margin: '0',
  fontSize: '26px',
  fontWeight: '800'
};

const statusBadgeStyle = (status) => {
  let bg = 'rgba(241, 196, 15, 0.2)'; let col = '#f1c40f'; // Pending yellow
  if (status === 'approved') { bg = 'rgba(0, 210, 127, 0.2)'; col = '#00d27f'; }
  if (status === 'rejected') { bg = 'rgba(255, 71, 87, 0.2)'; col = '#ff4757'; }
  return { padding: '5px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', color: col, backgroundColor: bg, whiteSpace: 'nowrap' };
};

const modalOverlayStyle = {
  position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
  backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  padding: '10px', boxSizing: 'border-box'
};

const modalContentStyle = {
  background: '#0a192f',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  padding: '30px',
  borderRadius: '16px',
  maxWidth: '400px',
  width: '100%',
  textAlign: 'left',
  boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
  maxHeight: '90vh',
  overflowY: 'auto',
  boxSizing: 'border-box'
};

const adminBankBoxStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  padding: '15px',
  borderRadius: '8px',
  marginBottom: '20px'
};

const tdsBoxStyle = {
  backgroundColor: 'rgba(255, 193, 7, 0.05)',
  padding: '15px',
  borderRadius: '8px',
  textAlign: 'left',
  fontSize: '14px',
  borderLeft: '4px solid #ffc107',
  marginBottom: '5px'
};