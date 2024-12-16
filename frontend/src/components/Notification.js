import React from 'react';
import '../styles/Notification.css';

const Notification = ({ notifications, onAccept, onDecline }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <div className="notification-dropdown">
            {notifications.length === 0 ? (
                <p className="no-notifications">Chưa có thông báo nào</p>
            ) : (
                notifications.map(notification => (
                    <div key={notification._id} className="notification-item">
                        <div className="notification-header">
                            <span className="notification-time">{formatDate(notification.createdAt)}</span>
                            {!notification.isRead && <span className="unread-badge">Mới</span>}
                        </div>
                        <p className="notification-message">{notification.message}</p>
                        <div className="notification-actions">
                            <button 
                                className="accept-btn"
                                onClick={() => onAccept(notification.bookingId)}
                            >
                                Chấp nhận
                            </button>
                            <button 
                                className="decline-btn"
                                onClick={() => onDecline(notification.bookingId)}
                            >
                                Từ chối
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Notification;
