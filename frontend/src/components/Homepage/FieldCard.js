import React from 'react';
import './FieldCard.css';

export const FieldCard = ({ field }) => {
    return (
        <div className="field-card">
            <h2>{field.name}</h2>
            <img src={field.image_url} alt={field.name} className="field-image" />
            <p><strong>Description:</strong> {field.description}</p>
            <p><strong>Address:</strong> {field.address}</p>
            <p><strong>Base Price:</strong> VND {field.base_price.toLocaleString()}</p>
            <p><strong>Total Grounds:</strong> {field.total_grounds}</p>
            
            <div className="operating-hours-display">
                <h3>Operating Hours:</h3>
                {field.operating_hours && field.operating_hours.length > 0 ? (
                    <div className="time-ranges">
                        {field.operating_hours
                            .sort((a, b) => a.start_hour - b.start_hour)
                            .map((hours, index) => (
                                <div key={index} className="time-range-item">
                                    <span className="time-badge">
                                        {String(hours.start_hour).padStart(2, '0')}:00 
                                        - 
                                        {String(hours.end_hour).padStart(2, '0')}:00
                                    </span>
                                </div>
                            ))}
                    </div>
                ) : (
                    <p className="no-hours">No operating hours set</p>
                )}
            </div>
        </div>
    );
}; 