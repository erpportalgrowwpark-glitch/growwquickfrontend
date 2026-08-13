import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function UserWallet() {
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);
  const [savedBanks, setSavedBanks] = useState([]);
  const [adminBankDetails, setAdminBankDetails] = useState(null); 
  const [message, setMessage] = useState('');
  
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

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h2>My Wallet</h2>
      <div style={{ padding: '30px', backgroundColor: '#f4f4f9', borderRadius: '10px', margin: '20px 0' }}>
        <h3>Current Balance</h3>
        <h1 style={{ color: '#28a745' }}>₹{balance}</h1>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <button onClick={() => setShowDepositModal(true)} style={btnStyle('#007bff')}>Deposit</button>
        <button onClick={() => setShowWithdrawModal(true)} style={btnStyle('#6c757d')}>Withdraw</button>
        <button onClick={() => navigate('/bank-management')} style={btnStyle('#17a2b8')}>Manage Banks</button>
      </div>

      <div style={{ textAlign: 'left', marginTop: '40px' }}>
        <h3>Transaction History</h3>
        {history.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f4f4f9', textAlign: 'left' }}>
                <th style={thTdStyle}>Date</th>
                <th style={thTdStyle}>Type</th>
                <th style={thTdStyle}>Amount</th>
                <th style={thTdStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map(item => (
                <tr key={item._id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={thTdStyle}>{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td style={thTdStyle}><b>{item.type.toUpperCase()}</b></td>
                  <td style={thTdStyle}>₹{item.amount}</td>
                  <td style={thTdStyle}><span style={statusBadgeStyle(item.status)}>{item.status.toUpperCase()}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <button onClick={() => navigate('/dashboard')} style={{ marginTop: '40px', ...btnStyle('#333') }}>Back to Dashboard</button>

      {/* DEPOSIT MODAL */}
      {showDepositModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3>Deposit Money</h3>
            <div style={{ backgroundColor: '#e9ecef', padding: '15px', borderRadius: '5px', textAlign: 'left', marginBottom: '15px' }}>
              <p style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 'bold' }}>Bank Details for Transfer:</p>
              {adminBankDetails ? (
                <div style={{ fontSize: '14px', color: '#333' }}>
                  <p style={{ margin: '5px 0' }}><strong>Bank:</strong> {adminBankDetails.bankName}</p>
                  <p style={{ margin: '5px 0' }}><strong>Name:</strong> {adminBankDetails.accountName}</p>
                  <p style={{ margin: '5px 0' }}><strong>A/C No:</strong> {adminBankDetails.accountNumber}</p>
                  <p style={{ margin: '5px 0' }}><strong>IFSC:</strong> {adminBankDetails.ifscCode}</p>
                  <p style={{ margin: '5px 0' }}><strong>Branch:</strong> {adminBankDetails.branchName}</p>
                </div>
              ) : (
                <p style={{ fontSize: '14px', color: 'red' }}>Bank details currently unavailable. Please contact Admin.</p>
              )}
            </div>
            {message && <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}
            <form onSubmit={handleDepositSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input type="number" placeholder="Enter Amount" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} required style={inputStyle} />
              <input type="text" placeholder="Enter UTR / Txn ID" value={utr} onChange={(e) => setUtr(e.target.value)} required style={inputStyle} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ flex: 1, ...btnStyle('#28a745') }}>Submit</button>
                <button type="button" onClick={() => setShowDepositModal(false)} style={{ flex: 1, ...btnStyle('#dc3545') }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WITHDRAW MODAL WITH LIVE TDS CALCULATION */}
      {showWithdrawModal && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, maxWidth: '500px' }}>
            <h3>Withdraw Money</h3>
            
            {savedBanks.length > 0 && (
              <div style={{ textAlign: 'left', marginBottom: '15px' }}>
                <p style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 'bold' }}>Tap a saved card to auto-fill:</p>
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
                  {savedBanks.map(bank => (
                    <div key={bank._id} onClick={() => autoFillBank(bank)} style={miniCardStyle}>
                      <b>{bank.bankName}</b>
                      <div style={{ fontSize: '12px' }}>*{bank.accountNumber.slice(-4)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px' }}>Or enter manually:</span>
              <button type="button" onClick={() => navigate('/bank-management')} style={{ background: 'none', border: 'none', color: '#17a2b8', cursor: 'pointer', textDecoration: 'underline' }}>Manage Banks</button>
            </div>

            {message && <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}
            <form onSubmit={handleWithdrawSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              
              <input type="number" placeholder="Withdraw Amount" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} required style={inputStyle} />
              
              {/* LIVE TDS CALCULATION UI */}
              {withdrawAmount && Number(withdrawAmount) > 0 && (
                <div style={{ backgroundColor: '#e9ecef', padding: '10px', borderRadius: '5px', textAlign: 'left', fontSize: '14px', borderLeft: '4px solid #f39c12' }}>
                  <p style={{ margin: '2px 0' }}>Gross Withdrawal: <b>₹{Number(withdrawAmount)}</b></p>
                  <p style={{ margin: '2px 0', color: '#dc3545' }}>TDS Deduction (1%): <b>- ₹{(Number(withdrawAmount) * 0.01).toFixed(2)}</b></p>
                  <p style={{ margin: '5px 0 0 0', fontWeight: 'bold', color: '#28a745', fontSize: '16px' }}>
                    Net Amount to Bank: ₹{(Number(withdrawAmount) - (Number(withdrawAmount) * 0.01)).toFixed(2)}
                  </p>
                </div>
              )}

              <input type="text" placeholder="Bank Name" value={bankName} onChange={(e) => setBankName(e.target.value)} required style={inputStyle} />
              <input type="text" placeholder="Branch Name" value={branchName} onChange={(e) => setBranchName(e.target.value)} required style={inputStyle} />
              <input type="text" placeholder="Account Number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required style={inputStyle} />
              <input type="text" placeholder="IFSC Code" value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} required style={inputStyle} />
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" style={{ flex: 1, ...btnStyle('#28a745') }}>Request Withdraw</button>
                <button type="button" onClick={() => setShowWithdrawModal(false)} style={{ flex: 1, ...btnStyle('#dc3545') }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = { padding: '8px', border: '1px solid #ccc', borderRadius: '4px' };
const btnStyle = (color) => ({ padding: '10px 20px', cursor: 'pointer', backgroundColor: color, color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold' });
const thTdStyle = { padding: '12px', borderBottom: '1px solid #ddd' };
const statusBadgeStyle = (status) => {
  let color = '#f0ad4e'; 
  if (status === 'approved') color = '#28a745'; 
  if (status === 'rejected') color = '#dc3545'; 
  return { padding: '4px 8px', borderRadius: '12px', fontSize: '12px', color: 'white', backgroundColor: color };
};
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalContentStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '10px', maxWidth: '400px', width: '90%', textAlign: 'center', maxHeight: '90vh', overflowY: 'auto' };
const miniCardStyle = { minWidth: '120px', padding: '10px', backgroundColor: '#2c3e50', color: 'white', borderRadius: '8px', cursor: 'pointer', flexShrink: 0, textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' };