import axios from "axios";
import React, { useState } from "react";
import "../styles/FieldOwnerLogin.css"

const FieldOwnerLogin = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/field_owner/login`, formData);
            // Store token in localStorage
            localStorage.setItem('token', response.data.token);
            // Redirect to home page
            window.location.href = '/';
        } catch (error) {
            console.error("Login error:", error);
            const message = error.response ? error.response.data.message : "An error occurred. Please try again.";
            alert(message);
        }
    };

    return (
        <div className="field-owner-login-container">
            <div className="field-owner-login-box">
                <h2 className="field-owner-login-title">Field Owner Login</h2>
                <form onSubmit={handleSubmit} className="field-owner-login-form">
                    <div className="field-owner-login-form-group">
                        <input
                            type="text"
                            placeholder="Username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="field-owner-login-input"
                        />
                    </div>
                    <div className="field-owner-login-form-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="field-owner-login-input"
                        />
                    </div>
                    <button type="submit" className="field-owner-login-button">Login</button>
                </form>
            </div>
        </div>
    );
};
export default FieldOwnerLogin;