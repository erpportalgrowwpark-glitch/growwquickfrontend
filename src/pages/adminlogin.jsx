import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('import.meta.env.VITE_API_URL/api/auth/admin-login', {
        username,
        password
      });
      
      setMessage(response.data.message);
      // Save the token separately as adminToken
      localStorage.setItem('adminToken', response.data.token);
      
      navigate('/admin-dashboard');
      
    } catch (error) {
      setMessage(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#333' }}>Admin Login</h2>
      {message && <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}
      
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
          style={{ padding: '10px' }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{ padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#333', color: 'white', border: 'none' }}>
          Login as Admin
        </button>
      </form>
      <p style={{ marginTop: '15px' }}>
        <Link to="/">Back to Home</Link>
      </p>
    </div>
  );
}