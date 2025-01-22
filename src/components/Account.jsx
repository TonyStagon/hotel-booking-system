// src/components/Account.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar'; // Import NavBar
import { auth } from './firebase';
import './Account.css';

const Account = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut().then(() => {
      setUser(null);
      navigate('/login');
    });
  };

  const handleClick = (route) => {
    navigate(route);
  };

  return (
    <div className="account-container">
      <NavBar user={user} onLogout={handleLogout} /> {/* Pass user and onLogout */}
      <h1>Account Settings</h1>
      <div className="grid-layout">
        <div className="grid-item" onClick={() => handleClick('/account/personal-info')}>
          <h3>Personal Info</h3>
          <p>View and edit your personal information</p>
        </div>
        <div className="grid-item" onClick={() => handleClick('/account/login-updates')}>
          <h3>Login Updates</h3>
          <p>Manage your login details and security settings</p>
        </div>
        <div className="grid-item" onClick={() => handleClick('/account/upload-picture')}>
  <h3>Upload Profile Picture</h3>
  <p>Update your profile picture</p>
</div>
      </div>
    </div>
  );
};

export default Account;
