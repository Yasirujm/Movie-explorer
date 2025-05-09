import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(document.body.classList.contains('dark'));

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    document.body.classList.toggle('light', !darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <nav className="navbar">
      <div className="navbar-title" onClick={() => navigate('/')}>🎬 Movie Explorer</div>
      <div className="navbar-links">
        <button onClick={toggleDarkMode} className="toggle-btn">
          {darkMode ? '🌙 Dark' : '☀️ Light'}
        </button>
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
