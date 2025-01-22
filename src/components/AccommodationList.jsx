import React, { useState, useEffect } from 'react';
import { fetchAccommodations } from './firestoreService'; // Adjust the path accordingly

const AccommodationList = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch accommodations when the component mounts
    const getAccommodations = async () => {
      try {
        const data = await fetchAccommodations();
        setAccommodations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getAccommodations();
  }, []);

  if (loading) return <p>Loading accommodations...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Available Accommodations</h2>
      <ul>
        {accommodations.map((acc) => (
          <li key={acc.id}>
            <h3>{acc.name}</h3>
            <p>{acc.description}</p>
            <p>Price: {acc.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AccommodationList;
