import React, { useState, useEffect } from "react";

// export const HomePage = ({isLoggedIn, fullname}) => {
//     return (
//         <div>
//             <h1>Welcome {isLoggedIn ? fullname : 'Guest'}!</h1>
//         </div>
//     )
// }

export const HomePage = ({ isLoggedIn, fullname }) => {
    const [fieldOwner, getFieldOwner] = useState('');
    const [fields, setFields] = useState([]);
    const [selectedField, setSelectedField] = useState(null);
    const [showServiceForm, setShowServiceForm] = useState(false);
    const [serviceName, setServiceName] = useState('');
    const [serviceType, setServiceType] = useState('');
    const [price, setPrice] = useState('');

    // Fetch fields for the field owner
    useEffect(() => {
        fetch("http://localhost:5000/api/field/", {
            method: "GET",
            credentials: "include",
        })
            .then((response) => response.json())
            .then((data) => setFields(data.fields))
            .catch((error) => console.error('Error fetching fields:', error));
    }, []);

    // Handle adding a service
    const handleAddService = (fieldId) => {
        const serviceData = {
            fieldId,
            name: serviceName,
            type: serviceType,
            price,
        };

        fetch("http://localhost:5000/api/field/service", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(serviceData),
        })
            .then((response) => {
                if (response.ok) {
                    alert('Service added successfully!');
                    setShowServiceForm(false);
                    setServiceName('');
                    setServiceType('');
                    setPrice('');
                } else {
                    throw new Error('Failed to add service');
                }
            })
            .catch((error) => {
                console.error('Error adding service:', error);
            });
    };
    if (isLoggedIn === 0) {
        return (
            <div>
                <h1>Welcome to Field Manager!</h1>
            </div>
        )
    }
    else if (isLoggedIn === 1) {
        return (
            <div>
                <h1>Welcome Field Owner {fullname}!</h1>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                    {fields.map((field) => (
                        <div
                            key={field.id}
                            style={{
                                border: '1px solid #ccc',
                                padding: '1rem',
                                borderRadius: '8px',
                                width: '300px',
                            }}
                        >
                            <h2>{field.name}</h2>
                            <p>Type: {field.type}</p>
                            <p>Location: {field.location}</p>
                            <p>Capacity: {field.capacity}</p>
                            <button
                                onClick={() => {
                                    setSelectedField(field.id);
                                    setShowServiceForm(true);
                                }}
                            >
                                + Add Service
                            </button>
                        </div>
                    ))}
                </div>

                {/* Add Service Modal */}
                {showServiceForm && (
                    <div
                        style={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            backgroundColor: 'white',
                            padding: '2rem',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                            borderRadius: '8px',
                        }}
                    >
                        <h2>Add Service to Field {selectedField}</h2>
                        <input
                            type="text"
                            placeholder="Service Name"
                            value={serviceName}
                            onChange={(e) => setServiceName(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Service Type"
                            value={serviceType}
                            onChange={(e) => setServiceType(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                        <button onClick={() => handleAddService(selectedField)}>Add Service</button>
                        <button onClick={() => setShowServiceForm(false)}>Cancel</button>
                    </div>
                )}
            </div>
        )
    }
    else if (isLoggedIn === 2) {
        return (
            <div>
                <h1>Welcome Customer {fullname}!</h1>
            </div>
        )
    }
}


export default HomePage