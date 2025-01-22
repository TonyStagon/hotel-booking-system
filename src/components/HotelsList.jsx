// src/components/HotelsList.jsx
import React, { useEffect, useState } from 'react';
import { db } from './firebase'; // Firebase Firestore instance
import { collection, getDocs } from 'firebase/firestore';

const HotelsList = () => {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    const fetchHotels = async () => {
      const hotelCollection = await getDocs(collection(db, 'hotels'));
      setHotels(hotelCollection.docs.map(doc => doc.data()));
    };
    fetchHotels();
  }, []);

  return (
    <div className="hotels-list">
      <h1>Available Hotels</h1>
      {hotels.map((hotel, index) => (
        <div key={index} className="hotel-item">
          <h2>{hotel.name}</h2>
          <p>Location: {hotel.location}</p>
          <p>Price: {hotel.price}</p>
          <p>Rating: {hotel.rating}</p>
          <p>Facilities: {hotel.facilities.join(', ')}</p>
          <p>Policies: {hotel.policies.join(', ')}</p>
        </div>
      ))}
    </div>
  );
};

export default HotelsList;
