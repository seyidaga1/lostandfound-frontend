import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Home.css";
import Navbar from "../pages/Navbar";

const categories = [
  { label: "🐶 İtlər", value: "dog" },
  { label: "🐱 Pişiklər", value: "cat" },
  { label: "🐦 Quşlar", value: "bird" },
  { label: "🐰 Dovşanlar", value: "rabbit" },
];

export default function HomePage() {
  const [pets, setPets] = useState([]);
  const [stats, setStats] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchActive, setSearchActive] = useState(false);
  const [location, setLocation] = useState("Bakı, Azərbaycan");
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const isAuthenticated = !!user;
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // Data fetch
  useEffect(() => {
    fetch("http://127.0.0.1:8000/pets/")
      .then(res => res.json())
      .then(data => {
        if (data.pets && Array.isArray(data.pets.results)) {
          setPets(data.pets.results);
        }
        if (data.stats) {
          setStats(data.stats);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Focus input when searchActive becomes true
  useEffect(() => {
    if (searchActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchActive]);

  const handleCategorySelect = (categoryValue) => {
    setSelectedCategory(categoryValue);
    // Navigate to pets page with category filter or handle category selection
  };

  const handleSearch = () => {
    // Handle search functionality
    console.log("Searching for:", searchQuery, "in", location);
  };

  const filteredPets = selectedCategory
    ? pets.filter(p => p.type === selectedCategory && p.status === "adopting")
    : pets.filter(p => p.status === "adopting");

  if (loading) return <div className="loading">Yüklənir...</div>;

  return (
    <div className="homepage-container">
      <Navbar />
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">Yeni ən yaxşı dostunu tap</h1>
            <p className="hero-subtitle">
              14,500-dən çox sığınacaq və xilasetmə şəbəkəmizdən heyvanları axtarın.
            </p>
            
            
          </div>
        </div>
      </section>

      <section className="category-section">
        <div className="category-grid">
          <div className="category-card" onClick={() => handleCategorySelect('dog')}>
            <div className="category-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2">
                <path d="M8.5 14.5A2.5 2.5 0 0 1 11 12c0-1.38.5-2.5 1-3 .5.5 1 1.62 1 3a2.5 2.5 0 0 1 2.5 2.5c0 .5-.1 1-.3 1.5L12 21l-3.2-5c-.2-.5-.3-1-.3-1.5z"/>
                <path d="M12 12V8a4 4 0 0 0-4-4 2 2 0 0 0 0 4c1.5 0 2.5 1 2.5 2.5"/>
                <path d="M12 12V8a4 4 0 0 1 4-4 2 2 0 0 1 0 4c-1.5 0-2.5 1-2.5 2.5"/>
              </svg>
            </div>
            <p>İtlər</p>
          </div>

          <div className="category-card" onClick={() => handleCategorySelect('cat')}>
            <div className="category-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                <line x1="9" y1="9" x2="9.01" y2="9"/>
                <line x1="15" y1="9" x2="15.01" y2="9"/>
                <path d="M12 2l2 2-2 2-2-2z"/>
                <path d="M12 2l-2 2 2 2 2-2z"/>
              </svg>
            </div>
            <p>Pişiklər</p>
          </div>

          <div className="category-card" onClick={() => handleCategorySelect('other')}>
            <div className="category-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2">
                <circle cx="12" cy="12" r="2"/>
                <circle cx="12" cy="12" r="6"/>
                <circle cx="12" cy="12" r="10"/>
              </svg>
            </div>
            <p>Quşlar</p>
          </div>

          <div className="category-card" onClick={() => handleCategorySelect('other')}>
            <div className="category-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2">
                <circle cx="12" cy="12" r="2"/>
                <circle cx="12" cy="12" r="6"/>
                <circle cx="12" cy="12" r="10"/>
              </svg>
            </div>
            <p>Balıqlar</p>
          </div>

          <div className="category-card" onClick={() => handleCategorySelect('other')}>
            <div className="category-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2">
                <circle cx="12" cy="12" r="2"/>
                <circle cx="12" cy="12" r="6"/>
                <circle cx="12" cy="12" r="10"/>
              </svg>
            </div>
            <p>Dovşan</p>
          </div>

          <div className="category-card" onClick={() => handleCategorySelect('other')}>
            <div className="category-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2">
                <circle cx="12" cy="12" r="2"/>
                <circle cx="12" cy="12" r="6"/>
                <circle cx="12" cy="12" r="10"/>
              </svg>
            </div>
            <p>Digər</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stat-card">
          <h2>🐶 {stats.total || 0}</h2>
          <p>Heyvanlar Platformada</p>
        </div>
        <div className="stat-card">
          <h2>🏡 {stats.adopting || 0}</h2>
          <p>Adopt olunmağı gözləyir</p>
        </div>
        <div className="stat-card">
          <h2>💰 {stats.selling || 0}</h2>
          <p>Satış üçün</p>
        </div>
        <div className="stat-card">
          <h2>🐾 {stats.breeding || 0}</h2>
          <p>Yetişdirilməkdədir</p>
        </div>
        <div className="stat-card">
          <h2>🚨 {stats.urgent || 0}</h2>
          <p>Təcili Ev Axtaran</p>
        </div>
      </section>
    </div>
  );
}