import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import './BookNow.css';
import NavBar from './NavBar'; // NavBar already imported
import { useAuth } from './AuthContext';

const BookNow = () => {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({
    checkIn: '',
    checkOut: '',
    location: '',
    guests: 1,
  });

  const navigate = useNavigate();
  const { currentUser, onLogout } = useAuth(); // Use the currentUser from AuthContext

  useEffect(() => {
    const fetchHotels = async () => {
      const hotelCollection = await getDocs(collection(db, 'hotels'));
      const hotelsList = hotelCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHotels(hotelsList);
      setFilteredHotels(hotelsList);
    };
    fetchHotels();
  }, []);

  const handleChange = (e) => {
    setSearchCriteria({
      ...searchCriteria,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = () => {
    const { checkIn, checkOut, location, guests } = searchCriteria;
    const filtered = hotels.filter(hotel => {
      const matchesLocation = hotel.location.toLowerCase().includes(location.toLowerCase());
      const matchesGuests = hotel.capacity >= guests;
      return matchesLocation && matchesGuests;
    });
    setFilteredHotels(filtered);
  };

  const handleReserve = (hotel) => {
    navigate(`/hotel/${hotel.id}`, { state: { hotel } });
  };

  return (
    <div className="booknow-container">
      {/* Display NavBar */}
      {currentUser && <NavBar user={currentUser} onLogout={onLogout} />}

      <h1>Book Now</h1>
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
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="hotel-list">
        {filteredHotels.length > 0 ? (
          filteredHotels.map((hotel) => (
            <div key={hotel.id} className="hotel-item">
              <h2>{hotel.name}</h2>
              <p>Location: {hotel.location}</p>
              <p>Price per night: ${hotel.price}</p>
              <p>Rating: {hotel.rating} stars</p>
              <button onClick={() => handleReserve(hotel)}>Reserve</button>
            </div>
          ))
        ) : (
          <p>No hotels found matching your search criteria.</p>
        )}
      </div>
    </div>
  );
};

export default BookNow;
