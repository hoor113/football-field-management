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
            <h2>Thống Kê Khách Hàng</h2>
            <p>Số sân đã đặt: {bookingsCount}</p>
        </div>
    );
};

export default CustomerStatistics; 