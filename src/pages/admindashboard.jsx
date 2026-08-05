import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken'); 
    navigate('/'); 
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'sans-serif' }}>
      <h1>Admin Dashboard</h1>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px', flexWrap: 'wrap' }}>
        <button 
          onClick={() => navigate('/admin-wallet')} 
          style={btnStyle('#007bff')}
        >
          Wallet Management
        </button>
        <button 
          onClick={() => navigate('/admin-users')} 
          style={btnStyle('#17a2b8')}
        >
          Manage Users
        </button>
        <button onClick={() => navigate('/admin-bank')} style={btnStyle('#28a745')}>Update Bank Details</button>
        <button 
          onClick={handleLogout} 
          style={btnStyle('#333')}
        >
          Logout Admin
        </button>
      </div>
    </div>
  );
}

const btnStyle = (color) => ({ padding: '10px 20px', cursor: 'pointer', backgroundColor: color, color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold' });