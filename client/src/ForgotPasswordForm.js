import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./ForgotPasswordForm.css";

const ForgotPasswordForm = () => {
    const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);

  const handleSubmitEmail = (e) => {
    e.preventDefault();
    console.log('Email:', email);
    setStep(2);
  };

  const handleSubmitVerificationCode = (e) => {
    e.preventDefault();
    console.log('Verification Code:', verificationCode);
    setStep(3);
  };

  const handleSubmitNewPassword = (e) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      console.log('New Password:', newPassword);
      window.location.href = '/my-quotes';
    } else {
      alert('Passwords do not match');
    }
  };

  const handleSubmit = (e) => {
    setStep(step + 1);
    if(step === 3){
        navigate('/myQuotes');
    }
  }

  return (
    <div className="overall-containers">
        <h1>Amitron Quoting: Forgot Password</h1>
        <div className="forgot-containers">
            <form onSubmit={handleSubmitEmail}>
                <div style={{ display: (step >= 1) ? 'block' : 'none' }}>
                <label htmlFor="email">Email</label>
                <input
                    type="text"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                </div>
            </form>

            <form onSubmit={handleSubmitVerificationCode}>
                <div style={{ display: (step >= 2) ? 'block' : 'none' }}>
                <label htmlFor="verificationCode">Verification Code</label>
                <input
                    type="text"
                    id="verificationCode"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    required
                />
                </div>
            </form>

            <form onSubmit={handleSubmitNewPassword}>
                <div style={{ display: (step >= 3) ? 'block' : 'none' }}>
                <label htmlFor="newPassword">New Password</label>
                <input
                    type="text"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                </div>
                <div style={{ display: (step >= 3) ? 'block' : 'none' }}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                    type="text"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                </div>
            </form>
            {step >= 1 && <button type="submit" onClick={handleSubmit}>Submit</button>}
        </div>
    </div>
  );
};

export default ForgotPasswordForm;
