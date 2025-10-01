import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import "./Profile.css"; 
import Navbar from "../pages/Navbar";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const isAuthenticated = !!user;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    fetch("http://127.0.0.1:8000/profile/", {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [isAuthenticated, navigate]);

  if (loading) return <p className="loading">Yüklənir...</p>;
  if (!profile) return <p className="error">İstifadəçi məlumatları tapılmadı.</p>;

  return (
    <div className="profile-page">
      <Navbar />
      <section className="profile-section">
        <div className="profile-card">
          <div className="avatar">
            <img 
              src={`https://ui-avatars.com/api/?name=${profile.first_name}+${profile.last_name}&background=7C3AED&color=fff`} 
              alt="Profile Avatar" 
            />
          </div>

          <h2 className="profile-name">{profile.first_name} {profile.last_name}</h2>
          <p className="profile-username">@{profile.username}</p>

          <div className="profile-info">
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Telefon:</strong> {profile.phone || "Qeyd olunmayıb"}</p>
          </div>

          <button className="btn-update" onClick={() => alert("Update funksiyası hələ yoxdur")}>
            ✏️ Yenilə
          </button>
        </div>
      </section>
    </div>
  );
}
