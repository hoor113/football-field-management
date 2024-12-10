import React, { useState } from "react";
import axios from "axios";
import "../styles/FieldOwnerLogin.css";

const FieldOwnerLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/field_owner/login`, formData);
      localStorage.setItem('token', response.data.token);
      window.location.href = '/';
    } catch (error) {
      const message = error.response ? error.response.data.message : "An error occurred. Please try again.";
      alert(message);
    }
  };

  return (
    <div className="field-owner-login-container">
      {/* Left side - Banner */}
      <div className="field-owner-login-banner">
        <h1 className="field-owner-login-banner-text">
          Hãy đến với chúng tôi và tham gia vào cuộc cách mạng đặt sân ngay bây giờ
        </h1>
      </div>

      {/* Right side - Form */}
      <div className="field-owner-login-form-container">
        <div className="field-owner-login-box">
          <h2 className="field-owner-login-title">Field Owner Login</h2>
          <form onSubmit={handleSubmit} className="field-owner-login-form">
            <div className="field-owner-login-form-group">
              <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="field-owner-login-input"
              />
            </div>
            <div className="field-owner-login-form-group">
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="field-owner-login-input"
              />
            </div>
            <button type="submit" className="field-owner-login-button">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FieldOwnerLogin;