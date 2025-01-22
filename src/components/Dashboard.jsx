// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';
import { useAuth } from './AuthContext'; // Import useAuth
import { auth } from './firebase';
import './Dashboard.css';

const Dashboard = () => {
  const { currentUser } = useAuth(); // Access currentUser from AuthProvider
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigate('/login');
    });
  };

  const getUserInitial = () => currentUser?.email?.charAt(0).toUpperCase() || '';

  return (
    <div className="dashboard-container">
      <nav className="custom-navbar">
        <div className="navbar-brand">EnviroHotel</div>
        <div className="navbar-links">
          <NavLink to="/account">Account</NavLink>
          <NavLink to="/booked">Booked</NavLink>
          <NavLink to="/book-now">Book Now</NavLink>
          <button onClick={handleLogout}>Log out</button>
          {currentUser && (
            <span
              className="user-initial"
              style={{
                backgroundColor: currentUser.profilePicture ? 'transparent' : '#333',
                backgroundImage: currentUser.profilePicture ? `url(${currentUser.profilePicture})` : 'none',
                backgroundSize: 'cover',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '16px',
              }}
            >
              {!currentUser.profilePicture && getUserInitial()}
            </span>
          )}
        </div>
      </nav>

      {/* Rest of the Dashboard component */}
    </div>
  );
};

export default Dashboard;
