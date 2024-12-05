import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Confirmation</h2>
                <p>Are you sure you want to delete this field?</p>
                <div className="modal-buttons">
                    <button className="modal-button-ok" onClick={onConfirm}>OK</button>
                    <button className="modal-button-cancel" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;