import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'sans-serif' }}>
      <h1>Welcome to Quick Income Platform</h1>
      <p>Please select an option to continue:</p>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
        <Link to="/login" style={buttonStyle}>
          User Login
        </Link>
        <Link to="/register" style={buttonStyle}>
          User Register
        </Link>
        <Link to="/admin-login" style={{ ...buttonStyle, backgroundColor: '#333' }}>
          Admin Login
        </Link>
      </div>
    </div>
  );
}

// Quick inline style for the buttons to keep it looking clean
const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: 'white',
  textDecoration: 'none',
  borderRadius: '5px',
  fontWeight: 'bold'
};