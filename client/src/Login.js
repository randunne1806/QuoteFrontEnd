import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Authentication successful, redirect to the desired route
        navigate('/myQuotes');
      } else {
        // Authentication failed, display error message
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while logging in');
    }
  };

  const handleRegister = () => {
    console.log("Register");
    navigate('/registerForm');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleContactSupport = () => {
    window.location.href = 'mailto:support@amitron.com';
  };

  return (
    <div className="everything">
      <div>
        <h1 className="app-title">Amitron Quoting Platform</h1>
      </div>
      <div className="login-container">
        <h2 className="login-title">Log In</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              className="custom-input"
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
              <div className="password-input">
                <input
                  className="custom-input"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="password-toggle-btn"
                >
                  {showPassword ? '👁️' : '🔒'}
                </button>
              </div>
          </div>
          <button type="submit">Login</button>
          <p>
            <span style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }} onClick={handleRegister}>Register</span>
            &nbsp;|&nbsp;
            Forgot Password? Contact <span style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }} onClick={handleContactSupport}>support@amitron.com</span>            
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
