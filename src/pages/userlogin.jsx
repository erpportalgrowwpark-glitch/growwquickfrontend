import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import axios from 'axios';

export default function UserLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate(); // Initialize navigate

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('[https://quickgrowwbackend.onrender.com](https://quickgrowwbackend.onrender.com)/api/auth/login', {
        email,
        password
      });
      
      setMessage(response.data.message);
      // Save token
      localStorage.setItem('token', response.data.token);
      
      // Redirect to dashboard instantly
      navigate('/dashboard');
      
    } catch (error) {
      setMessage(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2>Login</h2>
      {message && <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}
      
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
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
        <button type="submit" style={{ padding: '10px', cursor: 'pointer' }}>Login</button>
      </form>
      <p style={{ marginTop: '15px' }}>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
      <p style={{ marginTop: '5px' }}>
        <Link to="/">Back to Home</Link>
      </p>
    </div>
  );
}