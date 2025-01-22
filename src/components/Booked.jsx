// src/components/Booked.jsx
import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './Booked.css';
import NavBar from './NavBar';
import { useAuth } from './AuthContext';

const Booked = () => {
  const [bookedHotels, setBookedHotels] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth(); // Use logout directly from AuthContext

  useEffect(() => {
    const fetchBookedHotels = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'bookings'));
        const bookedList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBookedHotels(bookedList);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchBookedHotels();
  }, []);

  const handleDelete = async (hotelId) => {
    try {
      await deleteDoc(doc(db, 'bookings', hotelId));
      setBookedHotels(bookedHotels.filter(hotel => hotel.id !== hotelId));
    } catch (err) {
      console.error('Error deleting hotel:', err);
    }
  };

  const handlePay = (hotel) => {
    navigate('/finance', { state: { hotel } });
  };

  return (
    <div className="booked-container">
      {/* Display NavBar */}
      {currentUser && <NavBar user={currentUser} onLogout={logout} />}

      <h1 className="booked-header">Your Booked Hotels</h1>
      {error && <p className="error-message">Error: {error}</p>}
      <div className="booked-hotel-list">
        {bookedHotels.length > 0 ? (
          bookedHotels.map((hotel, index) => (
            <div key={index} className="booked-hotel-item">
              <h2 className="booked-hotel-name">{hotel.hotelName}</h2>
              <div className="booked-hotel-details">
                <p>Check-in: {hotel.checkIn}</p>
                <p>Check-out: {hotel.checkOut}</p>
                <p>Location: {hotel.location}</p>
              </div>
              <button className="booked-hotel-button" onClick={() => handlePay(hotel)}>
                Pay Now
              </button>
              <button className="booked-hotel-button delete-button" onClick={() => handleDelete(hotel.id)}>
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No hotels booked yet.</p>
        )}
      </div>
    </div>
  );
};

export default Booked;
