import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderField.css';

export const OrderField = () => {
  const location = useLocation();
  const field = location.state?.field;
  const [ownerName, setOwnerName] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedGround, setSelectedGround] = useState('');
  const [selectedHours, setSelectedHours] = useState({ start: '', end: '' });
  const [serviceQuantities, setServiceQuantities] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch owner name using field.owner_id
    const fetchOwnerName = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/field_owner/${field.owner_id}`, {
          credentials: 'include'
        });
        const data = await response.json();
        if (data.success) {
          setOwnerName(data.owner.fullname);
        }
      } catch (error) {
        console.error('Error fetching owner name:', error);
      }
    };

    if (field?.owner_id) {
      fetchOwnerName();
    }
  }, [field?.owner_id]);

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

  const handlePlaceOrder = async () => {
    // Check if all required fields are filled
    if (!selectedDate || !selectedGround || !selectedHours.start || !selectedHours.end) {
      alert('Please fill in all required fields.');
      return;
    }

    // Debugging logs to check the values of selectedHours
    console.log('Selected Start Hour:', selectedHours.start);
    console.log('Selected End Hour:', selectedHours.end);

    // Calculate total price
    const ground = field.grounds.find(g => g._id === selectedGround);


    // Total price for the ground
    const totalGroundPrice = (ground.price || 0);

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
      {/* Left Description Plate */}
      <div className="field-description-plate">
        <div className="field-image-container">
          {field.image_url ? (
            <img src={field.image_url} alt={field.name} />
          ) : (
            <div className="placeholder-image"></div>
          )}
        </div>

        <div className="field-description-content">
          <h1 className="field-name">{field.name}</h1>
          <div className="field-info">
            <p className="field-address">
              <span className="label">Address:</span>
              {field.address}
            </p>
            <p className="field-owner">
              <span className="label">Owner:</span>
              {ownerName}
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
            <span className="price-amount">${field.base_price}</span>
          </div>
        </div>
      </div>

      {/* Right Order Section */}
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
                  {ground.name} - {ground.size}
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
            <div className="hours-inputs">
              <select
                value={`${selectedHours.start}-${selectedHours.end}`}
                onChange={(e) => {
                  const [start, end] = e.target.value.split('-');
                  setSelectedHours({
                    start: start,
                    end: end
                  });
                }}
                disabled={!selectedGround}
                className={!selectedGround ? 'disabled' : ''}
              >
                <option value="-">Select time slot...</option>
                {selectedDate && field.service_times
                  .find(schedule => schedule.day_of_week === new Date(selectedDate).getDay())
                  ?.time_slots
                  .filter(slot => slot.is_available)
                  .map((slot, index) => (
                    <option
                      key={index}
                      value={`${slot.start_time}-${slot.end_time}`}
                    >
                      {slot.start_time} - {slot.end_time}
                    </option>
                  ))
                }
              </select>
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



          {/* Ground Booking Summary */}
          {selectedGround && (
            <div className="summary-item">
              <div className="summary-label">Ground Booking:</div>
              <div className="summary-details">
                <div>{field.grounds.find(g => g._id === selectedGround)?.name}</div>
                <div className="summary-price">
                  ${field.grounds.find(g => g._id === selectedGround)?.price || 0}
                </div>
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
                    ${(service?.price * quantity).toFixed(2)}
                  </div>
                </div>
              );
            }
            return null;
          })}

          {/* Total Calculation */}
          <div className="total-section">
            <div className="total-label">Total Amount:</div>
            <div className="total-amount">
              ${(
                (selectedGround ?
                  (field.grounds.find(g => g._id === selectedGround)?.price || 0)
                  : 0) +
                Object.entries(serviceQuantities).reduce((total, [serviceId, quantity]) => {
                  const service = field.services.find(s => s._id === serviceId);
                  return total + (service?.price * quantity || 0);
                }, 0)
              ).toFixed(2)}
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
  );
};