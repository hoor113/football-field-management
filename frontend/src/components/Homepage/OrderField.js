import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderField.css';
import { RatingSection } from './RatingSection';
import { CommentsSection } from './CommentsSection';

export const OrderField = () => {
  const location = useLocation();
  const field = location.state?.field;
  // const [ownerName, setOwnerName] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedGround, setSelectedGround] = useState('');
  const [selectedHours, setSelectedHours] = useState({ start: '', end: '' });
  const [serviceQuantities, setServiceQuantities] = useState({});
  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchOwnerName = async () => {
  //     try {
  //       const response = await fetch(`http://localhost:5000/api/field_owner/${field.owner_id}`, {
  //         credentials: 'include'
  //       });
        
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }
        
  //       const data = await response.json();
  //       if (data.success && data.owner?.fullname) {
  //         setOwnerName(data.owner.fullname);
  //       } else {
  //         console.warn('Owner name not found in response:', data);
  //         setOwnerName('Not available');
  //       }
  //     } catch (error) {
  //       console.error('Error fetching owner name:', error);
  //       setOwnerName('Not available');
  //     }
  //   };

  //   if (field?.owner_id) {
  //     fetchOwnerName();
  //   }
  // }, [field?.owner_id]);

  // Reset hours when ground changes
  useEffect(() => {
    setSelectedHours({ start: '', end: '' });
  }, [selectedGround]);

  const handleQuantityChange = (serviceId, change) => {
    setServiceQuantities(prev => ({
      ...prev,
      [serviceId]: Math.max(0, (prev[serviceId] || 0) + change)
    }));
  };

  const handleSendNotification = async (bookingId) => {
    try {
      const notificationData = {
        recipient_id: field.owner_id,
        message: `New booking request for ${field.name}`,
        booking_id: bookingId,
        type: 'request'
      };

      const response = await fetch('http://localhost:5000/api/customer/send_notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(notificationData)
      });

      if (!response.ok) {
        throw new Error('Failed to send notification');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const handlePlaceOrder = async () => {
    // Check if all required fields are filled
    if (!selectedDate || !selectedGround || !selectedHours.start || !selectedHours.end) {
      alert('Please fill in all required fields.');
      return;
    }

    // Debugging logs to check the values of selectedHours
    console.log('Selected Start Hour:', selectedHours.start);
    console.log('Selected End Hour:', selectedHours.end);

    // Total price for the field (base price only)
    const totalGroundPrice = (field.base_price || 0);

    // Total price for services
    const totalServicePrice = Object.entries(serviceQuantities).reduce((total, [serviceId, quantity]) => {
      const service = field.services.find(s => s._id === serviceId);
      return total + (service?.price * quantity || 0);
    }, 0);

    // Total price calculation
    const totalPrice = totalGroundPrice + totalServicePrice;
    // Prepare booking data
    const bookingData = {
      field_id: field._id,
      ground_id: selectedGround,
      start_time: new Date(`${selectedDate}T${selectedHours.start}:00`), // Combine date and time
      end_time: new Date(`${selectedDate}T${selectedHours.end}:00`), // Combine date and time
      services: Object.entries(serviceQuantities).map(([serviceId, quantity]) => {
        const service = field.services.find(s => s._id === serviceId);
        return {
          service_id: serviceId,
          name: service?.name,
          price: service?.price,
          quantity: quantity
        };
      }).filter(service => service.quantity > 0), // Filter out services with quantity 0
      booking_date: selectedDate, // Include the selected date
      price: totalPrice // Add total price to booking data
    };
    // Add total price to booking data
    bookingData.price = totalPrice; // Add total price to booking data

    // Proceed to place the order
    try {
      console.log('Selected Start Hour:', selectedHours.start);
      console.log('Selected End Hour:', selectedHours.end);
      const response = await fetch("http://localhost:5000/api/customer/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(bookingData)
      });

      const data = await response.json();

      if (response.ok) {
        // Send notification after successful booking
        await handleSendNotification(data.bookingId);
        navigate(`/order-confirmation`, { state: { message: data.message } });
      } else {
        alert(data.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order');
    }
  };

  if (!field) return <div>Loading...</div>;

  return (
    <div className="order-page-container">
        {/* Top section with field info and image */}
        <div className="field-description-plate">
            <div className="field-description-content">
                <h1 className="field-name">{field.name}</h1>
                <div className="field-info">
                    <p className="field-address">
                        <span className="label">Address:</span>
                        {field.address}
                    </p>
                    <p className="field-owner">
                        <span className="label">Owner:</span>
                        {/* {ownerName} */} WIP
                    </p>
                    {/* <p className="field-description">
                            <span className="label">Description:</span>
                            {field.description}
                        </p> */}
                    <p className="field-hours">
                        <span className="label">Operating Hours:</span>
                        {field.operating_hours.map((hours, index) => (
                            <span key={index}>
                                {hours.start_hour}:00 - {hours.end_hour}:00
                                {index < field.operating_hours.length - 1 ? ', ' : ''}
                            </span>
                        ))}
                    </p>
                    <p className="field-grounds">
                        <span className="label">Available Grounds:</span>
                        {field.total_grounds}
                    </p>
                </div>
                <div className="base-price-box">
                    <span className="price-label">BASE PRICE</span>
                    <span className="price-amount">{field.base_price} VNĐ</span>
                </div>
            </div>
            <div className="field-image-container">
                {field.image_url ? (
                    <img src={field.image_url} alt={field.name} />
                ) : (
                    <div className="placeholder-image"></div>
                )}
            </div>
        </div>

        {/* Bottom section with future-purpose plate and order form */}
        <div className="bottom-section-container">
            {/* Left plate for future purposes */}
            <div className="future-purpose-plate">
                <RatingSection />
                <CommentsSection fieldId={field._id} />
            </div>

            {/* Right side - Order form */}
            <div className="order-form-section">
                <div className="booking-time-section">
                    <h2>Choose Booking Details</h2>

                    {/* Ground Selection */}
                    <div className="ground-selection">
                        <label>Select Ground:</label>
                        <select
                            value={selectedGround}
                            onChange={(e) => setSelectedGround(e.target.value)}
                            className="ground-select"
                        >
                            <option value="">Choose a ground...</option>
                            {field.grounds.map(ground => (
                                <option key={ground._id} value={ground._id}>
                                    {ground.name} - Sân {ground.size} người
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date and Time Selection - Always visible but conditionally disabled */}
                    <div className="date-selection">
                        <label>Select Date:</label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            disabled={!selectedGround}
                            className={!selectedGround ? 'disabled' : ''}
                        />
                    </div>

                    <div className="hours-selection">
                        <label>Select Time Range:</label>
                        <div className="time-slots-container">
                            {!selectedGround || !selectedDate ? (
                                <div className="empty-time-slots">Chưa chọn sân và ngày</div>
                            ) : (
                                <div className="time-slots-grid">
                                    {selectedDate && field.service_times
                                        .find(schedule => schedule.day_of_week === new Date(selectedDate).getDay())
                                        ?.time_slots
                                        .map((slot, index) => (
                                            <div
                                                key={index}
                                                className={`time-slot ${slot.is_available ? 'vacant' : 'occupied'} ${
                                                    selectedHours.start === slot.start_time ? 'selected' : ''
                                                }`}
                                                onClick={() => {
                                                    if (slot.is_available) {
                                                        setSelectedHours({
                                                            start: slot.start_time,
                                                            end: slot.end_time
                                                        });
                                                    }
                                                }}
                                            >
                                                <div className="status-indicator"></div>
                                                <div className="time-display">
                                                    <span className="start-time">{slot.start_time}</span>
                                                    <span className="end-time">{slot.end_time}</span>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Services Selection */}
                <div className="services-section">
                    <h2>Additional Services</h2>
                    <div className="services-list">
                        {field.services.map(service => (
                            <div key={service._id} className="service-item">
                                <div className="service-info">
                                    <h3>{service.name}</h3>
                                    <p className="service-price">${service.price}</p>
                                </div>
                                <div className="quantity-controls">
                                    <button
                                        onClick={() => handleQuantityChange(service._id, -1)}
                                        className="quantity-btn"
                                    >
                                        -
                                    </button>
                                    <span className="quantity-display">
                                        {serviceQuantities[service._id] || 0}
                                    </span>
                                    <button
                                        onClick={() => handleQuantityChange(service._id, 1)}
                                        className="quantity-btn"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* New Order Summary Box */}
                <div className="order-summary-box">
                    <h2>Order Summary</h2>

                    {/* Field Base Price */}
                    <div className="summary-item">
                        <div className="summary-label">Field Price:</div>
                        <div className="summary-price">{field.base_price || 0} VNĐ</div>
                    </div>

                    {/* Ground Selection Info (without price) */}
                    {selectedGround && (
                        <div className="summary-item">
                            <div className="summary-label">Selected Ground:</div>
                            <div className="summary-details">
                                <div>{field.grounds.find(g => g._id === selectedGround)?.name}</div>
                            </div>
                        </div>
                    )}

                    {/* Services Summary */}
                    {Object.entries(serviceQuantities).map(([serviceId, quantity]) => {
                        if (quantity > 0) {
                            const service = field.services.find(s => s._id === serviceId);
                            return (
                                <div key={serviceId} className="summary-item">
                                    <div className="summary-label">
                                        {service?.name} x{quantity}:
                                    </div>
                                    <div className="summary-price">
                                        {(service?.price * quantity)} VNĐ
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    })}

                    {/* Update Total Calculation */}
                    <div className="total-section">
                        <div className="total-label">Total Amount:</div>
                        <div className="total-amount">
                            {(
                                (field.base_price || 0) +
                                Object.entries(serviceQuantities).reduce((total, [serviceId, quantity]) => {
                                    const service = field.services.find(s => s._id === serviceId);
                                    return total + (service?.price * quantity || 0);
                                }, 0)
                            )} VNĐ
                        </div>
                    </div>
                </div>

                {/* Place Order Button */}
                <button
                    className="submit-order-btn"
                    onClick={handlePlaceOrder}>
                    Place Order
                </button>
            </div>
        </div>
    </div>
  );
};