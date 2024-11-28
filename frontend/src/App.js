import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.js';
import CustomerLogin from './components/CustomerLogin.js';
import CustomerRegister from './components/CustomerRegister.js';
import FieldOwnerRegister from './components/fieldOwnerRegister.js';
import FieldOwnerLogin from './components/FieldOwnerLogin.js';
import HomePage from './components/Homepage/index.js';
import { AuthCustomer } from './login/AuthCustomer.js';
import { AuthFieldOwner } from './login/AuthFieldOwner.js';

const App = () => {
    const customerAuth = AuthCustomer();
    const fieldOwnerAuth = AuthFieldOwner();

    const { isLoggedIn, fullname, handleLogout } = customerAuth.isLoggedIn ? customerAuth : fieldOwnerAuth;

    return (
        <Router>
            <div>
                <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} fullname={fullname}/>
                <Routes>
                    <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} fullname={fullname} />} />
                    <Route path="/customer/login" element={<CustomerLogin />} />
                    <Route path="/field_owner/login" element={<FieldOwnerLogin />} />
                    <Route path="/customer/register" element={<CustomerRegister />} />
                    <Route path="/field_owner/register" element={<FieldOwnerRegister />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
