import React, { useState, useEffect } from 'react';
import './RatingDisplay.css';

const RatingDisplay = ({ fieldId }) => {
    const [rating, setRating] = useState(0);

    useEffect(() => {
        const fetchRating = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/customer/rating/${fieldId}/average`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                const data = await response.json();
                setRating(data.averageRating || 0);
            } catch (error) {
                console.error('Error fetching rating:', error);
            }
        };

        fetchRating();
    }, [fieldId]);

    return (
        <div className="field-rating-container">
            <div className="field-rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span 
                        key={star} 
                        className={`field-star ${star <= rating ? 'field-star-filled' : 'field-star-empty'}`}
                    >
                        ★
                    </span>
                ))}
            </div>
        </div>
    );
};

export default RatingDisplay;
