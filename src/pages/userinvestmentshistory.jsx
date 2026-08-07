import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function UserInvestmentsHistory() {
  const [investments, setInvestments] = useState([]);
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const invRes = await axios.get('https://quickgrowwbackend.onrender.com/api/investment/my-investments', getAuthHeaders());
        setInvestments(invRes.data);
      } catch (error) {
        if (error.response?.status === 401) navigate('/login');
      }
    };
    fetchInvestments();
  }, [navigate]);

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', fontFamily: 'sans-serif', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>My Active Investments</h2>
        <button onClick={() => navigate('/investments')} style={{ padding: '8px 15px', cursor: 'pointer', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '5px' }}>Back</button>
      </div>

      {investments.length === 0 ? (
        <p>You have no active investments.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {investments.map(inv => (
            <div key={inv._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <div>
                <h3 style={{ margin: '0 0 5px 0', color: '#007bff' }}>₹{inv.principalAmount}</h3>
                <p style={{ margin: '0', fontSize: '13px', color: '#555' }}>Locked: {new Date(inv.createdAt).toLocaleDateString()}</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: '0', fontWeight: 'bold' }}>{inv.dailyRate}% Daily</p>
                <p style={{ margin: '0', fontSize: '13px', color: '#555' }}>Every {inv.payoutFrequency} Days</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ padding: '5px 10px', backgroundColor: '#28a745', color: 'white', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold' }}>
                  {inv.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}