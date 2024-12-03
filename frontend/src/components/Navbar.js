import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import notiBell from './icons/noti-bell.svg';

const Navbar = ({ isLoggedIn, handleLogout, fullname, userType }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const navigate = useNavigate();

    const handleLogoutClick = () => {
        localStorage.removeItem('token');
        handleLogout();
        window.location.href = '/';
    };
    useEffect(() => {
        if (userType === 'field_owner') {
            fetchNotifications();
        }
    }, [userType]);

    const fetchNotifications = async () => {
        try {
            const response = await fetch('/api/field_owner/noti', {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setNotifications(data.notifications || []);
                setUnreadCount(data.notifications?.filter(n => !n.isRead).length || 0);
            } else {
                console.error('Failed to fetch notifications:', data.message);
                setNotifications([]);
                setUnreadCount(0);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setNotifications([]);
            setUnreadCount(0);
        }
    };

    const handleSeeMore = () => {
        navigate('/notifications');
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
                {/* <a href="#" className="nav-item" onClick={scrollToBottom}>Liên hệ</a> */}
            </div>

            {userType === 'field_owner' && (
                <div className="notification-dropdown">
                    <div className="notification-icon">
                        <img src={notiBell} alt="notifications" className="bell-icon" />
                        {unreadCount > 0 && (
                            <span className="notification-badge">{unreadCount}</span>
                        )}
                    </div>
                    <div className="dropdown-content">
                        {notifications && notifications.length > 0 ? (
                            notifications.slice(0, 5).map(notification => (
                                <div key={notification.id} className="notification-item">
                                    <p>{notification.message}</p>
                                    <small>{new Date(notification.createdAt).toLocaleString()}</small>
                                </div>
                            ))
                        ) : (
                            <div className="notification-item">
                                <p>No notifications</p>
                            </div>
                        )}
                        <button onClick={handleSeeMore} className="see-more">See more...</button>
                    </div>
                </div>
            )}

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
                        <Link to="/statistics">Thống Kê</Link>
                        <button onClick={handleLogoutClick} className="logout-btn">Đăng xuất</button>
                    </div>
                </div>
            )}
            
            

        </nav>
    );
}

export default Navbar;
