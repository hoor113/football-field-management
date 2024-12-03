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
                <p className="no-notifications">No notifications</p>
            ) : (
                notifications.map(notification => (
                    <div key={notification._id} className="notification-item">
                        <div className="notification-header">
                            <span className="notification-time">{formatDate(notification.createdAt)}</span>
                            {!notification.isRead && <span className="unread-badge">New</span>}
                        </div>
                        <p className="notification-message">{notification.message}</p>
                        <div className="notification-actions">
                            <button 
                                className="accept-btn"
                                onClick={() => onAccept(notification.bookingId)}
                            >
                                Accept
                            </button>
                            <button 
                                className="decline-btn"
                                onClick={() => onDecline(notification.bookingId)}
                            >
                                Decline
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Notification;
