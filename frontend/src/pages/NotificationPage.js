import React, { useEffect, useState } from 'react';
import '../styles/NotificationPage.css';

const NotificationPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/field_owner/noti');
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

    const handleAccept = async (bookingId) => {
        try {
            const response = await fetch(`/api/field_owner/accept/${bookingId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data.success) {
                // Update isRead status using the correct endpoint
                await fetch(`/api/field_owner/notifications/${bookingId}/read`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                // Remove the notification from the list after accepting
                setNotifications(prevNotifications => 
                    prevNotifications.filter(notif => notif.bookingId._id !== bookingId)
                );
            }
        } catch (error) {
            console.error('Error accepting booking:', error);
        }
    };

    const handleDecline = async (bookingId) => {
        try {
            const response = await fetch(`/api/field_owner/cancel/${bookingId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data.success) {
                // Update isRead status using the correct endpoint
                await fetch(`/api/field_owner/notifications/${bookingId}/read`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                // Remove the notification from the list after declining
                setNotifications(prevNotifications => 
                    prevNotifications.filter(notif => notif.bookingId._id !== bookingId)
                );
            }
        } catch (error) {
            console.error('Error declining booking:', error);
        }
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const formatPrice = (price) => {
        return parseFloat(price).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    };

    if (loading) return <div className="loading">Loading notifications...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="notification-page">
            <h1>Pending Booking Requests</h1>
            <div className="notifications-container">
                {notifications.length === 0 ? (
                    <p className="no-notifications">No pending bookings</p>
                ) : (
                    notifications.map(notification => (
                        <div key={notification._id} className="notification-box">
                            {/* Customer Information */}
                            <div className="customer-info">
                                <h3>Customer Details</h3>
                                <p><strong>Name:</strong> {notification.bookingId.customer_id.fullname}</p>
                                <p><strong>Email:</strong> {notification.bookingId.customer_id.email}</p>
                                <p><strong>Phone:</strong> {notification.bookingId.customer_id.phone || 'N/A'}</p>
                            </div>

                            {/* Booking Details */}
                            <div className="booking-details">
                                <h3>Booking Details</h3>
                                <p><strong>Booking ID:</strong> {notification.bookingId._id}</p>
                                <p><strong>Start Time:</strong> {formatDateTime(notification.bookingId.start_time)}</p>
                                <p><strong>End Time:</strong> {formatDateTime(notification.bookingId.end_time)}</p>
                                <p><strong>Ground:</strong> Ground {notification.bookingId.ground_id}</p>
                                <p><strong>Total Price:</strong> {formatPrice(notification.bookingId.price)}</p>
                                
                                {/* Additional Services */}
                                {notification.bookingId.services?.length > 0 && (
                                    <div className="services">
                                        <h4>Additional Services:</h4>
                                        <ul>
                                            {notification.bookingId.services.map(service => (
                                                <li key={service._id}>
                                                    {service.name} - {formatPrice(service.price)} x {service.quantity}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="notification-actions">
                                <button 
                                    onClick={() => handleAccept(notification.bookingId._id)} 
                                    className="accept-btn"
                                >
                                    Accept Booking
                                </button>
                                <button 
                                    onClick={() => handleDecline(notification.bookingId._id)} 
                                    className="decline-btn"
                                >
                                    Decline Booking
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationPage;
