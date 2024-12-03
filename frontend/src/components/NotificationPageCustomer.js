import React, { useEffect, useState } from 'react';
import '../styles/NotificationPage.css';

const NotificationPageCustomer = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/customer/noti', {
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
                        <div key={notification.id} className="notification-box">
                            {/* Notification Details */}
                            <div className="notification-details">
                                <p><strong>Message:</strong> {notification.message}</p>
                                <p><strong>Date:</strong> {formatDateTime(notification.createdAt)}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationPageCustomer;