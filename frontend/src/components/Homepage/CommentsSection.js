import React, { useState, useEffect } from 'react';
import './CommentsSection.css';

export const CommentsSection = ({ fieldId }) => {
    const [comments, setComments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const commentsPerPage = 5;

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

    const indexOfLastComment = currentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="comments-section">
            <h2>Comments</h2>
            {currentComments.length > 0 ? (
                currentComments.map((comment, index) => (
                    <div key={index} className="comment">
                        <div className="comment-header">
                            <span className="comment-user">{comment.customer_id.fullname}</span>
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
            <div className="pagination">
                {Array.from({ length: Math.ceil(comments.length / commentsPerPage) }, (_, i) => (
                    <button key={i} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? 'active' : ''}>
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}; 