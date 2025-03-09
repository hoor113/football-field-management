import React, { useState } from 'react';
import axios from 'axios';
import "#styles/CustomerRegister.css"

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
      {/* Left side - Banner */}
      <div className="customer-register-banner">
        <h1 className="customer-register-banner-text">
          Hãy nâng tầm trải nghiệm đặt sân ngay bây giờ
        </h1>
      </div>

      {/* Right side - Form */}
      <div className="customer-register-form-container">
        <div className="customer-register-box">
          <h2 className="customer-register-title">Khách Hàng Đăng Ký</h2>
          <form onSubmit={handleSubmit} className="customer-register-form">
            <div className="customer-register-form-group">
              <input
                type="text"
                placeholder="Tên đăng nhập"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="customer-register-input"
              />
            </div>
            <div className="customer-register-form-group">
              <input
                type="password"
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="customer-register-input"
              />
            </div>
            <div className="customer-register-form-group">
              <input
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="customer-register-input"
              />
            </div>
            {passwordError && <div className="error-message">{passwordError}</div>}
            <div className="customer-register-form-group">
              <input
                type="text"
                placeholder="Họ tên"
                value={formData.fullname}
                onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                className="customer-register-input"
              />
            </div>
            <div className="customer-register-form-group">
              <select
                value={formData.sex}
                onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                className="customer-register-input"
              >
                <option value="">Chọn giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>
            <div className="customer-register-form-group">
              <input
                type="date"
                placeholder="Ngày sinh"
                value={formData.birthday}
                onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                className="customer-register-input"
              />
            </div>
            <div className="customer-register-form-group">
              <input
                type="text"
                placeholder="Số điện thoại"
                value={formData.phone_no}
                onChange={(e) => setFormData({ ...formData, phone_no: e.target.value })}
                className="customer-register-input"
              />
            </div>
            <div className="customer-register-form-group">
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="customer-register-input"
              />
            </div>
            <button type="submit" className="customer-register-button">Đăng ký</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerRegister;
