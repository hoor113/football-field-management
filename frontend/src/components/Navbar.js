import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/Navbar.css";

const Navbar = ({ isLoggedIn, handleLogout, fullname, userType }) => {
    const scrollToBottom = (e) => {
        e.preventDefault();
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
        });
    };

    const handleLogoutClick = () => {
        localStorage.removeItem('token');
        handleLogout();
        window.location.href = '/';
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-logo-link">
                <h1 className="navbar-logo">
                    <i className="fas fa-futbol"></i>
                    Football Field Management
                </h1>
            </Link>

            <div className="navbar-links">
                <Link to="/" className="nav-item">Trang chủ</Link>
                <Link to="/gioi-thieu" className="nav-item">Giới thiệu</Link>
                <Link to="/chinh-sach" className="nav-item">Chính sách</Link>
                <Link to="/dieu-khoan" className="nav-item">Điều khoản</Link>
                <a href="#" className="nav-item" onClick={scrollToBottom}>Liên hệ</a>
            </div>

            {!isLoggedIn ? (
                <div className="auth-buttons">
                    <div className="dropdown">
                        <button className="dropdown-btn signup-btn">
                            <i className="fas fa-user-plus"></i> Đăng Ký
                        </button>
                        <div className="dropdown-content">
                            <Link to="/customer/register">Khách Hàng</Link>
                            <Link to="/field_owner/register">Chủ Sân</Link>
                        </div>
                    </div>
                    <div className="dropdown">
                        <button className="dropdown-btn login-btn">
                            <i className="fas fa-sign-in-alt"></i> Đăng Nhập
                        </button>
                        <div className="dropdown-content">
                            <Link to="/customer/login">Khách Hàng</Link>
                            <Link to="/field_owner/login">Chủ Sân</Link>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="dropdown">
                    <button className="dropdown-btn user-btn">
                        <span className="user-name">{fullname}</span>
                        <span className="dropdown-arrow">▼</span>
                    </button>
                    <div className="dropdown-content user-dropdown">
                        <Link to={`/${userType === 'field_owner' ? 'field_owner' : 'customer'}/profile`}>Hồ Sơ</Link>
                        {userType === 'field_owner' ? (
                            <Link to="/field_owner/statistics">Thống Kê</Link>
                        ) : (
                            <Link to="/customer/statistics">Thống Kê</Link>
                        )}
                        <button onClick={handleLogoutClick} className="logout-btn">Đăng xuất</button>
                    </div>
                </div>
            )}

        </nav>
    );
}

export default Navbar;
