import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase'; // Firebase Firestore instance
import { useParams } from 'react-router-dom';
import './HotelReservationPage.css'; // Add some styles for this page

const HotelReservationPage = () => {
  const { id } = useParams(); // Get the hotel ID from the URL
  const [hotel, setHotel] = useState(null);
  const [searchCriteria, setSearchCriteria] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
  });

  // Fetch the selected hotel data based on the hotel ID
  useEffect(() => {
    const fetchHotel = async () => {
      const hotelDoc = await getDoc(doc(db, 'hotels', id));
      if (hotelDoc.exists()) {
        setHotel(hotelDoc.data());
      }
    };
    fetchHotel();
  }, [id]);

  // Handle input change for the search form
  const handleChange = (e) => {
    setSearchCriteria({
      ...searchCriteria,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="reservation-container">
      {hotel ? (
        <div>
          <h1>{hotel.name}</h1>
          <img src={hotel.gallery[0]} alt={hotel.name} className="hotel-main-image" />
          <p>Location: {hotel.location}</p>
          <p>Price per night: ${hotel.price}</p>
          <p>Rating: {hotel.rating} stars</p>
          <p>Facilities: {hotel.facilities.join(', ')}</p>
          <p>Policies: {hotel.policies.join(', ')}</p>
        </div>
      ) : (
        <p>Loading hotel details...</p>
      )}

      {/* Search Form */}
      <div className="search-form">
        <h2>Complete Your Reservation</h2>
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
          type="number"
          name="guests"
          value={searchCriteria.guests}
          onChange={handleChange}
          placeholder="Number of Guests"
          min="1"
        />
        <button>Reserve Now</button>
      </div>
    </div>
  );
};

export default HotelReservationPage;
