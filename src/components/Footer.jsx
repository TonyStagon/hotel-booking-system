// src/components/Footer.jsx
import React from 'react';
import './Footer.css'; // Footer-specific styles

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} EnviroHotel. All Rights Reserved.By Arthur</p>
    </footer>
  );
};

export default Footer;
