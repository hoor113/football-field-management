import React, { useState, useEffect } from 'react';
import { FieldCard } from './FieldCard';
import './SearchSection.css';

export const SearchSection = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [recommendedFields, setRecommendedFields] = useState([]);

    useEffect(() => {
        // Fetch initial recommended fields
        fetchRecommendedFields();
    }, []);

    const fetchRecommendedFields = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/field/fields?limit=3', {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setRecommendedFields(data.fields);
            }
        } catch (error) {
            console.error('Error fetching recommended fields:', error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        // Implement search functionality
        console.log('Searching for:', searchTerm);
    };

    return (
        <div className="search-section">
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    placeholder="Search for fields..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <button type="submit" className="search-button">
                    Search
                </button>
            </form>

            <div className="recommended-fields">
                <h2>Recommended Fields</h2>
                <div className="fields-grid">
                    {recommendedFields.map(field => (
                        <FieldCard key={field._id} field={field} />
                    ))}
                </div>
            </div>
        </div>
    );
}; 