import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Logo və qısa məlumat */}
        <div className="footer-section about">
          <h2 className="logo"></h2>
          <p>
            İtmiş və tapılmış ev heyvanlarını birləşdirən platforma. 
            Heyvansevərlər üçün birlik!
          </p>
        </div>

        {/* Navigasiya linkləri */}
        <div className="footer-section links">
          <h3>Sürətli keçidlər</h3>
          <ul>
            <li><a href="/">Ana səhifə</a></li>
            <li><a href="/lost">İtmiş heyvanlar</a></li>
            <li><a href="/found">Tapılmış heyvanlar</a></li>
            <li><a href="/contact">Əlaqə</a></li>
          </ul>
        </div>

        {/* Əlaqə məlumatları */}
        <div className="footer-section contact">
          <h3>Əlaqə</h3>
          <p>📍 Bakı, Azərbaycan</p>
          <p>📧 info@petfinder.az</p>
          <p>📞 +994 50 123 45 67</p>
        </div>

        {/* Sosial şəbəkələr */}
        <div className="footer-section social">
          <h3>Bizi izləyin</h3>
          <div className="social-links">
            <a href="#">Facebook</a>
            <a href="#">Instagram</a>
            <a href="#">Telegram</a>
          </div>
        </div>
      </div>

      {/* Alt hissə */}
      <div className="footer-bottom">
        <p>© 2025 PetFinder. Bütün hüquqlar qorunur.</p>
      </div>
    </footer>
  );
}
