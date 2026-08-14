import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminUserList() {
  const [users, setUsers] = useState([]);
  
  // Modal States
  const [activeModal, setActiveModal] = useState(null); // 'password' or 'funds'
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Input States
  const [newPassword, setNewPassword] = useState('');
  const [fundAmount, setFundAmount] = useState('');
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();

  const getAdminHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://quickgrowwbackend.onrender.com/api/admin/users', getAdminHeaders());
      setUsers(response.data);
    } catch (error) {
      if (error.response?.status === 401) navigate('/admin-login');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [navigate]);

  // --- ACTION HANDLERS ---
  const openModal = (type, user) => {
    setActiveModal(type);
    setSelectedUser(user);
    setNewPassword('');
    setFundAmount('');
    setMessage('');
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedUser(null);
    setMessage('');
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("WARNING: This will permanently delete this user and all their wallet records.\n\nAre you absolutely sure?")) return;
    try {
      await axios.delete(`https://quickgrowwbackend.onrender.com/api/admin/users/${userId}`, getAdminHeaders());
      fetchUsers(); // Refresh list
    } catch(error) {
      alert(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`https://quickgrowwbackend.onrender.com/api/admin/users/${selectedUser._id}/password`, { newPassword }, getAdminHeaders());
      setMessage(response.data.message);
      setTimeout(() => closeModal(), 2000);
    } catch(error) {
      setMessage(error.response?.data?.message || 'Failed to update password');
    }
  };

  const handleFundAdjustment = async (action) => {
    if (!fundAmount || Number(fundAmount) <= 0) {
      setMessage('Please enter a valid amount');
      return;
    }
    
    if (action === 'subtract' && Number(fundAmount) > selectedUser.walletBalance) {
      setMessage('Amount exceeds current wallet balance');
      return;
    }

    try {
      const response = await axios.post(
        `https://quickgrowwbackend.onrender.com/api/admin/users/${selectedUser._id}/balance`, 
        { amount: Number(fundAmount), action }, 
        getAdminHeaders()
      );
      setMessage(response.data.message);
      fetchUsers(); // Refresh list to show new balance
      setTimeout(() => closeModal(), 2000);
    } catch(error) {
      setMessage(error.response?.data?.message || 'Failed to adjust funds');
    }
  };

  return (
    <div className="page-wrapper" style={pageStyle}>
      {/* INJECTED CSS FOR PROFESSIONAL STYLING AND MOBILE RESPONSIVENESS */}
      <style>
        {`
          * { box-sizing: border-box; }
          body {
            margin: 0; 
            background: linear-gradient(135deg, #000d22 0%, #002056 50%, #0a192f 100%);
            background-attachment: fixed;
          }

          /* CUSTOM INPUTS */
          .custom-input {
            background-color: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #ffffff;
            padding: 12px 15px;
            border-radius: 8px;
            font-size: 15px;
            transition: all 0.3s ease;
            outline: none;
            width: 100%;
          }
          .custom-input::placeholder { color: #a8b2d1; }
          .custom-input:focus { border-color: #00d27f; box-shadow: 0 0 10px rgba(0, 210, 127, 0.2); background-color: rgba(255, 255, 255, 0.1); }

          /* BUTTONS */
          .btn-outline {
            background-color: transparent; color: #a8b2d1; padding: 10px 20px;
            border: 2px solid rgba(255, 255, 255, 0.2); border-radius: 8px;
            font-weight: bold; font-size: 14px; cursor: pointer; transition: all 0.3s ease;
            display: flex; align-items: center; justify-content: center; gap: 8px;
          }
          .btn-outline:hover { background-color: rgba(255, 255, 255, 0.05); color: #ffffff; border-color: rgba(255, 255, 255, 0.4); transform: translateY(-2px); }

          .btn-primary { background-color: #00d27f; color: white; padding: 12px 20px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; transition: all 0.3s ease; width: 100%; }
          .btn-primary:hover { background-color: #00b36b; transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0, 210, 127, 0.3); }

          .btn-danger { background-color: #ff4757; color: white; padding: 12px 20px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; transition: all 0.3s ease; width: 100%; }
          .btn-danger:hover { background-color: #ff6b81; transform: translateY(-2px); box-shadow: 0 4px 15px rgba(255, 71, 87, 0.3); }

          /* ACTION GRID BUTTONS */
          .action-btn {
            padding: 8px 12px;
            border-radius: 6px;
            font-weight: bold;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            border: 1px solid transparent;
            white-space: nowrap;
          }
          .act-view { background: rgba(13, 202, 240, 0.1); color: #0dcaf0; border-color: rgba(13, 202, 240, 0.3); }
          .act-view:hover { background: #0dcaf0; color: #fff; box-shadow: 0 4px 10px rgba(13, 202, 240, 0.3); transform: translateY(-2px); }

          .act-funds { background: rgba(0, 210, 127, 0.1); color: #00d27f; border-color: rgba(0, 210, 127, 0.3); }
          .act-funds:hover { background: #00d27f; color: #fff; box-shadow: 0 4px 10px rgba(0, 210, 127, 0.3); transform: translateY(-2px); }

          .act-pwd { background: rgba(243, 156, 18, 0.1); color: #f39c12; border-color: rgba(243, 156, 18, 0.3); }
          .act-pwd:hover { background: #f39c12; color: #fff; box-shadow: 0 4px 10px rgba(243, 156, 18, 0.3); transform: translateY(-2px); }

          .act-del { background: rgba(255, 71, 87, 0.1); color: #ff4757; border-color: rgba(255, 71, 87, 0.3); }
          .act-del:hover { background: #ff4757; color: #fff; box-shadow: 0 4px 10px rgba(255, 71, 87, 0.3); transform: translateY(-2px); }

          /* TABLES & WRAPPERS */
          .table-wrapper {
            width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1); background: rgba(0, 0, 0, 0.1);
          }
          .custom-table { width: 100%; border-collapse: collapse; color: #fff; min-width: 800px; }
          .custom-table th { padding: 16px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.1); color: #a8b2d1; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; background: rgba(255, 255, 255, 0.02); }
          .custom-table td { padding: 16px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.05); white-space: nowrap; }
          .custom-table tr:hover td { background: rgba(255, 255, 255, 0.03); }
          .custom-table tr:last-child td { border-bottom: none; }

          /* MOBILE RESPONSIVENESS */
          @media (max-width: 600px) {
            .page-wrapper { padding: 15px 10px !important; }
            .glass-container { padding: 25px 15px !important; border-radius: 16px !important; }
            .header-action { margin-bottom: 20px; }
            .modal-content { width: 95% !important; padding: 20px !important; }
          }
        `}
      </style>

      <div className="glass-container" style={containerStyle}>
        
        {/* HEADER */}
        <div className="header-action" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 style={titleStyle}>User Management</h2>
          <button onClick={() => navigate('/admin-dashboard')} className="btn-outline">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Dashboard
          </button>
        </div>

        {/* USERS LIST SECTION */}
        {users.length === 0 ? (
          <div style={emptyStateStyle}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#a8b2d1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '15px' }}>
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <p style={{ color: '#a8b2d1', margin: 0, fontSize: '16px' }}>No users registered on the platform yet.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Wallet Balance</th>
                  <th>Management Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td style={{ fontWeight: 'bold', color: '#ffffff', fontSize: '15px' }}>
                      {user.name}
                    </td>
                    <td style={{ color: '#a8b2d1', fontSize: '14px' }}>
                      {user.email}
                    </td>
                    <td style={{ color: '#00d27f', fontWeight: 'bold', fontSize: '16px' }}>
                      ₹{user.walletBalance.toFixed(2)}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        
                        <button onClick={() => navigate(`/admin-user-transactions/${user._id}`)} className="action-btn act-view" title="View Account">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        </button>
                        
                        <button onClick={() => openModal('funds', user)} className="action-btn act-funds" title="Adjust Funds">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="1" x2="12" y2="23"></line>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                          </svg>
                        </button>

                        <button onClick={() => openModal('password', user)} className="action-btn act-pwd" title="Reset Password">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
                          </svg>
                        </button>

                        <button onClick={() => handleDeleteUser(user._id)} className="action-btn act-del" title="Delete User">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- MODALS --- */}
      
      {/* PASSWORD RESET MODAL */}
      {activeModal === 'password' && selectedUser && (
        <div style={modalOverlayStyle}>
          <div className="modal-content" style={modalContentStyle}>
            <h3 style={{ margin: '0 0 15px 0', color: 'white' }}>Reset Password</h3>
            <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#a8b2d1' }}>Updating password for: <b>{selectedUser.email}</b></p>
            
            {message && <div style={messageStyle(message)}>{message}</div>}

            <form onSubmit={handlePasswordReset} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input 
                type="text" 
                placeholder="Enter new password (min 6 chars)" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                required 
                className="custom-input"
              />
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Update</button>
                <button type="button" onClick={closeModal} className="btn-outline" style={{ flex: 1, padding: '12px' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FUND ADJUSTMENT MODAL */}
      {activeModal === 'funds' && selectedUser && (
        <div style={modalOverlayStyle}>
          <div className="modal-content" style={modalContentStyle}>
            <h3 style={{ margin: '0 0 15px 0', color: 'white' }}>Adjust Wallet Balance</h3>
            
            <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#a8b2d1', textTransform: 'uppercase' }}>Target Account</p>
              <p style={{ margin: '0 0 5px 0', color: 'white', fontWeight: 'bold' }}>{selectedUser.name}</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#a8b2d1', textTransform: 'uppercase' }}>Current Balance: <span style={{ color: '#00d27f', fontWeight: 'bold', fontSize: '16px' }}>₹{selectedUser.walletBalance.toFixed(2)}</span></p>
            </div>

            {message && <div style={messageStyle(message)}>{message}</div>}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input 
                type="number" 
                placeholder="Enter Amount (₹)" 
                value={fundAmount} 
                onChange={(e) => setFundAmount(e.target.value)} 
                className="custom-input"
              />
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button onClick={() => handleFundAdjustment('add')} className="btn-primary" style={{ flex: 1 }}>Add Funds</button>
                <button onClick={() => handleFundAdjustment('subtract')} className="btn-danger" style={{ flex: 1 }}>Deduct Funds</button>
              </div>
              <button onClick={closeModal} className="btn-outline" style={{ width: '100%', marginTop: '5px' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// STYLES
const pageStyle = {
  background: 'linear-gradient(135deg, #000d22 0%, #002056 50%, #0a192f 100%)', 
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  padding: '40px 20px',
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
  maxWidth: '900px',
  width: '100%',
  boxSizing: 'border-box'
};

const titleStyle = {
  color: '#ffffff', 
  margin: '0',
  fontSize: '26px',
  fontWeight: '800',
  letterSpacing: '-0.5px'
};

const emptyStateStyle = {
  padding: '60px 20px', 
  textAlign: 'center', 
  background: 'rgba(255,255,255,0.02)', 
  borderRadius: '12px', 
  border: '1px dashed rgba(255,255,255,0.1)'
};

/* MODAL STYLES */
const modalOverlayStyle = {
  position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
  backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  padding: '15px', boxSizing: 'border-box'
};

const modalContentStyle = {
  background: 'linear-gradient(135deg, #112240 0%, #0a192f 100%)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  padding: '30px',
  borderRadius: '16px',
  maxWidth: '400px',
  width: '100%',
  textAlign: 'left',
  boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
  boxSizing: 'border-box'
};

const messageStyle = (message) => ({
  padding: '10px',
  borderRadius: '8px',
  marginBottom: '15px',
  backgroundColor: message.includes('success') || message.includes('Successfully') ? 'rgba(0, 210, 127, 0.1)' : 'rgba(220, 53, 69, 0.1)',
  border: `1px solid ${message.includes('success') || message.includes('Successfully') ? '#00d27f' : '#ff4757'}`,
  color: message.includes('success') || message.includes('Successfully') ? '#00d27f' : '#ff4757',
  fontWeight: 'bold',
  fontSize: '13px',
  textAlign: 'center'
});