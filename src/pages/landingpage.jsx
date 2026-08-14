import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div style={pageStyle}>
      {/* INJECTED CSS FOR PROFESSIONAL HOVER EFFECTS */}
      <style>
        {`
          body {
            margin: 0; 
            /* Fixed Gradient: Light Dark Blue fading smoothly to Dark Blue */
            background: linear-gradient(135deg, #08285c 25%, #07142a 50%, #0a192f 100%);
            background-attachment: fixed;
          }
          .btn-primary {
            background-color: #00d27f; 
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: inline-block;
            border: 2px solid #00d27f;
            box-shadow: 0 4px 15px rgba(0, 210, 127, 0.2);
          }
          .btn-primary:hover {
            background-color: #00b36b;
            border-color: #00b36b;
            box-shadow: 0 8px 20px rgba(0, 210, 127, 0.4);
            transform: translateY(-3px); 
          }
          .btn-outline {
            background-color: transparent;
            color: #00d27f;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: inline-block;
            border: 2px solid #00d27f;
          }
          .btn-outline:hover {
            background-color: #00d27f;
            color: white;
            box-shadow: 0 8px 20px rgba(0, 210, 127, 0.3);
            transform: translateY(-3px);
          }
        `}
      </style>

      <div style={containerStyle}>
        {/* LOGO INTEGRATION - SQUARE BOX */}
        <div style={logoContainerStyle}>
          <img src="/growwpark_logo.jpg" alt="GrowwPark Logo" style={logoStyle} />
        </div>
        
        <h1 style={titleStyle}>
          Welcome to <span style={{ color: '#00d27f' }}>GrowwPark</span>
        </h1>
        <p style={subtitleStyle}>
          Your premium wealth generation platform. Please select an option to continue.
        </p>
        
        <div style={buttonContainerStyle}>
          <Link to="/login" className="btn-primary">
            Login
          </Link>
          <Link to="/register" className="btn-outline">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}

// INLINE STYLES
const pageStyle = {
  background: 'linear-gradient(135deg, #000d22 0%, #002056 50%, #0a192f 100%)', // Matches the body
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  padding: '20px',
  boxSizing: 'border-box'
};

const containerStyle = {
  // GLASSMORPHISM EFFECT
  background: 'rgba(10, 25, 47, 0.7)', 
  backdropFilter: 'blur(16px)', 
  WebkitBackdropFilter: 'blur(16px)', 
  border: '1px solid rgba(255, 255, 255, 0.2)', // Sharper white edge
  
  padding: '50px 40px',
  borderRadius: '20px', 
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)', 
  textAlign: 'center',
  maxWidth: '450px',
  width: '100%'
};

const logoContainerStyle = {
  width: '110px',
  height: '110px',
  backgroundColor: '#ffffff', // Solid white box
  borderRadius: '12px', // Slight curve for a modern square look
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 25px auto', // Centers the box and adds spacing below
  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)' // Deep shadow under the box
};

const logoStyle = {
  maxWidth: '85%', // Leaves a nice padding inside the box
  maxHeight: '85%',
  objectFit: 'contain' // Strictly prevents stretching or cropping
};

const titleStyle = {
  color: '#ffffff', 
  margin: '0 0 15px 0',
  fontSize: '28px',
  fontWeight: '800',
  letterSpacing: '-0.5px'
};

const subtitleStyle = {
  color: '#a8b2d1', // Slate gray-blue for readability
  margin: '0 0 35px 0',
  fontSize: '15px',
  lineHeight: '1.6'
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '15px',
  flexWrap: 'wrap'
};