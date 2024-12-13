import React, { useState } from 'react';
import './EditFieldForm.css';

const EditFieldForm = ({ field, onClose, onSubmit }) => {
    const [editData, setEditData] = useState({
        name: field.name,
        description: field.description,
        address: field.address,
        base_price: field.base_price,
        total_grounds: field.total_grounds,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        onSubmit(editData);
    };

    return (
        <div>
            <h2>Edit Field</h2>
            <form className="edit-field-form" onSubmit={handleFormSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Field Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={editData.name}
                        onChange={handleInputChange}
                        placeholder="Enter new field name"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={editData.description}
                        onChange={handleInputChange}
                        placeholder="Enter field description"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={editData.address}
                        onChange={handleInputChange}
                        placeholder="Enter field address"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="base_price">Base Price</label>
                    <input
                        type="number"
                        id="base_price"
                        name="base_price"
                        value={editData.base_price}
                        onChange={handleInputChange}
                        placeholder="Enter base price"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="total_grounds">Total Grounds</label>
                    <input
                        type="number"
                        id="total_grounds"
                        name="total_grounds"
                        value={editData.total_grounds}
                        onChange={handleInputChange}
                        placeholder="Enter total number of grounds"
                    />
                </div>
                <div className="button-group">
                    <button type="submit" className="save-button">Save</button><br />
                    <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default EditFieldForm;