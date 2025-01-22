import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51QDhySK00NR3qztWpPut9XbyDJBEXmT5kS30f49cVi7yGoR4QpYuaVObIOILM8UGUwk0V9LNzdGhlxDKNLzZlNY900HE3Mbmjt'); // Replace with your Stripe publishable key

const FinancePage = () => {
  const location = useLocation();
  const { hotel, searchCriteria } = location.state || {};
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Fetch the payment intent client secret when the page loads
    fetch('https://<your-project-id>.cloudfunctions.net/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: hotel.price * searchCriteria.guests, // The total price to pay
      }),
    })
      .then((response) => response.json())
      .then((data) => setClientSecret(data.clientSecret))
      .catch((error) => console.error('Error fetching client secret:', error));
  }, [hotel, searchCriteria]);

  const handlePayment = async () => {
    const stripe = await stripePromise;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: { /* Add card details collection form here */ },
      },
    });

    if (result.error) {
      console.error('Payment error:', result.error.message);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        alert('Payment successful!');
      }
    }
  };

  if (!hotel || !searchCriteria) {
    return <p>Reservation details are missing. Please go back and try again.</p>;
  }

  return (
    <div className="finance-page">
      <h1>Complete Your Reservation</h1>
      <div className="reservation-details">
        <h2>Hotel: {hotel.name}</h2>
        <p>Location: {hotel.location}</p>
        <p>Price per night: ${hotel.price}</p>
        <p>Check-in: {searchCriteria.checkIn}</p>
        <p>Check-out: {searchCriteria.checkOut}</p>
        <p>Guests: {searchCriteria.guests}</p>
      </div>

      {/* Add a simple payment form here */}
      <button onClick={handlePayment}>Proceed to Payment</button>
    </div>
  );
};

export default FinancePage;
