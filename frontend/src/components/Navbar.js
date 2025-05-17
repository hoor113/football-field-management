import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '#styles/Navbar.css';
import notiBell from '#styles/icons/noti-bell.svg';
import logoIcon from '#styles/images/field_logo.jpg';

const Navbar = ({ isLoggedIn, handleLogout, fullname, userType }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showAlert, setShowAlert] = useState(false);
    const navigate = useNavigate();

    const handleLogoutClick = () => {
        localStorage.removeItem('token');
        handleLogout();
        window.location.href = '/';
    };

    useEffect(() => {
        if (userType === 'field_owner' || userType === 'customer') {
            fetchNotifications();
        }
    }, [userType]);

    const fetchNotifications = async () => {
        try {
            const response = await fetch(`/api/${userType}/noti`, {
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
        if (userType === 'field_owner') {
            navigate('/notifications');
        } else if (userType === 'customer') {
            navigate('/customer/notifications');
        }
    };

    const handleServiceClick = (e) => {
        e.preventDefault();
        if (!isLoggedIn) {
            setShowAlert(true);
        }
    };

    return (
        <>
            <nav className="navbar">
                <Link to="/" className="navbar-logo-link">
                    <img src={logoIcon} alt="logo" className="logo-icon" />
                    <div className="navbar-logo">
                        <span className="logo-top-text">FOOTBALL FIELD</span>
                        <span className="logo-bottom-text">MANAGEMENT</span>
                    </div>
                </Link>

                <div className="navbar-links">
                    <Link to="/" className="nav-item">Trang chủ</Link>
                    {isLoggedIn ? (
                        <div className="dropdown">
                            <button className="nav-item service-btn">Giải đấu</button>
                            <div className="dropdown-content service-dropdown">
                                {userType === 'customer' ? (
                                    <>
                                        <Link to="/customer/tournaments">Tham Gia Giải Đấu</Link>
                                    </>
                                ) : userType === 'field_owner' ? (
                                    <>
                                        <Link to="/field_owner/manage-tournaments">Quản Lý Giải Đấu</Link>
                                    </>
                                ) : null}
                            </div>
                        </div>
                    ) : (
                        <a href="#" className="nav-item" onClick={handleServiceClick}>Giải đấu</a>
                    )}
                    <Link to="/gioi-thieu" className="nav-item">Giới thiệu</Link>
                    <Link to="/chinh-sach" className="nav-item">Chính sách</Link>
                    <Link to="/dieu-khoan" className="nav-item">Điều khoản</Link>
                </div>

                {(userType === 'field_owner' || userType === 'customer') && (
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
                                <p>Không có thông báo</p>
                            </div>
                        )}
                        <button onClick={handleSeeMore} className="see-more">Xem thêm...</button>
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
                            {userType === 'field_owner' ? (
                                <Link to="/field_owner/statistics">Thống Kê Cho Thuê Sân</Link>
                            ) : (
                                <Link to="/customer/statistics">Lịch Sử Đặt Sân</Link>
                            )}
                            <button onClick={handleLogoutClick} className="logout-btn">Đăng xuất</button>
                        </div>
                    </div>
                )}
            </nav>

            {showAlert && (
                <div className="alert-overlay">
                    <div className="alert-box">
                        <p>Bạn chưa đăng nhập, hãy đăng nhập để sử dụng dịch vụ</p>
                        <button onClick={() => setShowAlert(false)} className="alert-button">OK</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default Navbar;
