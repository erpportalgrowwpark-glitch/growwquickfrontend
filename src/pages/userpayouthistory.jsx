import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function UserPayoutHistory() {
  const [payouts, setPayouts] = useState([]);
  const [activeInvestments, setActiveInvestments] = useState([]); // Store all active plans
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch wallet history and filter ONLY interest payouts
        const histRes = await axios.get('https://quickgrowwbackend.onrender.com/api/wallet/history', getAuthHeaders());
        const interestData = histRes.data.filter(item => item.type === 'interest');
        setPayouts(interestData);

        // Fetch all active investments
        const invRes = await axios.get('https://quickgrowwbackend.onrender.com/api/investment/my-investments', getAuthHeaders());
        const activePlans = invRes.data.filter(inv => inv.status === 'active');
        setActiveInvestments(activePlans);
        
      } catch (error) {
        if (error.response?.status === 401) navigate('/login');
      }
    };
    fetchData();
  }, [navigate]);

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', fontFamily: 'sans-serif', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Payout History</h2>
        <button onClick={() => navigate('/investments')} style={{ padding: '8px 15px', cursor: 'pointer', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '5px' }}>Back</button>
      </div>

      {/* NEW: UPCOMING PAYOUTS SECTION */}
      <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Upcoming Scheduled Payouts</h3>
      
      {activeInvestments.length === 0 ? (
        <p style={{ color: '#555', marginBottom: '40px' }}>You have no active investments scheduled for payouts.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '40px' }}>
          {activeInvestments.map(inv => {
            // Calculate how much interest they will receive on this specific plan
            const expectedInterest = (inv.principalAmount * (inv.dailyRate / 100)) * inv.payoutFrequency;
            
            return (
              <div key={inv._id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '20px', 
                backgroundColor: '#f8f9fa', 
                borderLeft: '6px solid #28a745', // Thick green border to make it pop
                borderRadius: '8px', 
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)' 
              }}>
                {/* Left Side: Investment Details */}
                <div>
                  <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#555' }}>Plan: <b>₹{inv.principalAmount}</b> @ {inv.dailyRate}% Daily</p>
                  <p style={{ margin: '0', fontSize: '14px', color: '#555' }}>Frequency: Every <b>{inv.payoutFrequency} Days</b></p>
                </div>

                {/* Right Side: Next Payout Details (Highly Noticeable) */}
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#555', textTransform: 'uppercase', fontWeight: 'bold' }}>Next Payout Amount</p>
                  <h2 style={{ margin: '0 0 5px 0', color: '#28a745' }}>+ ₹{expectedInterest.toFixed(2)}</h2>
                  <p style={{ margin: '0', fontSize: '15px', fontWeight: 'bold', color: '#333', backgroundColor: '#e9ecef', padding: '5px 10px', borderRadius: '4px', display: 'inline-block' }}>
                    📅 {new Date(inv.nextPayoutDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* HISTORICAL PAYOUTS SECTION */}
      <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Automated Interest Earnings History</h3>
      {payouts.length === 0 ? (
        <p>No interest payouts received yet. Your automated payouts will appear here.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f4f4f9' }}>
              <th style={thTdStyle}>Date Received</th>
              <th style={thTdStyle}>Type</th>
              <th style={thTdStyle}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map(item => (
              <tr key={item._id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={thTdStyle}>{new Date(item.createdAt).toLocaleDateString()}</td>
                <td style={thTdStyle}><b style={{ color: '#17a2b8' }}>INTEREST</b></td>
                <td style={thTdStyle}><b style={{ color: '#28a745' }}>+ ₹{item.amount}</b></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const thTdStyle = { padding: '12px', borderBottom: '1px solid #ddd' };