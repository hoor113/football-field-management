import axios from "axios";
import React, { useState } from "react";
import "../styles/CustomerLogin.css"

const CustomerLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/customer/login`, formData);
      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error("Login error:", error);
      const message = error.response ? error.response.data.message : "An error occurred. Please try again.";
      alert(message);
    }
  };

  return (
    <div className="customer-login-container">
      {/* Left side - Banner */}
      <div className="customer-login-banner">
        <h1 className="customer-login-banner-text">
          Hãy nâng tầm trải nghiệm đặt sân ngay bây giờ
        </h1>
      </div>

      {/* Right side - Form */}
      <div className="customer-login-form-container">
        <div className="customer-login-box">
          <h2 className="customer-login-title">Customer Login</h2>
          <form onSubmit={handleSubmit} className="customer-login-form">
            <div className="customer-login-form-group">
              <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="customer-login-input"
              />
            </div>
            <div className="customer-login-form-group">
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="customer-login-input"
              />
            </div>
            <button type="submit" className="customer-login-button">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default CustomerLogin;