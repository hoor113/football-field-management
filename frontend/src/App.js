import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.js';
import CustomerLogin from './components/CustomerLogin.js';
import CustomerRegister from './components/CustomerRegister.js';
import FieldOwnerRegister from './components/fieldOwnerRegister.js';
import FieldOwnerLogin from './components/fieldOwnerLogin.js';

const App = () => (
  <Router>
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<h1>Welcome to Football Field Management</h1>} />
        <Route path="/customer/login" element={<CustomerLogin />} />  
        <Route path="/field_owner/login" element={<FieldOwnerLogin />} />  
        <Route path="/customer/register" element={<CustomerRegister />} /> 
        <Route path="/field_owner/register" element={<FieldOwnerRegister />} />
      </Routes>
    </div>
  </Router>
);

export default App;
