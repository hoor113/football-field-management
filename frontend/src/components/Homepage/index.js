import React, { useState } from 'react';
import { FieldList } from './FieldList';
import { FieldForm } from './FieldForm';
import { ServiceForm } from './ServiceForm';
import { useField } from './hooks/useField';
import { handleAddField } from './functions/fieldOperations';
import './Homepage.css';

export const HomePage = ({ isLoggedIn, fullname }) => {
    const { fields, setFields } = useField(isLoggedIn);
    const [showFieldForm, setShowFieldForm] = useState(false);
    const [showServiceForm, setShowServiceForm] = useState(false);
    const [selectedField, setSelectedField] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const fieldsPerPage = 3;

    const handleServiceSubmit = async (serviceData) => {
        try {
            const response = await fetch("http://localhost:5000/api/field/service", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(serviceData),
            });

            if (response.ok) {
                alert('Service added successfully!');
                setShowServiceForm(false);
                // Refresh fields to show new service
                const fieldsResponse = await fetch("http://localhost:5000/api/field_owner/fields", {
                    credentials: "include",
                });
                const fieldsData = await fieldsResponse.json();
                if (fieldsData.fields) {
                    setFields(fieldsData.fields);
                }
            } else {
                throw new Error('Failed to add service');
            }
        } catch (error) {
            console.error('Error adding service:', error);
            alert(error.message);
        }
    };

    if (isLoggedIn === 1) {
        return (
            <div className="container">
                <h1 className="welcome-header">Welcome Field Owner {fullname}!</h1>
                
                <FieldList
                    fields={fields}
                    currentPage={currentPage}
                    fieldsPerPage={fieldsPerPage}
                    onPageChange={setCurrentPage}
                />

                <button
                    className="floating-add-button"
                    onClick={() => setShowFieldForm(true)}
                >
                    +
                </button>

                {showFieldForm && (
                    <FieldForm
                        onSubmit={(fieldData) => handleAddField(fieldData, setShowFieldForm, setFields)}
                        onCancel={() => setShowFieldForm(false)}
                    />
                )}

                {showServiceForm && (
                    <ServiceForm
                        fieldId={selectedField}
                        onSubmit={handleServiceSubmit}
                        onCancel={() => setShowServiceForm(false)}
                    />
                )}
            </div>
        );
    }

    return (
        <div className="container">
            <h1 className="welcome-header">
                {isLoggedIn === 2 ? `Welcome Customer ${fullname}!` : 'Welcome to Field Manager!'}
            </h1>
        </div>
    );
};

export default HomePage; 