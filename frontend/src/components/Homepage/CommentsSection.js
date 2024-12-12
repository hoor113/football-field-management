import React, { useState, useEffect } from 'react';
import './CommentsSection.css';

export const CommentsSection = ({ fieldId }) => {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/customer/rating/${fieldId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                const data = await response.json();

                if (response.ok) {
                    setComments(data.ratings);
                } else {
                    console.error('Failed to fetch comments:', data.message);
                }
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        if (fieldId) {
            fetchComments();
        }
    }, [fieldId]);

    const formatDate = (dateString) => {
        const options = { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options).replace(',', ' at');
    };

    return (
        <div className="comments-section">
            <h2>Comments</h2>
            {comments.length > 0 ? (
                comments.map((comment, index) => (
                    <div key={index} className="comment">
                        <div className="comment-header">
                            <span className="comment-user">{comment.customer_id.name}</span>
                            <span className="comment-date">{formatDate(comment.created_at)}</span>
                        </div>
                        <div className="comment-stars">
                            {'★'.repeat(comment.stars)}{'☆'.repeat(5 - comment.stars)}
                        </div>
                        <p className="comment-text">{comment.comment}</p>
                    </div>
                ))
            ) : (
                <p>No comments yet.</p>
            )}
        </div>
    );
}; 