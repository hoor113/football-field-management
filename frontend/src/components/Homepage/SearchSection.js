import React, { useState, useEffect } from 'react';
import { FieldCard } from './FieldCard';
import './SearchSection.css';

export const SearchSection = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [recommendedFields, setRecommendedFields] = useState([]);
    const [searchResults, setSearchResults] = useState(null);

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

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        try {
            const response = await fetch(`http://localhost:5000/api/field/search?q=${encodeURIComponent(searchTerm)}`, {
                credentials: 'include'
            });
            const data = await response.json();
            
            if (data.success) {
                setSearchResults(data.fields);
            } else {
                console.error('Search failed:', data.message);
            }
        } catch (error) {
            console.error('Error performing search:', error);
        }
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

            {searchResults ? (
                <div className="search-results">
                    <h2>Search Results</h2>
                    <div className="fields-grid">
                        {searchResults.map(field => (
                            <FieldCard key={field._id} field={field} isLoggedIn={2} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="recommended-fields">
                    <h2 style={{ 
                        textAlign: 'center',
                        width: '100%',
                        margin: '0 auto'
                    }}>Các Sân Bóng Được Đề Xuất</h2>
                    <br></br>
                    <div className="fields-grid">
                        {recommendedFields.map(field => (
                            <FieldCard key={field._id} field={field} isLoggedIn={2} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}; 