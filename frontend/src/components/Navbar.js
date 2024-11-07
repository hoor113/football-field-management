import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => (
  <nav className="navbar">
    <h1 className="navbar-logo">Football Field Management</h1>
    <div className="navbar-links">
      <Link to="/">Home</Link>
      <Link to="/login">CustomerLogin</Link>
      <Link to="/register">CustomerRegister</Link>
    </div>
  </nav>
);

export default Navbar;
