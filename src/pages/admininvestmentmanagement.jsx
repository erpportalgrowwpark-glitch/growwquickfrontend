import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminInvestmentManagement() {
  const [rates, setRates] = useState([]);
  const [newRate, setNewRate] = useState('');
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
      const response = await axios.post('https://quickgrowwbackend.onrender.com/api/admin-investment/rates', { rate: newRate }, getAdminHeaders());
      setMessage(response.data.message);
      setNewRate('');
      fetchRates();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to add rate');
    }
  };

  const handleDeleteRate = async (id) => {
    if (!window.confirm('Are you sure you want to delete this percentage? It will hide it from new users.')) return;
    try {
      const response = await axios.delete(`https://quickgrowwbackend.onrender.com/api/admin-investment/rates/${id}`, getAdminHeaders());
      setMessage(response.data.message);
      fetchRates();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to delete rate');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', fontFamily: 'sans-serif', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Interest Rate Management</h2>
        <button onClick={() => navigate('/admin-dashboard')} style={btnStyle('#333')}>Back to Dashboard</button>
      </div>

      <div style={{ backgroundColor: '#f4f4f9', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
        <h3>Add New Percentage Option</h3>
        {message && <p style={{ color: message.includes('success') ? 'green' : 'red', fontWeight: 'bold' }}>{message}</p>}
        
        <form onSubmit={handleAddRate} style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="number" step="0.01" placeholder="e.g. 1.5" required
            value={newRate} onChange={(e) => setNewRate(e.target.value)} 
            style={{ padding: '10px', flex: 1, borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={btnStyle('#28a745')}>Add Rate</button>
        </form>
      </div>

      <h3 style={{ marginTop: '40px' }}>Active Available Rates</h3>
      {rates.length === 0 ? (
        <p>No rates added yet. Users cannot make investments right now!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {rates.map(rateObj => (
            <div key={rateObj._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px' }}>
              <h2 style={{ margin: 0, color: '#007bff' }}>{rateObj.rate}% Daily</h2>
              <button onClick={() => handleDeleteRate(rateObj._id)} style={btnStyle('#dc3545')}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const btnStyle = (color) => ({ padding: '10px 20px', cursor: 'pointer', backgroundColor: color, color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold' });