import React, { useState } from 'react';
import axios from 'axios';
import "../styles/CustomerRegister.css"

const CustomerRegister = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    fullname: '',
    sex: '',
    birthday: '',
    phone_no: '',
    email: ''
  });

  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Password validation
    if (formData.password !== formData.confirmPassword) {
        setPasswordError("Passwords don't match!");
        return;
    }
    if (formData.password.length < 6) {
        setPasswordError("Password must be at least 6 characters long!");
        return;
    }
    
    // Reset error if validation passes
    setPasswordError('');

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/customer/register`, formData);
      alert(response.data.message);  // Hiển thị thông báo thành công
      // Redirect to login page
      window.location.href = '/customer/login';
    } catch (error) {
      const message = error.response ? error.response.data.message : "An error occurred. Please try again.";
      alert(message);  // Hiển thị thông báo lỗi
    }
  };

  return (
    <div className="customer-register-container">
      <h2>CustomerRegister</h2>
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
        <div>
          <input
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />
        </div>
        {passwordError && <div className="error-message">{passwordError}</div>}
        <div>
          <input
            type="text"
            placeholder="Full Name"
            value={formData.fullname}
            onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
          />
        </div>
        <div>
          <select
            value={formData.sex}
            onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <input
            type="date"
            placeholder="Birthday"
            value={formData.birthday}
            onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Phone Number"
            value={formData.phone_no}
            onChange={(e) => setFormData({ ...formData, phone_no: e.target.value })}
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default CustomerRegister;
