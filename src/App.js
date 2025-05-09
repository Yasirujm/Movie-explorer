import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import MovieDetails from './components/MovieDetails';
import Navbar from './components/Navbar';
import './App.css'; 

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogin = (username, password) => {
    if (username === 'admin' && password === '1234') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
    document.body.className = darkMode ? 'light' : 'dark';
  };

  return (
    <Router>
      {isAuthenticated && (
        <Navbar onLogout={handleLogout} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      )}
      <Routes>
        {isAuthenticated ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
          </>
        ) : (
          <Route path="*" element={<Login onLogin={handleLogin} />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
