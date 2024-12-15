import React, { useState } from 'react';
import { handleAddOperatingHours } from './functions/fieldOperations';
import './FieldForm.css';

export const FieldForm = ({ onSubmit, onCancel }) => {
  const [newField, setNewField] = useState({
    name: '',
    description: '',
    address: '',
    base_price: '',
    image_url: '',
    total_grounds: '',
    operating_hours: []
  });

  const [currentOperatingHours, setCurrentOperatingHours] = useState({
    start_hour: 7,
    end_hour: 23
  });

  const addOperatingHours = () => {
    const { start_hour, end_hour } = currentOperatingHours;

    if (start_hour >= end_hour) {
      alert("End time must be after start time");
      return;
    }

    const hasOverlap = newField.operating_hours.some(hours =>
      (start_hour < hours.end_hour && end_hour > hours.start_hour)
    );

    if (hasOverlap) {
      alert("Operating hours cannot overlap");
      return;
    }

    setNewField(prev => ({
      ...prev,
      operating_hours: [
        ...prev.operating_hours,
        { start_hour: Number(start_hour), end_hour: Number(end_hour) }
      ].sort((a, b) => a.start_hour - b.start_hour)
    }));

    setCurrentOperatingHours({ start_hour: 7, end_hour: 23 });
  };

  const handleSubmit = () => {
    if (!newField.name || !newField.address || !newField.base_price || !newField.total_grounds) {
      alert("Please fill in all required fields");
      return;
    }

    if (newField.operating_hours.length === 0) {
      alert("Please add at least one operating hours range");
      return;
    }

    const formattedField = {
      ...newField,
      base_price: Number(newField.base_price),
      total_grounds: Number(newField.total_grounds),
      operating_hours: newField.operating_hours.map(hours => ({
        start_hour: Number(hours.start_hour),
        end_hour: Number(hours.end_hour)
      }))
    };

    onSubmit(formattedField);
  };

  const handleImageUrlChange = (index, value) => {
    const newImageUrl = [...newField.image_url];
    newImageUrl[index] = value;
    setNewField({ ...newField, image_url: newImageUrl });
  };

  const handleAddImageUrl = () => {
    const lastUrl = newField.image_url[newField.image_url.length - 1];

    // Check if the URL is valid

    setNewField((prev) => ({
      ...prev,
      image_url: [...prev.image_url, ''], // Add new blank input field for URL
    }));
  };

  return (
    <div className="modal field-form-modal">
      <h2 className="field-title">Add New Field</h2>

      {/* Basic Field Information */}
      <input
        type="text"
        placeholder="Field Name"
        value={newField.name}
        onChange={(e) => setNewField({ ...newField, name: e.target.value })}
        className="modal-input"
      />
      <input
        type="text"
        placeholder="Description (optional)"
        value={newField.description}
        onChange={(e) => setNewField({ ...newField, description: e.target.value })}
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
        min="0"
        placeholder="Base Price"
        value={newField.base_price}
        onChange={(e) => {
          const value = Number(e.target.value);
          if (value >= 0) {
            setNewField({ ...newField, base_price: value });
          }
        }}
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
        min="0"
        placeholder="Total Grounds"
        value={newField.total_grounds}
        onChange={(e) => {
          const value = Number(e.target.value);
          if (value >= 0) {
            setNewField({ ...newField, total_grounds: value });
          }
        }}
        className="modal-input"
      />

      {/* Operating Hours Section */}
      <div className="operating-hours-section">
        <h3>Operating Hours (Required)</h3>

        {/* Display existing operating hours */}
        {newField.operating_hours.length > 0 && (
          <div className="operating-hours-list">
            {newField.operating_hours.map((hours, index) => (
              <div key={index} className="operating-hours-item">
                <span>
                  {String(hours.start_hour).padStart(2, '0')}:00 -
                  {String(hours.end_hour).padStart(2, '0')}:00
                </span>
                <button
                  onClick={() => {
                    setNewField(prev => ({
                      ...prev,
                      operating_hours: prev.operating_hours.filter((_, i) => i !== index)
                    }));
                  }}
                  className="remove-hours-button"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add new operating hours */}
        <div className="operating-hours-input">
          <label>Add Operating Hours Range (2-hour intervals)</label>
          <div className="hours-inputs">
            <input
              type="number"
              min="0"
              max="23"
              placeholder="Start Hour (0-23)"
              value={currentOperatingHours.start_hour}
              onChange={(e) => setCurrentOperatingHours(prev => ({
                ...prev,
                start_hour: parseInt(e.target.value)
              }))}
              className="modal-input"
            />
            <input
              type="number"
              min="1"
              max="24"
              placeholder="End Hour (1-24)"
              value={currentOperatingHours.end_hour}
              onChange={(e) => setCurrentOperatingHours(prev => ({
                ...prev,
                end_hour: parseInt(e.target.value)
              }))}
              className="modal-input"
            />
            <button
              onClick={addOperatingHours}
              className="add-hours-button"
              type="button"
            >
              Add Hours
            </button>
          </div>
          <small className="help-text">
            Hours must be in 2-hour intervals and cannot overlap
            <br />
            Example: 7:00-13:00, 15:00-21:00 is valid
          </small>
        </div>
      </div>

      {/* Form Buttons */}
      <div className="modal-buttons">
        <button
          onClick={handleSubmit}
          className="submit-button"
        >
          Add Field
        </button>
        <button onClick={onCancel} className="cancel-button">
          Cancel
        </button>
      </div>
    </div>
  );
}; 
