import React, { useState, useEffect } from 'react';

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

    return (
        <div className="comments-section">
            <h2>Comments</h2>
            {comments.length > 0 ? (
                comments.map((comment, index) => (
                    <div key={index} className="comment">
                        <div className="comment-stars">
                            {'★'.repeat(comment.stars)}{'☆'.repeat(5 - comment.stars)}
                        </div>
                        <p>{comment.comment}</p>
                    </div>
                ))
            ) : (
                <p>No comments yet.</p>
            )}
        </div>
    );
}; 