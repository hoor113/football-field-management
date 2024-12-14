import React from 'react';
import { FieldCard } from './FieldCard.js';
import './FieldList.css';

export const FieldList = ({ fields, currentPage, fieldsPerPage, onPageChange }) => {
    const indexOfLastField = currentPage * fieldsPerPage;
    const indexOfFirstField = indexOfLastField - fieldsPerPage;
    const currentFields = fields.slice(indexOfFirstField, indexOfLastField);
    const totalPages = Math.ceil(fields.length / fieldsPerPage);

    return (
        <div className="field-list-container">
            <div className="fields-grid">
                {currentFields.map(field => (
                    <FieldCard key={field._id} field={field} isLoggedIn={1} />
                ))}
            </div>      
            
            <div className="pagination-controls">
                <button 
                    onClick={() => onPageChange(currentPage - 1)} 
                    disabled={currentPage === 1}
                    className="pagination-button-prev"
                >
                    Previous
                </button>
                <span className="page-info">
                    Page {currentPage} of {totalPages}
                </span>
                <button 
                    onClick={() => onPageChange(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                    className="pagination-button-next"
                >
                    Next
                </button>
            </div>
        </div>
    );
}; 