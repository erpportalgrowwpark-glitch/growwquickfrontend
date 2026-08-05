import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminUserTransactionHistory() {
  const { id } = useParams(); // Gets the userId from the URL
  const [userData, setUserData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  const getAdminHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    const fetchUserHistory = async () => {
      try {
        const response = await axios.get(`https://quickgrowwbackend.onrender.com/api/admin/users/${id}/transactions`, getAdminHeaders());
        setUserData(response.data.user);
        setTransactions(response.data.transactions);
      } catch (error) {
        if (error.response?.status === 401) navigate('/admin-login');
        console.error('Error fetching data', error);
      }
    };
    fetchUserHistory();
  }, [id, navigate]);

  return (
    <div style={{ maxWidth: '900px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>User Transactions</h2>
        <button onClick={() => navigate('/admin-users')} style={btnStyle('#333')}>Back to Users</button>
      </div>

      {userData && (
        <div style={{ padding: '20px', backgroundColor: '#f4f4f9', borderRadius: '10px', marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: '0 0 5px 0' }}>{userData.name}</h3>
            <p style={{ margin: '0', color: '#555' }}>{userData.email}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: '0', color: '#555' }}>Current Balance</p>
            <h3 style={{ margin: '5px 0 0 0', color: '#28a745' }}>₹{userData.walletBalance}</h3>
          </div>
        </div>
      )}

      <div style={{ marginTop: '30px' }}>
        {transactions.length === 0 ? <p>This user has no transactions yet.</p> : (
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
              {transactions.map(item => (
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
    </div>
  );
}

const btnStyle = (color) => ({ padding: '10px 20px', cursor: 'pointer', backgroundColor: color, color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold' });
const thTdStyle = { padding: '12px', borderBottom: '1px solid #ddd' };
const statusBadgeStyle = (status) => {
  let color = '#f0ad4e'; 
  if (status === 'approved') color = '#28a745'; 
  if (status === 'rejected') color = '#dc3545'; 
  return { padding: '4px 8px', borderRadius: '12px', fontSize: '12px', color: 'white', backgroundColor: color };
};