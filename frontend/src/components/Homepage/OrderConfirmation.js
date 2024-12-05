import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa'; // Make sure to install react-icons if not already installed

const OrderConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { message } = location.state || { message: 'Your order has been placed successfully!' };

    return (
        <div className="confirmation-container">
            <div className="confirmation-content">
                <FaCheckCircle className="success-icon" />
                <h1>Order Confirmation</h1>
                <p className="confirmation-message">{message}</p>
                <p className="status-message">Your order is currently pending.</p>
                <button 
                    className="return-home-btn"
                    onClick={() => navigate('/')}
                >
                    Return to Homepage
                </button>
            </div>
        </div>
    );
};

export default OrderConfirmation;
