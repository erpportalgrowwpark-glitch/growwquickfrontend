import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminUserList() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const getAdminHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('import.meta.env.VITE_API_URL/api/admin/users', getAdminHeaders());
        setUsers(response.data);
      } catch (error) {
        if (error.response?.status === 401) navigate('/admin-login');
      }
    };
    fetchUsers();
  }, [navigate]);

  return (
    <div style={{ maxWidth: '900px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>User Management</h2>
        <button onClick={() => navigate('/admin-dashboard')} style={btnStyle('#333')}>Back to Dashboard</button>
      </div>

      <div style={{ marginTop: '20px' }}>
        {users.length === 0 ? <p>No users registered yet.</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f4f4f9', textAlign: 'left' }}>
                <th style={thTdStyle}>Name</th>
                <th style={thTdStyle}>Email</th>
                <th style={thTdStyle}>Wallet Balance</th>
                <th style={thTdStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={thTdStyle}>{user.name}</td>
                  <td style={thTdStyle}>{user.email}</td>
                  <td style={thTdStyle}><b style={{ color: '#28a745' }}>₹{user.walletBalance}</b></td>
                  <td style={thTdStyle}>
                    <button 
                      onClick={() => navigate(`/admin-user-transactions/${user._id}`)} 
                      style={{ ...btnStyle('#17a2b8'), padding: '5px 10px', fontSize: '12px' }}
                    >
                      View Transactions
                    </button>
                  </td>
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