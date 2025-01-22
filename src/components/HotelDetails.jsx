import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addDoc, collection } from 'firebase/firestore'; // Import Firestore functions
import { db } from './firebase'; // Import the Firestore database
import NavBar from './NavBar'; // Import NavBar
import { useAuth } from './AuthContext'; // Import useAuth to get currentUser and onLogout
import './HotelDetails.css';

const HotelDetails = () => {
  const location = useLocation();
  const { hotel } = location.state || {};
  const navigate = useNavigate();
  const { currentUser, onLogout } = useAuth();

  const [searchCriteria, setSearchCriteria] = useState({
    checkIn: '',
    checkOut: '',
    location: '',
    guests: 1,
  });

  const handleChange = (e) => {
    setSearchCriteria({
      ...searchCriteria,
      [e.target.name]: e.target.value,
    });
  };

  const handleReserve = async () => {
    if (!hotel) return;

    try {
      // Save booking information in Firestore
      const bookingData = {
        user: currentUser.uid,
        hotelName: hotel.name,
        checkIn: searchCriteria.checkIn,
        checkOut: searchCriteria.checkOut,
        location: searchCriteria.location,
        guests: searchCriteria.guests,
        price: hotel.price,
        reservedAt: new Date(),
      };

      await addDoc(collection(db, 'bookings'), bookingData); // Save booking to Firestore

      // Show toast notification with payment options
      toast.info(
        <div>
          <p>Hotel {hotel.name} is booked! Do you wish to complete payment?</p>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => handlePaymentChoice(true)}>Yes</button>
            <button onClick={() => handlePaymentChoice(false)}>No</button>
          </div>
        </div>,
        {
          position: 'top-center',
          autoClose: false,
          closeOnClick: false,
        }
      );
    } catch (error) {
      console.error('Error booking hotel:', error);
      toast.error('Failed to book the hotel. Please try again.');
    }
  };

  const handlePaymentChoice = (proceedToPayment) => {
    toast.dismiss(); // Close the toast notification
    if (proceedToPayment) {
      // If 'Yes', navigate to the FinancePage
      navigate('/finance', {
        state: { hotel, searchCriteria },
      });
    } else {
      // If 'No', navigate back to the dashboard
      navigate('/dashboard');
    }
  };

  if (!hotel) {
    return <p>Hotel details not found.</p>;
  }

  return (
    <div>
      <NavBar user={currentUser} onLogout={onLogout} /> {/* Display NavBar */}
      
      <div className="hotel-details-container">
        <div className="search-form">
          <input
            type="date"
            name="checkIn"
            value={searchCriteria.checkIn}
            onChange={handleChange}
            placeholder="Check-in Date"
          />
          <input
            type="date"
            name="checkOut"
            value={searchCriteria.checkOut}
            onChange={handleChange}
            placeholder="Check-out Date"
          />
          <input
            type="text"
            name="location"
            value={searchCriteria.location}
            onChange={handleChange}
            placeholder="Where?"
          />
          <input
            type="number"
            name="guests"
            value={searchCriteria.guests}
            onChange={handleChange}
            placeholder="Number of Guests"
            min="1"
          />
          <button onClick={handleReserve}>Search</button>
        </div>

        <h1>{hotel.name}</h1>
        <div className="hotel-details">
          {hotel.gallery && hotel.gallery.length > 0 ? (
            <img src={hotel.gallery[0]} alt={hotel.name} className="hotel-main-image" />
          ) : (
            <p>No image available</p>
          )}
          <div className="hotel-info">
            <p>Location: {hotel.location}</p>
            <p>Price per night: ${hotel.price}</p>
            <p>Rating: {hotel.rating} stars</p>
            <p>Facilities: {hotel.facilities?.join(', ') || 'Not specified'}</p>
            <p>Policies: {hotel.policies?.join(', ') || 'No policies available'}</p>
          </div>
        </div>

        <div className="reserve-button-container">
          <button onClick={handleReserve} className="reserve-button">
            Proceed to Reserve
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;
