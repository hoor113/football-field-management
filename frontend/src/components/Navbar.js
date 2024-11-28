import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/Navbar.css";

const Navbar = ({ isLoggedIn, handleLogout, fullname }) => {
    return (
        <nav className="navbar">
            <Link to="/" className="navbar-logo-link">
                <h1 className="navbar-logo">Football Field Management</h1>
            </Link>

            <div className="navbar-links">
                <Link to="/">Trang chủ</Link>
                {/* <Link to="/danh-sach-san">Danh sách sân bãi</Link> */}
                <Link to="/gioi-thieu">Giới thiệu</Link>
                <Link to="/chinh-sach">Chính sách</Link>
                <Link to="/dieu-khoan">Điều khoản</Link>
                <Link to="/lien-he">Liên hệ</Link>

                {!isLoggedIn ? (
                    <div className="auth-buttons">
                        <div className="dropdown">
                            <button className="dropdown-btn">Đăng Ký</button>
                            <div className="dropdown-content">
                                <Link to="/customer/register">Khách Hàng</Link>
                                <Link to="/field_owner/register">Chủ Sân</Link>
                            </div>
                        </div>
                        <div className="dropdown">
                            <button className="dropdown-btn">Đăng Nhập</button>
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
                            <Link to="/profile">Hồ Sơ</Link>
                            <Link to="/statistics">Thống Kê</Link>
                            <button onClick={handleLogout} className="logout-btn">Đăng xuất</button>
                        </div>
                    </div>
                )}

            </div>
        </nav>
    );
}

export default Navbar;
