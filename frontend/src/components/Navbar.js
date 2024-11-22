import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/Navbar.css";

const Navbar = ({ isLoggedIn, handleLogout, fullname }) => {
    return (!isLoggedIn ? (
        <nav className="navbar">
            <Link to="/" className="navbar-logo-link">
                <h1 className="navbar-logo">Football Field Management</h1>
            </Link>

            <div className="navbar-links">
                <div className="dropdown">
                    <button className="dropdown-btn">Login</button>
                    <div className="dropdown-content">
                        <Link to="/customer/login">Customer</Link>
                        <Link to="/field_owner/login">FieldOwner</Link>
                    </div>
                </div>

                <div className="dropdown">
                    <button className="dropdown-btn">Register</button>
                    <div className="dropdown-content">
                        <Link to="/customer/register">Customer</Link>
                        <Link to="/field_owner/register">FieldOwner</Link>
                    </div>
                </div>
            </div>
        </nav>
    ) : (
        <nav className="navbar">
            <Link to="/" className="navbar-logo-link">
                <h1 className="navbar-logo">Football Field Management</h1>
            </Link>

            <div className="navbar-links">
                <div className="dropdown">
                    <button className="dropdown-btn user-btn">
                        <span className="user-name">{fullname}</span>
                        <span className="dropdown-arrow">▼</span>
                    </button>
                    <div className="dropdown-content user-dropdown">
                        <Link to="/profile">Profile</Link>
                        <Link to="/statistics">Statistics</Link>
                        <button onClick={handleLogout} className="logout-btn">Logout</button>
                    </div>
                </div>
            </div>
        </nav>
    ))
}

export default Navbar;
