import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landingpage';
import UserRegister from './pages/userregister';
import UserLogin from './pages/userlogin';
import UserDashboard from './pages/userdashboard';
import AdminLogin from './pages/adminlogin';
import AdminDashboard from './pages/admindashboard';
import UserWallet from './pages/userwallet';
import AdminWalletManagement from './pages/adminwalletmanagement';
import UserBankDetailsManagement from './pages/userbankdetailsmanagement';
import AdminUserList from './pages/adminuserlist';
import AdminUserTransactionHistory from './pages/adminusertransactionhistory';
import AdminBankManagement from './pages/adminbankmanagement';
import UserInvestmentHub from './pages/userinvestmenthub';
import UserInvestmentsHistory from './pages/userinvestmentshistory';
import UserPayoutHistory from './pages/userpayouthistory';

// ADDED IMPORT FOR INVESTMENTS
import UserInvestment from './pages/userinvestment'; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      
      {/* User Routes */}
      <Route path="/register" element={<UserRegister />} />
      <Route path="/login" element={<UserLogin />} />
      <Route path="/dashboard" element={<UserDashboard />} />
      <Route path="/wallet" element={<UserWallet />} />
      <Route path="/bank-management" element={<UserBankDetailsManagement />} />
      <Route path="/investments" element={<UserInvestmentHub />} />
      <Route path="/invest-now" element={<UserInvestment />} />
      <Route path="/investment-history" element={<UserInvestmentsHistory />} />
      <Route path="/payout-history" element={<UserPayoutHistory />} />
      
      {/* ADDED ROUTE FOR INVESTMENTS */}
      
      
      {/* Admin Routes */}
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/admin-wallet" element={<AdminWalletManagement />} />
      <Route path="/admin-users" element={<AdminUserList />} />  
      <Route path="/admin-user-transactions/:id" element={<AdminUserTransactionHistory />} />
      <Route path="/admin-bank" element={<AdminBankManagement />} />
    </Routes>
  );
}

export default App;