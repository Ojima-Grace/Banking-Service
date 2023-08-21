import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css';
import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/Home';
import SignUpPage from './components/SignUp';
import LoginPage from './components/Login';
import TransferPage from './components/Transfer';
import TransactionsPage from './components/Transactions';
import ApplyForLoanPage from './components/ApplyForLoan';
import RepayLoanPage from './components/RepayLoan';
import LoansPage from './components/Loans';
import AccountsPage from './components/Accounts';
import AccountBalancePage from './components/AccountBalance';
import OpenAccountPage from './components/OpenAccount';
import ActivateAccountPage from './components/ActivateAccount';
import DeactivateAccountPage from './components/DeactivateAccount';

const App = () => {
  return (
    <Router>
      <div className="container">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/transfer" element={<TransferPage />} />
          {/* <Route path="/transactions" element={<TransactionsPage />} /> */}
          <Route path="/apply-for-loan" element={<ApplyForLoanPage />} />
          <Route path="/repay-loan" element={<RepayLoanPage />} />
          <Route path="/loans" element={<LoansPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          {/* <Route path="/account-balance" element={<AccountBalancePage />} /> */}
          <Route path="/open-bank-account" element={<OpenAccountPage />} />" 
          <Route path="/activate" element={<ActivateAccountPage />} />"  
          <Route path="/deactivate" element={<DeactivateAccountPage />} />"      
        </Routes>
      </div>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
