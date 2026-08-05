import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminWalletManagement() {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'history'
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
      const response = await axios.get('import.meta.env.VITE_API_URL/api/admin/wallet/requests', getAdminHeaders());
      setRequests(response.data);
    } catch (error) {
      if (error.response?.status === 401) navigate('/admin-login');
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await axios.get('import.meta.env.VITE_API_URL/api/admin/wallet/history', getAdminHeaders());
      setHistory(response.data);
    } catch (error) {
      console.error('Failed to fetch history', error);
    }
  };

  const handleResolve = async (requestId, action) => {
    try {
      await axios.post('import.meta.env.VITE_API_URL/api/admin/wallet/resolve', { requestId, action }, getAdminHeaders());
      alert(`Request ${action}ed successfully!`);
      // Refresh both lists to move the item from pending to history
      fetchRequests();
      fetchHistory();
      setSelectedRequest(null); 
    } catch (error) {
      alert('Error resolving request');
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Wallet Management</h2>
        <button onClick={() => navigate('/admin-dashboard')} style={btnStyle('#333')}>Back to Dashboard</button>
      </div>

      {/* TAB TOGGLES */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>
        <button onClick={() => setActiveTab('pending')} style={tabStyle(activeTab === 'pending')}>Pending Requests</button>
        <button onClick={() => setActiveTab('history')} style={tabStyle(activeTab === 'history')}>Transaction History</button>
      </div>

      <div style={{ marginTop: '20px' }}>
        
        {/* PENDING REQUESTS TAB */}
        {activeTab === 'pending' && (
          requests.length === 0 ? <p>No pending requests right now, bro.</p> : (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f4f4f9', textAlign: 'left' }}>
                  <th style={thTdStyle}>User Name</th>
                  <th style={thTdStyle}>Type</th>
                  <th style={thTdStyle}>Amount</th>
                  <th style={thTdStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req._id} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={thTdStyle}>{req.userId?.name || 'Unknown User'}</td>
                    <td style={thTdStyle}><b>{req.type.toUpperCase()}</b></td>
                    <td style={thTdStyle}>₹{req.amount}</td>
                    <td style={thTdStyle}>
                      <button onClick={() => setSelectedRequest(req)} style={{ ...btnStyle('#007bff'), padding: '5px 10px', fontSize: '12px' }}>
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}

        {/* TRANSACTION HISTORY TAB */}
        {activeTab === 'history' && (
          history.length === 0 ? <p>No resolved history yet.</p> : (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f4f4f9', textAlign: 'left' }}>
                  <th style={thTdStyle}>Date</th>
                  <th style={thTdStyle}>User Name</th>
                  <th style={thTdStyle}>Type</th>
                  <th style={thTdStyle}>Amount</th>
                  <th style={thTdStyle}>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map(item => (
                  <tr key={item._id} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={thTdStyle}>{new Date(item.updatedAt).toLocaleDateString()}</td>
                    <td style={thTdStyle}>{item.userId?.name || 'Unknown User'}</td>
                    <td style={thTdStyle}><b>{item.type.toUpperCase()}</b></td>
                    <td style={thTdStyle}>₹{item.amount}</td>
                    <td style={thTdStyle}><span style={statusBadgeStyle(item.status)}>{item.status.toUpperCase()}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </div>

      {/* VIEW DETAILS MODAL (Only shows for Pending Requests) */}
      {selectedRequest && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3>Request Details</h3>
            <div style={{ textAlign: 'left', margin: '20px 0', lineHeight: '1.6', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
              <p><strong>Name:</strong> {selectedRequest.userId?.name}</p>
              <p><strong>Email:</strong> {selectedRequest.userId?.email}</p>
              <p><strong>Type:</strong> {selectedRequest.type.toUpperCase()}</p>
              <p><strong>Amount:</strong> ₹{selectedRequest.amount}</p>
              
              {selectedRequest.type === 'deposit' && (
                <p><strong>UTR/Txn ID:</strong> {selectedRequest.utr}</p>
              )}
              
              {selectedRequest.type === 'withdraw' && (
                <>
                  <hr style={{ margin: '10px 0', borderColor: '#ddd' }} />
                  <p><strong>Bank Name:</strong> {selectedRequest.bankName}</p>
                  <p><strong>Branch:</strong> {selectedRequest.branchName}</p>
                  <p><strong>Account No:</strong> {selectedRequest.accountNumber}</p>
                  <p><strong>IFSC:</strong> {selectedRequest.ifscCode}</p>
                </>
              )}
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={() => handleResolve(selectedRequest._id, 'accept')} style={{ flex: 1, ...btnStyle('#28a745') }}>Accept Request</button>
              <button onClick={() => handleResolve(selectedRequest._id, 'reject')} style={{ flex: 1, ...btnStyle('#dc3545') }}>Reject Request</button>
            </div>
            <button onClick={() => setSelectedRequest(null)} style={{ marginTop: '15px', width: '100%', ...btnStyle('#6c757d') }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

const btnStyle = (color) => ({ padding: '10px 20px', cursor: 'pointer', backgroundColor: color, color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold' });
const tabStyle = (isActive) => ({ padding: '10px 20px', cursor: 'pointer', backgroundColor: isActive ? '#007bff' : '#f4f4f9', color: isActive ? 'white' : '#333', border: '1px solid #ddd', borderRadius: '5px', fontWeight: 'bold' });
const thTdStyle = { padding: '12px', borderBottom: '1px solid #ddd' };
const statusBadgeStyle = (status) => {
  let color = '#f0ad4e'; 
  if (status === 'approved') color = '#28a745'; 
  if (status === 'rejected') color = '#dc3545'; 
  return { padding: '4px 8px', borderRadius: '12px', fontSize: '12px', color: 'white', backgroundColor: color };
};
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const modalContentStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '10px', maxWidth: '400px', width: '90%', textAlign: 'center' };