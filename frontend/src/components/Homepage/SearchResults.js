import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SearchResult.css';
const SearchResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { fields } = location.state || { fields: [] };

    const handleBookingClick = () => {
        navigate('/customer/login');
    };

    return (
        <div className="search-results-page">
            <h2>Search Results</h2>
            {fields.length > 0 ? (
                fields.map(field => (
                    <div key={field.id} className="field-card">
                        <img src={field.image_url} alt={field.name} className="field-image" />
                        <h3>{field.name}</h3>
                        <p>Description: {field.description}</p>
                        <p>Address: {field.address}</p>
                        <p>Price: {field.base_price}</p>
                        <button className="booking-button" onClick={handleBookingClick}>
                            Đặt sân ngay
                        </button>
                    </div>
                ))
            ) : (
                <p>No fields found</p>
            )}
        </div>
    );
};

export default SearchResults; 