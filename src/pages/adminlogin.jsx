import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminLogin() {
  const [username, setUsername] = useState(''); //[cite: 20]
  const [password, setPassword] = useState(''); //[cite: 20]
  const [message, setMessage] = useState(''); //[cite: 20]
  
  const navigate = useNavigate(); //[cite: 20]

  const handleLogin = async (e) => {
    e.preventDefault(); //[cite: 20]
    try {
      const response = await axios.post('https://quickgrowwbackend.onrender.com/api/auth/admin-login', {
        username,
        password
      }); //[cite: 20]
      
      setMessage(response.data.message); //[cite: 20]
      // Save the token separately as adminToken
      localStorage.setItem('adminToken', response.data.token); //[cite: 20]
      
      navigate('/admin-dashboard'); //[cite: 20]
      
    } catch (error) {
      setMessage(error.response?.data?.message || 'Something went wrong'); //[cite: 20]
    }
  };

  return (
    <div className="page-wrapper" style={pageStyle}>
      {/* INJECTED CSS FOR HOVERS AND INPUT FOCUS */}
      <style>
        {`
          * { box-sizing: border-box; }
          body {
            margin: 0; 
            background: linear-gradient(135deg, #000d22 0%, #002056 50%, #0a192f 100%);
            background-attachment: fixed;
          }
          .custom-input {
            background-color: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #ffffff;
            padding: 14px 15px;
            border-radius: 8px;
            font-size: 15px;
            transition: all 0.3s ease;
            outline: none;
            width: 100%;
          }
          .custom-input::placeholder {
            color: #a8b2d1;
          }
          .custom-input:focus {
            border-color: #00d27f;
            box-shadow: 0 0 10px rgba(0, 210, 127, 0.2);
            background-color: rgba(255, 255, 255, 0.1);
          }
          .btn-admin {
            background-color: #1a2a40; /* Sleek dark slate for admin */
            color: white;
            padding: 14px 30px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            width: 100%;
            margin-top: 10px;
          }
          .btn-admin:hover {
            background-color: #00d27f; /* Brand green on hover */
            border-color: #00d27f;
            box-shadow: 0 8px 20px rgba(0, 210, 127, 0.4);
            transform: translateY(-2px); 
          }
          .custom-link {
            color: #a8b2d1;
            text-decoration: none;
            font-weight: bold;
            transition: all 0.2s ease;
            font-size: 14px;
          }
          .custom-link:hover {
            color: #00d27f;
            text-decoration: underline;
          }

          /* MOBILE RESPONSIVENESS */
          @media (max-width: 600px) {
            .page-wrapper { padding: 20px 15px !important; }
            .glass-container { padding: 30px 20px !important; }
          }
        `}
      </style>

      <div className="glass-container" style={containerStyle}>
        
        {/* LOGO INTEGRATION - SQUARE BOX */}
        <div style={logoContainerStyle}>
          <img src="/growwpark_logo.jpg" alt="GrowwPark Logo" style={logoStyle} />
        </div>

        <h2 style={titleStyle}>Admin Portal</h2>
        <p style={subtitleStyle}>Secure access to platform controls</p>

        {message && (
          <div style={{
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '15px',
            backgroundColor: message.includes('success') ? 'rgba(0, 210, 127, 0.1)' : 'rgba(220, 53, 69, 0.1)',
            border: `1px solid ${message.includes('success') ? '#00d27f' : '#dc3545'}`,
            color: message.includes('success') ? '#00d27f' : '#ff6b6b',
            fontWeight: 'bold',
            fontSize: '14px'
          }}>
            {message}
          </div>
        )}
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="text" 
            placeholder="Admin Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
            className="custom-input"
          />
          <input 
            type="password" 
            placeholder="Admin Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="custom-input"
          />
          <button type="submit" className="btn-admin">Authenticate</button>
        </form>

        <div style={{ marginTop: '25px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '15px' }}>
          <Link to="/" className="custom-link">
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Return to Public Site
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

// INLINE STYLES
const pageStyle = {
  background: 'linear-gradient(135deg, #000d22 0%, #002056 50%, #0a192f 100%)', 
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  padding: '20px',
  boxSizing: 'border-box'
};

const containerStyle = {
  background: 'rgba(10, 25, 47, 0.7)', 
  backdropFilter: 'blur(16px)', 
  WebkitBackdropFilter: 'blur(16px)', 
  border: '1px solid rgba(255, 255, 255, 0.2)', 
  padding: '40px',
  borderRadius: '20px', 
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)', 
  textAlign: 'center',
  maxWidth: '400px',
  width: '100%'
};

const logoContainerStyle = {
  width: '90px',
  height: '90px',
  backgroundColor: '#ffffff', 
  borderRadius: '12px', 
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 20px auto', 
  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)' 
};

const logoStyle = {
  maxWidth: '85%', 
  maxHeight: '85%',
  objectFit: 'contain' 
};

const titleStyle = {
  color: '#ffffff', 
  margin: '0 0 5px 0',
  fontSize: '24px',
  fontWeight: '800',
  letterSpacing: '-0.5px'
};

const subtitleStyle = {
  color: '#a8b2d1',
  margin: '0 0 25px 0',
  fontSize: '14px',
  lineHeight: '1.6'
};