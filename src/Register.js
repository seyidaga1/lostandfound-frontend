import React, { useState } from 'react';
import axios from 'axios';

function Register({ setIsAuthenticated }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  });

  const [error, setError] = useState(null);

  const handleChange = e => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);

    try {
      await axios.post('register/', formData);
      alert('Registration successful! Please login.');
      // İstəsən avtomatik login da edə bilərsən burada
    } catch (err) {
  if (err.response) {
    console.log('Backend error:', err.response.data);
    setError(err.response.data);
  } else if (err.request) {
    // Serverə sorğu getdi, amma cavab alınmadı
    console.log('No response from backend:', err.request);
    setError('No response from server. Please try again later.');
  } else {
    // Sorğu qurularkən başqa səhv
    console.log('Error setting up request:', err.message);
    setError('Error: ' + err.message);
  }
}

  };

  return (
    <div>
      <h2>Register</h2>
      {error && <div style={{color:'red'}}>{JSON.stringify(error)}</div>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" required onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
        <input type="text" name="first_name" placeholder="First name" onChange={handleChange} />
        <input type="text" name="last_name" placeholder="Last name" onChange={handleChange} />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
