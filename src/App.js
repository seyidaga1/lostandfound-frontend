import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

import Register from './Register';
import Login from './Login';
import Profile from './Profile';

axios.defaults.baseURL = 'http://127.0.0.1:8000/';

// Tokenı header-a avtomatik əlavə etmək üçün interceptor
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if(token){
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
  };

  useEffect(() => {
    // Bura access token yoxlama və refresh etmək üçün əlavə logic yaza bilərsən
  }, []);

  return (
    <BrowserRouter>
      <nav style={{marginBottom:'20px'}}>
        {!isAuthenticated ? (
          <>
            <a href="/login">Login</a> | <a href="/register">Register</a>
          </>
        ) : (
          <>
            <a href="/profile">Profile</a> | <button onClick={logout}>Logout</button>
          </>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated ? "/profile" : "/login"} />} />
        <Route path="/register" element={<Register setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
