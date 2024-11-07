import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => (
  <nav className="navbar">
    <h1 className="navbar-logo">Football Field Management</h1>

    <div className="navbar-links">
      <Link to="/">HomePage</Link>

      <div className="dropdown">
        <button className="dropdown-btn">Login</button>
        <div className="dropdown-content">
          <Link to="/customer/login">Customer</Link>
          <Link to="/fieldOwner/login">FieldOwner</Link>
        </div>
      </div>

      <div className="dropdown">
        <button className="dropdown-btn">Register</button>
        <div className="dropdown-content">
          <Link to="/customer/register">Customer</Link>
          <Link to="/fieldOwner/register">FieldOwner</Link>
        </div>
      </div>
    </div>
  </nav>
);

export default Navbar;
