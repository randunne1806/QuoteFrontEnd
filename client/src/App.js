import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './Login'; // Import your Login component here
import CreateQuote from './CreateQuote'; // Import your desired component here
import MyQuotes from './MyQuotes';
import NewQuote from './NewQuote';
import Upload from './Upload'
import PlaceOrder from './PlaceOrder';
//import CartSummary from './CartSummary';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import Home from './Home';
import CartSummary from './CartSummary';
import PricingTable from './PricingTable.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/createQuote" element={<CreateQuote />} />
        <Route path="/myQuotes" element={<MyQuotes />} />
        <Route path="/newQuote" element={<NewQuote />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/placeOrder" element={<PlaceOrder />} />
        <Route path="/registerForm" element={<RegisterForm />} />
        <Route path="/forgotPassword" element={<ForgotPasswordForm />} />
        <Route path="/home" element={<Home />} />
        <Route path="/cartSummary" element={<CartSummary />} />
        <Route path="/pricingTable" element={<PricingTable />} />
      </Routes>
    </Router>
  );
}

export default App;
