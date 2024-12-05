import React, { useEffect, useState } from 'react';
import '../styles/CustomerStatistics.css';

const CustomerStatistics = () => {
    const [bookingsCount, setBookingsCount] = useState(0);

    useEffect(() => {
        // Fetch the number of fields booked by the customer
        // This is a placeholder for an actual API call
        const fetchBookingsCount = async () => {
            try {
                // Replace with your API endpoint
                const response = await fetch('http://localhost:5000/api/customer/bookings');
                const data = await response.json();
                setBookingsCount(data.bookings.length);
            } catch (error) {
                console.error('Error fetching booked fields:', error);
            }
        };

        fetchBookingsCount();
    }, []);

    return (
        <div className="customer-statistics">
            <h2>Lịch Sử Đặt Sân</h2>
            <p>Tổng số lần đặt sân từ lúc lập tài khoản: {bookingsCount}</p>
        </div>
    );
};

export default CustomerStatistics; 