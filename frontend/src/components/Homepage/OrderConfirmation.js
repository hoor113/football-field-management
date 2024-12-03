import { useLocation } from 'react-router-dom';

const OrderConfirmation = () => {
    const location = useLocation();
    const { message } = location.state || { message: 'Your order has been placed successfully!' };

    return (
        <div className="confirmation-container">
            <h1>Order Confirmation</h1>
            <p>{message}</p>
            <p>Your order is currently pending.</p>
        </div>
    );
};

export default OrderConfirmation;
