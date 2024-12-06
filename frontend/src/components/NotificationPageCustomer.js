import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/NotificationPage.css';

const NotificationPageCustomer = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotifications();

        // Add event listener for when user leaves the page
        const handleBeforeUnload = () => {
            markAllNotificationsAsRead();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            markAllNotificationsAsRead();
        };
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/customer/noti', {
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Failed to fetch notifications');
            }
            const data = await response.json();
            setNotifications(data.notifications);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const markAllNotificationsAsRead = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/customer/noti/read_all', {
                method: 'PUT',
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Failed to mark notifications as read');
            }
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    };

    const handleNotificationClick = (notification) => {
        if (notification.booking_id) {
            navigate(`/booking/${notification.booking_id}`);
        }
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    if (loading) return <div className="loading">Loading notifications...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="notification-page">
            <h1>Your Notifications</h1>
            <div className="notifications-container">
                {notifications.length === 0 ? (
                    <p className="no-notifications">No notifications</p>
                ) : (
                    notifications.map(notification => (
                        <div 
                            key={notification.id} 
                            className={`notification-box ${!notification.isRead ? 'unread' : ''}`}
                            onClick={() => handleNotificationClick(notification)}
                        >
                            <div className="notification-details">
                                <div className="notification-header">
                                    <span className={`notification-status ${notification.type}`}>
                                        {notification.type === 'success' ? '✓' : 
                                         notification.type === 'failed' ? '✗' : '!'}
                                    </span>
                                    <span className="notification-time">
                                        {formatDateTime(notification.createdAt)}
                                    </span>
                                </div>
                                <p className="notification-message">{notification.message}</p>
                                {!notification.isRead && <span className="unread-indicator"></span>}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationPageCustomer;