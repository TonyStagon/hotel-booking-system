// src/components/LoginUpdates.jsx
import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import './LoginUpdates.css';
import CustomNavBar from './CustomNavBar';
const LoginUpdates = () => {
  const [currentEmail, setCurrentEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (auth.currentUser) {
      setCurrentEmail(auth.currentUser.email);
    }
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setMessage('Please fill in all fields');
      return;
    }
    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      setMessage('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
      setMessage('Error updating password. Please try again.');
    }
  };

  return (
    <div className="login-updates-container">
          <CustomNavBar /> 
      <h2>Login Updates</h2>
      <p>Email: {currentEmail}</p>
      
      <form onSubmit={handlePasswordChange}>
        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Update Password</button>
      </form>
      
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default LoginUpdates;
