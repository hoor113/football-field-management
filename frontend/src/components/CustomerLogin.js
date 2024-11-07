import axios from "axios";
import React, { useState } from "react";
import "./CustomerLogin.css"

const Login = () => {
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
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};
export default Login;