import React, { useState } from 'react';
import axios from 'axios';
import "#styles/FieldOwnerRegister.css"

const FieldOwnerRegister = () => {
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
    
    if (formData.password !== formData.confirmPassword) {
        setPasswordError("Mật khẩu không khớp!");
        return;
    }
    if (formData.password.length < 6) {
        setPasswordError("Mật khẩu phải có ít nhất 6 ký tự!");
        return;
    }
    
    setPasswordError('');

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/field-owner/register`, formData);
      alert(response.data.message);
      window.location.href = '/field-owner/login';
    } catch (error) {
      const message = error.response ? error.response.data.message : "Có lỗi xảy ra. Vui lòng thử lại.";
      alert(message);
    }
  };

  return (
    <div className="field-owner-register-container">
      {/* Left side - Banner */}
      <div className="field-owner-register-banner">
        <h1 className="field-owner-register-banner-text">
          Hãy đến với chúng tôi và tham gia vào cuộc cách mạng đặt sân ngay bây giờ
        </h1>
      </div>

      {/* Right side - Form */}
      <div className="field-owner-register-form-container">
        <div className="field-owner-register-box">
          <h2 className="field-owner-register-title">Chủ Sân Đăng Ký</h2>
          <form onSubmit={handleSubmit} className="field-owner-register-form">
            <div className="field-owner-register-form-group">
              <input
                type="text"
                placeholder="Tên đăng nhập"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="field-owner-register-input"
              />
            </div>
            <div className="field-owner-register-form-group">
              <input
                type="password"
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="field-owner-register-input"
              />
            </div>
            <div className="field-owner-register-form-group">
              <input
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="field-owner-register-input"
              />
            </div>
            {passwordError && <div className="error-message">{passwordError}</div>}
            <div className="field-owner-register-form-group">
              <input
                type="text"
                placeholder="Họ tên"
                value={formData.fullname}
                onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                className="field-owner-register-input"
              />
            </div>
            <div className="field-owner-register-form-group">
              <select
                value={formData.sex}
                onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                className="field-owner-register-input"
              >
                <option value="">Chọn giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>
            <div className="field-owner-register-form-group">
              <input
                type="date"
                placeholder="Ngày sinh"
                value={formData.birthday}
                onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                className="field-owner-register-input"
              />
            </div>
            <div className="field-owner-register-form-group">
              <input
                type="text"
                placeholder="Số điện thoại"
                value={formData.phone_no}
                onChange={(e) => setFormData({ ...formData, phone_no: e.target.value })}
                className="field-owner-register-input"
              />
            </div>
            <div className="field-owner-register-form-group">
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="field-owner-register-input"
              />
            </div>
            <button type="submit" className="field-owner-register-button">Đăng ký</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FieldOwnerRegister;
