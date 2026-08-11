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
      // Auto-select the first rate if rates exist
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
    if (!window.confirm(`Are you sure you want to lock in ₹${amount} for ${payoutFrequency} days at ${dailyRate}% daily?`)) return;

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

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', fontFamily: 'sans-serif', padding: '20px' }}>
      <h2>Start New Investment</h2>
      
      <div style={{ padding: '15px', backgroundColor: '#f4f4f9', borderRadius: '8px', marginBottom: '20px' }}>
        <p style={{ margin: '0', color: '#555' }}>Available Wallet Balance:</p>
        <h3 style={{ margin: '5px 0 0 0', color: '#28a745' }}>₹{balance}</h3>
      </div>
      
      {message && <p style={{ color: message.includes('success') ? 'green' : 'red', fontWeight: 'bold' }}>{message}</p>}
      
      {/* If admin hasn't added any rates, show a warning instead of the form */}
      {availableRates.length === 0 ? (
        <div style={{ padding: '20px', backgroundColor: '#fff3cd', color: '#856404', borderRadius: '8px' }}>
          <p style={{ margin: 0 }}>Investment plans are currently being updated by the admin. Please check back later!</p>
          <button onClick={() => navigate('/investments')} style={{ ...btnStyle('#6c757d'), marginTop: '15px' }}>Go Back</button>
        </div>
      ) : (
        <form onSubmit={handleInvest} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div>
            <label style={labelStyle}>Investment Amount (₹) - Min ₹5000</label>
            <input type="number" placeholder="e.g. 5000" min="5000" value={amount} onChange={(e) => setAmount(e.target.value)} required style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Daily Interest Rate</label>
            <select value={dailyRate} onChange={(e) => setDailyRate(e.target.value)} required style={inputStyle}>
              {/* Maps through the dynamic rates pulled from the backend */}
              {availableRates.map(rateObj => (
                <option key={rateObj._id} value={rateObj.rate}>{rateObj.rate}% per day</option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Interest Payout Frequency</label>
            <select value={payoutFrequency} onChange={(e) => setPayoutFrequency(e.target.value)} required style={inputStyle}>
              <option value="5">Every 5 Days</option>
              <option value="10">Every 10 Days</option>
              <option value="20">Every 20 Days</option>
              <option value="30">Every 30 Days</option>
            </select>
          </div>

          <button type="submit" style={btnStyle('#28a745')}>Lock Investment</button>
          <button type="button" onClick={() => navigate('/investments')} style={btnStyle('#6c757d')}>Cancel</button>
        
        </form>
      )}
    </div>
  );
}

// Inline Styles
const inputStyle = { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' };
const labelStyle = { display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' };
const btnStyle = (color) => ({ padding: '10px 20px', cursor: 'pointer', backgroundColor: color, color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', width: '100%' });