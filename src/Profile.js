import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/me/')
      .then(res => {
        setProfile(res.data);
        setFormData(res.data);
      })
      .catch(err => setError('Failed to load profile'));
  }, []);

  const handleChange = e => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setError(null);

    axios.put('/me/', formData)
      .then(res => {
        alert('Profile updated');
        setProfile(res.data);
      })
      .catch(err => setError('Update failed'));
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <h2>Profile</h2>
      {error && <div style={{color:'red'}}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="first_name" placeholder="First name" value={formData.first_name || ''} onChange={handleChange} />
        <input type="text" name="last_name" placeholder="Last name" value={formData.last_name || ''} onChange={handleChange} />
        <input type="text" name="phone" placeholder="Phone" value={formData.phone || ''} onChange={handleChange} />
        <input type="text" name="location" placeholder="Country code (e.g. AZ)" value={formData.location || ''} onChange={handleChange} />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default Profile;
