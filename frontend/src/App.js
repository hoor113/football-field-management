import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.js';
import CustomerLogin from './components/CustomerLogin.js';
import CustomerRegister from './components/CustomerRegister.js';
import FieldOwnerRegister from './components/fieldOwnerRegister.js';

import FieldOwnerLogin from './components/fieldOwnerLogin.js';
import HomePage from './components/Homepage/index.js';
import { AuthCustomer } from './login/AuthCustomer.js';
import { AuthFieldOwner } from './login/AuthFieldOwner.js';
import GioiThieu from './components/GioiThieu';
import Footer from './components/Footer';
import ChinhSach from './components/ChinhSach';
import DieuKhoan from './components/DieuKhoan';

const App = () => {
    const customerAuth = AuthCustomer();
    const fieldOwnerAuth = AuthFieldOwner();

    const { isLoggedIn, fullname, handleLogout } = customerAuth.isLoggedIn ? customerAuth : fieldOwnerAuth;
    const userType = customerAuth.isLoggedIn ? 'customer' : fieldOwnerAuth.isLoggedIn ? 'field_owner' : null;

    return (
        <Router>
            <div className="app-container">
                <Navbar 
                    isLoggedIn={isLoggedIn} 
                    handleLogout={handleLogout} 
                    fullname={fullname}
                    userType={userType}
                />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} fullname={fullname} />} />
                        <Route path="/customer/login" element={<CustomerLogin />} />
                        <Route path="/field_owner/login" element={<FieldOwnerLogin />} />
                        <Route path="/customer/register" element={<CustomerRegister />} />
                        <Route path="/field_owner/register" element={<FieldOwnerRegister />} />
                        <Route path="/gioi-thieu" element={<GioiThieu />} />
                        <Route path="/chinh-sach" element={<ChinhSach />} />
                        <Route path="/dieu-khoan" element={<DieuKhoan />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
};

// LE KHOI NGUYEN ỨA HỂ
export default App;
