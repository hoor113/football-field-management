import React, { useState } from 'react';
import './RatingSection.css';
import { useLocation } from 'react-router-dom';

export const RatingSection = () => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const location = useLocation();
    const field = location.state?.field;

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/customer/rating', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Include cookies for authentication
                body: JSON.stringify({
                    rating,
                    comment,
                    field_id: field._id,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Rating submitted successfully:', data);
                // Optionally reset the form
                setRating(0);
                setComment('');
            } else {
                console.error('Failed to submit rating:', data.message);
            }
        } catch (error) {
            console.error('Error submitting rating:', error);
        }
    };

    return (
        <div className="rating-section">
            <h2>Rate this field</h2>
            
            <div className="stars-container">
                {[1, 2, 3, 4, 5].map((starValue, index) => (
                    <span
                        key={index}
                        className={`star ${starValue <= (hover || rating) ? 'active' : ''}`}
                        onClick={() => setRating(starValue)}
                        onMouseEnter={() => setHover(starValue)}
                        onMouseLeave={() => setHover(0)}
                    >
                        ★
                    </span>
                ))}
            </div>

            <div className="comment-section">
                <textarea
                    placeholder="Share your experience..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
            </div>

            <button 
                className="submit-rating-btn"
                onClick={handleSubmit}
                disabled={!rating}
            >
                Submit Rating
            </button>
        </div>
    );
}; 