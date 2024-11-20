import React, { useState, useEffect } from "react";
import './Homepage.css';

export const HomePage = ({ isLoggedIn, fullname }) => {
  const [fieldOwner, getFieldOwner] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [fields, setFields] = useState([]);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [serviceName, setServiceName] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [price, setPrice] = useState('');
  const [showFieldForm, setShowFieldForm] = useState(false);
  const [newField, setNewField] = useState({
    name: '',
    address: '',
    base_price: '',
    image_url: '',
    total_grounds: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const fieldsPerPage = 3; // Number of fields to show per page

  // Fetch fields for the field owner
  useEffect(() => {
    if (isLoggedIn === 1) {
      // Fetch field owner data
      fetch("http://localhost:5000/api/field_owner", {
        method: "GET",
        credentials: "include",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      })
        .then((response) => response.json())
        .then((data) => {
          getFieldOwner(data.id)
          console.log("Field Owner: ", data)
        })
        .catch((error) => console.error('Error fetching field owner:', error));

      // Fetch fields
      fetch("http://localhost:5000/api/field_owner/fields", {
        method: "GET",
        credentials: "include",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      })
        .then(async (response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          // Process the fields data to convert Decimal128 to numbers
          const processedFields = data.fields?.map(field => ({
            ...field,
            base_price: field.base_price?.$numberDecimal 
              ? Number(field.base_price.$numberDecimal)
              : Number(field.base_price),
            services: field.services?.map(service => ({
              ...service,
              price: service.price?.$numberDecimal
                ? Number(service.price.$numberDecimal)
                : Number(service.price)
            }))
          })) || [];

          setFields(processedFields);
        })
        .catch((error) => {
          console.error('Error fetching fields:', error);
          setFields([]);
        });
    }
  }, [isLoggedIn]);

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

  // Add this function to handle field creation
  const handleAddField = () => {
    fetch("http://localhost:5000/api/field_owner", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(newField),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.ok) {
          alert('Field added successfully!');
          setShowFieldForm(false);
          setNewField({
            name: '',
            address: '',
            base_price: '',
            image_url: '',
            total_grounds: ''
          });

          // Fetch updated fields
          const fieldsResponse = await fetch("http://localhost:5000/api/field", {
            method: "GET",
            credentials: "include",
          });
          const fieldsData = await fieldsResponse.json();
          if (fieldsData.fields) {
            setFields(fieldsData.fields);
          }
        } else {
          throw new Error(data.message || 'Failed to add field');
        }
      })
      .catch((error) => {
        console.error('Error adding field:', error);
        alert(error.message);
      });
  };

  const indexOfLastField = currentPage * fieldsPerPage;
  const indexOfFirstField = indexOfLastField - fieldsPerPage;
  const currentFields = fields.slice(indexOfFirstField, indexOfLastField);
  const totalPages = Math.ceil(fields.length / fieldsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
    }
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
        <div className="fields-container">
          {Array.isArray(fields) && fields.length > 0 ? (
            <>
              <div className="fields-grid">
                {currentFields.map((field) => (
                  <div key={field._id} className="field-card">
                    <h2 className="field-title">{field.name}</h2>
                    <img
                      src={field.image_url}
                      alt={field.name}
                      className="field-image"
                    />
                    <p><strong>Address:</strong> {field.address}</p>
                    <p><strong>Base Price:</strong> VND {field.base_price}</p>
                    <p><strong>Total Grounds:</strong> {field.total_grounds}</p>

                    {field.services && field.services.length > 0 && (
                      <div className="services-section">
                        <h3 className="services-title">Services:</h3>
                        <ul className="services-list">
                          {field.services.map((service, index) => (
                            <li key={index} className="service-item">
                              <div><strong>{service.name}</strong></div>
                              <div>Type: {service.type}</div>
                              <div>Price: ${service.price}</div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="button-container">
                      <button
                        onClick={() => {
                          setSelectedField(field._id);
                          setShowServiceForm(true);
                        }}
                        className="add-service-button"
                      >
                        + Add Service
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pagination-controls">
                <button 
                  onClick={prevPage} 
                  disabled={currentPage === 1}
                  className="pagination-button"
                >
                  Previous
                </button>
                <span className="page-info">
                  Page {currentPage} of {totalPages}
                </span>
                <button 
                  onClick={nextPage} 
                  disabled={currentPage === totalPages}
                  className="pagination-button"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <p>No fields available. Click the + button to add a new field.</p>
          )}
        </div>

        <button
          className="floating-add-button"
          onClick={() => setShowFieldForm(true)}
        >
          +
        </button>

        {showServiceForm && (
          <div className="modal">
            <h2>Add Service to Field {selectedField}</h2>
            <input
              type="text"
              placeholder="Service Name"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="modal-input"
            />
            <input
              type="text"
              placeholder="Service Type"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="modal-input"
            />
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="modal-input"
            />
            <button onClick={() => handleAddService(selectedField)}>Add Service</button>
            <button onClick={() => setShowServiceForm(false)}>Cancel</button>
          </div>
        )}

        {showFieldForm && (
          <div className="modal field-form-modal">
            <h2 className="field-title">Add New Field</h2>
            <input
              type="text"
              placeholder="Field Name"
              value={newField.name}
              onChange={(e) => setNewField({ ...newField, name: e.target.value })}
              className="modal-input"
            />
            <input
              type="text"
              placeholder="Address"
              value={newField.address}
              onChange={(e) => setNewField({ ...newField, address: e.target.value })}
              className="modal-input"
            />
            <input
              type="number"
              placeholder="Base Price"
              value={newField.base_price}
              onChange={(e) => setNewField({ ...newField, base_price: e.target.value })}
              className="modal-input"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={newField.image_url}
              onChange={(e) => setNewField({ ...newField, image_url: e.target.value })}
              className="modal-input"
            />
            <input
              type="number"
              placeholder="Total Grounds"
              value={newField.total_grounds}
              onChange={(e) => setNewField({ ...newField, total_grounds: e.target.value })}
              className="modal-input"
            />
            <div className="modal-buttons">
              <button
                onClick={() => setShowFieldForm(false)}
                className="cancel-button"
              >
                Cancel
              </button>
              <button
                onClick={handleAddField}
                className="submit-button"
              >
                Add Field
              </button>
            </div>
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