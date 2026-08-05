import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function UserBankDetailsManagement() {
  const [banks, setBanks] = useState([]);
  const [bankName, setBankName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    try {
      const response = await axios.get('import.meta.env.VITE_API_URL/api/bank', getAuthHeaders());
      setBanks(response.data);
    } catch (error) {
      if (error.response?.status === 401) navigate('/login');
    }
  };

  const handleAddBank = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'import.meta.env.VITE_API_URL/api/bank/add', 
        { bankName, branchName, accountNumber, ifscCode }, 
        getAuthHeaders()
      );
      setMessage(response.data.message);
      setBankName(''); setBranchName(''); setAccountNumber(''); setIfscCode('');
      fetchBanks(); // Refresh list
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to add bank');
    }
  };

  const handleDeleteBank = async (id) => {
    if (!window.confirm('Are you sure you want to delete this bank card?')) return;
    try {
      await axios.delete(`import.meta.env.VITE_API_URL/api/bank/${id}`, getAuthHeaders());
      fetchBanks(); // Refresh list
    } catch (error) {
      alert('Failed to delete bank');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Manage Bank Details</h2>
        <button onClick={() => navigate('/wallet')} style={btnStyle('#333')}>Back to Wallet</button>
      </div>

      <div style={{ display: 'flex', gap: '30px', marginTop: '20px', flexWrap: 'wrap' }}>
        
        {/* ADD BANK FORM */}
        <div style={{ flex: '1', minWidth: '300px', padding: '20px', backgroundColor: '#f4f4f9', borderRadius: '10px' }}>
          <h3>Add New Bank Card</h3>
          {message && <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}
          <form onSubmit={handleAddBank} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
            <input type="text" placeholder="Bank Name" value={bankName} onChange={(e) => setBankName(e.target.value)} required style={inputStyle} />
            <input type="text" placeholder="Branch Name" value={branchName} onChange={(e) => setBranchName(e.target.value)} required style={inputStyle} />
            <input type="text" placeholder="Account Number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required style={inputStyle} />
            <input type="text" placeholder="IFSC Code" value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} required style={inputStyle} />
            <button type="submit" style={btnStyle('#28a745')}>Save Bank Details</button>
          </form>
        </div>

        {/* SAVED BANKS LIST (VIRTUAL CARDS) */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <h3>Saved Banks</h3>
          {banks.length === 0 ? <p>No banks saved yet.</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
              {banks.map(bank => (
                <div key={bank._id} style={cardStyle}>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', color: '#fff' }}>{bank.bankName}</h4>
                    <p style={{ margin: '0', fontSize: '14px', color: '#ddd' }}>A/C: **** {bank.accountNumber.slice(-4)}</p>
                    <p style={{ margin: '0', fontSize: '12px', color: '#aaa' }}>IFSC: {bank.ifscCode}</p>
                  </div>
                  <button onClick={() => handleDeleteBank(bank._id)} style={deleteBtnStyle}>Delete</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle = { padding: '10px', border: '1px solid #ccc', borderRadius: '4px' };
const btnStyle = (color) => ({ padding: '10px 20px', cursor: 'pointer', backgroundColor: color, color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold' });
const cardStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#2c3e50', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' };
const deleteBtnStyle = { padding: '5px 10px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', fontSize: '12px' };