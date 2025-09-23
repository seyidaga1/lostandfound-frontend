import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import "./Home.css"; // HomePage ilə eyni dizaynı istifadə edirik
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
        "Authorization": `Bearer ${localStorage.getItem("access_token")}`, // əgər JWT istifadə edirsə
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

  if (loading) return <p>Yüklənir...</p>;
  if (!profile) return <p>İstifadəçi məlumatları tapılmadı.</p>;

  return (
    <div className="homepage-container">
      
      <Navbar />

      {/* Profile Section */}
      <section className="hero-section" style={{ justifyContent: "flex-start", paddingTop: "50px" }}>
        <div className="hero-text">
          <h1>Salam, {profile.first_name}!</h1>
          <p>İstifadəçi məlumatlarını burada görə və yeniləyə bilərsən.</p>

          <div className="profile-info">
            <p><strong>Username:</strong> {profile.username}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Ad:</strong> {profile.first_name}</p>
            <p><strong>Soyad:</strong> {profile.last_name}</p>
            <p><strong>Telefon:</strong> {profile.phone || "Qeyd olunmayıb"}</p>
          </div>

          {/* Daha sonra Update düyməsi əlavə edə bilərsən */}
          <button className="btn-primary" onClick={() => alert("Update funksiyası hələ yoxdur")}>
            Yenilə
          </button>
        </div>
      </section>
    </div>
  );
}
