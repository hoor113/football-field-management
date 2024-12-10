import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import { OrderField } from './components/Homepage/OrderField';
import CustomerProfile from './components/CustomerProfile';
import FieldOwnerProfile from './components/FieldOwnerProfile';
import OrderConfirmation from './components/Homepage/OrderConfirmation';
import NotificationPageCustomer from './components/NotificationPageCustomer';
import NotificationPageFieldOwner from './components/NotificationPageFieldOwner';
import CustomerStatistics from './components/CustomerStatistics';
import FieldOwnerStatistics from './components/FieldOwnerStatistics';
import SearchResults from './components/Homepage/SearchResults.js';

// Create a wrapper component that handles the conditional rendering
const AppContent = () => {
    const location = useLocation();
    const customerAuth = AuthCustomer();
    const fieldOwnerAuth = AuthFieldOwner();

    const { isLoggedIn, fullname, handleLogout } = customerAuth.isLoggedIn ? customerAuth : fieldOwnerAuth;
    const userType = customerAuth.isLoggedIn ? 'customer' : fieldOwnerAuth.isLoggedIn ? 'field_owner' : null;

    // Array of paths where navbar and footer should be hidden
    const noNavbarFooterPaths = [
        '/customer/login',
        '/customer/register',
        '/field_owner/login',
        '/field_owner/register'
    ];

    // Check if current path should hide navbar and footer
    const shouldHideNavbarFooter = noNavbarFooterPaths.includes(location.pathname);

    return (
        <div className="app-container">
            {!shouldHideNavbarFooter && (
                <Navbar
                    isLoggedIn={isLoggedIn}
                    handleLogout={handleLogout}
                    fullname={fullname}
                    userType={userType}
                />
            )}
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
                    <Route path="/order/:fieldId" element={<OrderField />} />
                    <Route path="/customer/profile" element={<CustomerProfile />} />
                    <Route path="/field_owner/profile" element={<FieldOwnerProfile />} />
                    <Route path="/order-confirmation" element={<OrderConfirmation />} />
                    <Route path="/notifications" element={<NotificationPageFieldOwner />} />
                    <Route path="/customer/notifications" element={<NotificationPageCustomer />} />
                    <Route path="/customer/statistics" element={<CustomerStatistics />} />
                    <Route path="/field_owner/statistics" element={<FieldOwnerStatistics />} />
                    <Route path="/search-results" element={<SearchResults />} />
                </Routes>
            </main>
            {!shouldHideNavbarFooter && <Footer />}
        </div>
    );
};

// Main App component
const App = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    );
};

export default App;
