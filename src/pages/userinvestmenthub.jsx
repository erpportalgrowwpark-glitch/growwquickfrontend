import { useNavigate } from 'react-router-dom';

export default function UserInvestmentHub() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '100px auto' }}>
      <h2>Investment Hub</h2>
      <p style={{ color: '#555', marginBottom: '30px' }}>Manage your active investments and payouts.</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '0 20px' }}>
        <button onClick={() => navigate('/invest-now')} style={btnStyle('#28a745')}>
          Invest Now
        </button>
        <button onClick={() => navigate('/investment-history')} style={btnStyle('#007bff')}>
          View Investments
        </button>
        <button onClick={() => navigate('/payout-history')} style={btnStyle('#17a2b8')}>
          Payout History
        </button>
      </div>

      <button onClick={() => navigate('/dashboard')} style={{ marginTop: '40px', ...btnStyle('#333') }}>
        Back to Dashboard
      </button>
    </div>
  );
}

const btnStyle = (color) => ({
  padding: '15px 20px', fontSize: '18px', cursor: 'pointer', backgroundColor: color, 
  color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold'
});