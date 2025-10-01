import { useState, useRef, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";


export default function Navbar() {
  const [searchActive, setSearchActive] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const isAuthenticated = !!user;

  useEffect(() => {
    if (searchActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchActive]);

  const handleSignOut = () => {
    localStorage.clear();
    setUser(null);
    navigate("/");
  };

  return (
    <div className="navbar">
      <div className="logo" onClick={() => navigate("/")}></div>

      {/* Hamburger */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <i className="fa-solid fa-bars"></i>
      </div>

      {/* Sağ tərəf (buttons və profile) */}
      <div className="nav-buttons">
        {isAuthenticated ? (
          <div className="profile-wrapper">
            <i
              className="fa-solid fa-user profile-icon"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            ></i>
            

            {/* Dropdown */}
            <div className={`profile-dropdown ${profileMenuOpen ? "show" : ""}`}>
              <button
                className="dropdown-btn"
                onClick={() => {
                  navigate("/profile");
                  setProfileMenuOpen(false);
                }}
              >
                Profile
              </button>
              <button className="dropdown-btn" onClick={handleSignOut}>
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <>
            <button className="btn-primary" onClick={() => navigate("/login")}>LOGIN</button>
            <button className="btn-primary" onClick={() => navigate("/register")}>REGISTER</button>
          </>
        )}
      </div>
    </div>
  );
}


