import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function UserBankDetailsManagement() {
  const [banks, setBanks] = useState([]);
  const [bankName, setBankName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    try {
      const response = await axios.get('https://quickgrowwbackend.onrender.com/api/bank', getAuthHeaders());
      setBanks(response.data);
    } catch (error) {
      if (error.response?.status === 401) navigate('/login');
    }
  };

  const handleAddBank = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://quickgrowwbackend.onrender.com/api/bank/add',
        { bankName, branchName, accountNumber, ifscCode },
        getAuthHeaders()
      );
      setMessage(response.data.message);
      setBankName(''); setBranchName(''); setAccountNumber(''); setIfscCode('');
      fetchBanks(); // Refresh list
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to add bank');
    }
  };

  const handleDeleteBank = async (id) => {
    if (!window.confirm('Are you sure you want to delete this bank card?')) return;
    try {
      await axios.delete(`https://quickgrowwbackend.onrender.com/api/bank/${id}`, getAuthHeaders());
      fetchBanks(); // Refresh list
    } catch (error) {
      alert('Failed to delete bank');
    }
  };

  return (
    <div className="page-wrapper" style={pageStyle}>
      {/* INJECTED CSS FOR RESPONSIVENESS AND THEMING */}
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
            padding: 12px 15px;
            border-radius: 8px;
            font-size: 15px;
            transition: all 0.3s ease;
            outline: none;
            width: 100%;
            box-sizing: border-box;
          }
          .custom-input::placeholder { color: #a8b2d1; }
          .custom-input:focus {
            border-color: #00d27f;
            box-shadow: 0 0 10px rgba(0, 210, 127, 0.2);
            background-color: rgba(255, 255, 255, 0.1);
          }
          
          .btn-primary {
            background-color: #00d27f; 
            color: white;
            padding: 14px 25px;
            border: none;
            border-radius: 8px;
            font-weight: bold;
            font-size: 15px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 210, 127, 0.2);
            width: 100%;
          }
          .btn-primary:hover {
            background-color: #00b36b;
            box-shadow: 0 8px 20px rgba(0, 210, 127, 0.4);
            transform: translateY(-2px); 
          }

          .btn-outline {
            background-color: transparent;
            color: #00d27f;
            padding: 10px 20px;
            border: 2px solid #00d27f;
            border-radius: 8px;
            font-weight: bold;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .btn-outline:hover {
            background-color: rgba(0, 210, 127, 0.1);
            transform: translateY(-2px);
          }
          
          .btn-danger-outline {
            background-color: transparent;
            color: #ff4757;
            padding: 8px 15px;
            border: 1px solid #ff4757;
            border-radius: 6px;
            font-weight: bold;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .btn-danger-outline:hover {
            background-color: rgba(255, 71, 87, 0.1);
            transform: translateY(-2px);
          }

          /* VIRTUAL BANK CARD DESIGN */
          .saved-bank-card {
            background: linear-gradient(135deg, #1a2a40 0%, #0a192f 100%);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.3);
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }
          .saved-bank-card:hover {
            border-color: rgba(0, 210, 127, 0.4);
            transform: translateY(-3px);
            box-shadow: 0 12px 25px rgba(0,0,0,0.4);
          }
          
          /* MINI EMV CHIP */
          .mini-chip {
            width: 30px;
            height: 22px;
            background: linear-gradient(135deg, #e0c389 0%, #c19b45 100%);
            border-radius: 4px;
            position: relative;
            margin-bottom: 15px;
            border: 1px solid #8e6a21;
          }

          /* RESPONSIVE GRID */
          .content-grid {
            display: flex;
            gap: 40px;
            margin-top: 30px;
          }
          .form-section {
            flex: 1;
            min-width: 300px;
            background: rgba(255, 255, 255, 0.03);
            padding: 25px;
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.05);
          }
          .cards-section {
            flex: 1;
            min-width: 300px;
          }

          /* MOBILE RESPONSIVENESS */
          @media (max-width: 768px) {
            .content-grid {
              flex-direction: column;
              gap: 30px;
            }
            .page-wrapper {
              padding: 20px 15px !important;
            }
            .glass-container {
              padding: 25px 20px !important;
            }
          }
        `}
      </style>

      <div className="glass-container" style={containerStyle}>

        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px', gap: '15px', flexWrap: 'wrap' }}>
          <h2 style={titleStyle}>Manage Banks</h2>
          <button onClick={() => navigate('/wallet')} style={{ width: '36px', height: '36px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: '#ff4757', color: 'white', border: 'none', cursor: 'pointer', flexShrink: 0, boxShadow: '0 4px 10px rgba(255, 71, 87, 0.3)' }} title="Go Back">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
        </div>

        <div className="content-grid">

          {/* LEFT: ADD BANK FORM */}
          <div className="form-section">
            <h3 style={sectionTitleStyle}>Add New Bank Card</h3>

            {message && (
              <div style={{
                padding: '10px',
                borderRadius: '8px',
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

            <form onSubmit={handleAddBank} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={labelStyle}>Bank Name</label>
                <input type="text" placeholder="e.g. HDFC Bank" value={bankName} onChange={(e) => setBankName(e.target.value)} required className="custom-input" />
              </div>
              <div>
                <label style={labelStyle}>Branch Name</label>
                <input type="text" placeholder="e.g. MG Road Branch" value={branchName} onChange={(e) => setBranchName(e.target.value)} required className="custom-input" />
              </div>
              <div>
                <label style={labelStyle}>Account Number</label>
                <input type="text" placeholder="Enter valid account number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required className="custom-input" />
              </div>
              <div>
                <label style={labelStyle}>IFSC Code</label>
                <input type="text" placeholder="e.g. HDFC0001234" value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} required className="custom-input" />
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
                Securely Save Bank
              </button>
            </form>
          </div>

          {/* RIGHT: SAVED BANKS LIST */}
          <div className="cards-section">
            <h3 style={sectionTitleStyle}>Linked Bank Cards</h3>

            {banks.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                <p style={{ color: '#a8b2d1', margin: 0 }}>No banks linked yet. Add a bank to easily withdraw your funds.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {banks.map(bank => (
                  <div key={bank._id} className="saved-bank-card">
                    {/* Background decoration */}
                    <div style={{ position: 'absolute', right: '-20px', top: '-20px', width: '100px', height: '100px', background: 'rgba(255,255,255,0.02)', borderRadius: '50%', zIndex: 0 }}></div>

                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div className="mini-chip"></div>
                      <h4 style={{ margin: '0 0 8px 0', color: '#ffffff', fontSize: '18px', letterSpacing: '0.5px' }}>
                        {bank.bankName}
                      </h4>
                      <p style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#a8b2d1', fontFamily: 'monospace', letterSpacing: '2px' }}>
                        **** **** **** {bank.accountNumber.slice(-4)}
                      </p>
                      <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                        <p style={{ margin: 0, fontSize: '12px', color: '#8892b0', textTransform: 'uppercase' }}>
                          <span style={{ display: 'block', fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>Branch</span>
                          {bank.branchName}
                        </p>
                        <p style={{ margin: 0, fontSize: '12px', color: '#8892b0', textTransform: 'uppercase' }}>
                          <span style={{ display: 'block', fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>IFSC</span>
                          {bank.ifscCode}
                        </p>
                      </div>
                    </div>

                    <div style={{ position: 'relative', zIndex: 1, alignSelf: 'flex-start' }}>
                      <button onClick={() => handleDeleteBank(bank._id)} className="btn-danger-outline">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
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
  width: '100%'
};

const titleStyle = {
  color: '#ffffff',
  margin: '0',
  fontSize: '28px',
  fontWeight: '800',
  letterSpacing: '-0.5px'
};

const sectionTitleStyle = {
  color: '#ffffff',
  margin: '0 0 20px 0',
  fontSize: '20px',
  fontWeight: 'bold',
  borderBottom: '2px solid rgba(0, 210, 127, 0.3)',
  paddingBottom: '10px',
  display: 'inline-block'
};

const labelStyle = {
  display: 'block',
  marginBottom: '6px',
  fontSize: '13px',
  fontWeight: 'bold',
  color: '#a8b2d1',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};