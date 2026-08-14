import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function UserRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://quickgrowwbackend.onrender.com/api/auth/register', {
        name,
        email,
        password
      });
      setMessage(response.data.message);
      // Redirect to login after successful registration
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div style={pageStyle}>
      {/* INJECTED CSS FOR HOVERS AND INPUT FOCUS */}
      <style>
        {`
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
            box-sizing: border-box;
          }
          .custom-input::placeholder {
            color: #a8b2d1;
          }
          .custom-input:focus {
            border-color: #00d27f;
            box-shadow: 0 0 10px rgba(0, 210, 127, 0.2);
            background-color: rgba(255, 255, 255, 0.1);
          }
          .btn-primary {
            background-color: #00d27f; 
            color: white;
            padding: 14px 30px;
            border: none;
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 15px rgba(0, 210, 127, 0.2);
            width: 100%;
            margin-top: 10px;
          }
          .btn-primary:hover {
            background-color: #00b36b;
            box-shadow: 0 8px 20px rgba(0, 210, 127, 0.4);
            transform: translateY(-2px); 
          }
          .custom-link {
            color: #00d27f;
            text-decoration: none;
            font-weight: bold;
            transition: all 0.2s ease;
          }
          .custom-link:hover {
            color: #00b36b;
            text-decoration: underline;
          }
        `}
      </style>

      <div style={containerStyle}>
        {/* LOGO INTEGRATION - SQUARE BOX */}
        <div style={logoContainerStyle}>
          <img src="/growwpark_logo.jpg" alt="GrowwPark Logo" style={logoStyle} />
        </div>

        <h2 style={titleStyle}>Create Account</h2>
        <p style={subtitleStyle}>Join GrowwPark to start your journey</p>

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
        
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="text" 
            placeholder="Full Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            className="custom-input"
          />
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="custom-input"
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="custom-input"
          />
          <button type="submit" className="btn-primary">Register Account</button>
        </form>

        <p style={footerTextStyle}>
          Already have an account? <Link to="/login" className="custom-link">Login here</Link>
        </p>
        <p style={{ ...footerTextStyle, marginTop: '10px' }}>
          <Link to="/" className="custom-link">Back to Home</Link>
        </p>
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
  margin: '0 0 10px 0',
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

const footerTextStyle = {
  color: '#a8b2d1',
  fontSize: '14px',
  margin: '20px 0 0 0'
};