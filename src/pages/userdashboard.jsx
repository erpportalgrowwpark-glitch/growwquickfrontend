import { useNavigate } from 'react-router-dom';

export default function UserDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the session
    navigate('/'); // Send back to landing page
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'sans-serif' }}>
      <h1>This is dashboard</h1>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' }}>
        <button 
          onClick={() => navigate('/wallet')} 
          style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          My Wallet
        </button>
        <button 
          onClick={handleLogout} 
          style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}