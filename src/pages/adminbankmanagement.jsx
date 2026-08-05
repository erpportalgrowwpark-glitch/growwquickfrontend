import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminBankManagement() {
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [branchName, setBranchName] = useState('');
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();

  const getAdminHeaders = () => {
    const token = localStorage.getItem('adminToken');
    // For this specific GET route we reuse the standard auth token format but passing adminToken
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    const fetchCurrentDetails = async () => {
      try {
        const response = await axios.get('[https://quickgrowwbackend.onrender.com](https://quickgrowwbackend.onrender.com)/api/admin-bank', getAdminHeaders());
        if (response.data) {
          setBankName(response.data.bankName);
          setAccountName(response.data.accountName);
          setAccountNumber(response.data.accountNumber);
          setIfscCode(response.data.ifscCode);
          setBranchName(response.data.branchName);
        }
      } catch (error) {
        if (error.response?.status === 401) navigate('/admin-login');
      }
    };
    fetchCurrentDetails();
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        '[https://quickgrowwbackend.onrender.com](https://quickgrowwbackend.onrender.com)/api/admin-bank/update',
        { bankName, accountName, accountNumber, ifscCode, branchName },
        getAdminHeaders()
      );
      setMessage(response.data.message);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update details');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Admin Bank Details</h2>
        <button onClick={() => navigate('/admin-dashboard')} style={btnStyle('#333')}>Back</button>
      </div>

      <div style={{ padding: '20px', backgroundColor: '#f4f4f9', borderRadius: '10px', marginTop: '20px' }}>
        <p style={{ fontSize: '14px', color: '#555', marginTop: '0' }}>These details will be shown to users when they make a deposit.</p>
        
        {message && <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}
        
        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="text" placeholder="Bank Name" value={bankName} onChange={(e) => setBankName(e.target.value)} required style={inputStyle} />
          <input type="text" placeholder="Account Name" value={accountName} onChange={(e) => setAccountName(e.target.value)} required style={inputStyle} />
          <input type="text" placeholder="Account Number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required style={inputStyle} />
          <input type="text" placeholder="IFSC Code" value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} required style={inputStyle} />
          <input type="text" placeholder="Branch Name" value={branchName} onChange={(e) => setBranchName(e.target.value)} required style={inputStyle} />
          <button type="submit" style={btnStyle('#007bff')}>Update Bank Details</button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = { padding: '10px', border: '1px solid #ccc', borderRadius: '4px' };
const btnStyle = (color) => ({ padding: '10px 20px', cursor: 'pointer', backgroundColor: color, color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold' });