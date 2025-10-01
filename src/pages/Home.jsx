"use client"

import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import "./Home.css"
import Navbar from "../pages/Navbar"
import Menu from "../pages/Menu"
import CountUp from "react-countup"
import { useInView } from "react-intersection-observer"

const categories = [
  { label: "🐶 İtlər", value: "dog" },
  { label: "🐱 Pişiklər", value: "cat" },
  { label: "🐦 Quşlar", value: "bird" },
  { label: "🐰 Dovşanlar", value: "rabbit" },
]

export default function HomePage() {
  const [pets, setPets] = useState([])
  const [stats, setStats] = useState({})
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchActive, setSearchActive] = useState(false)
  const [location, setLocation] = useState("Bakı, Azərbaycan")
  const [searchQuery, setSearchQuery] = useState("")
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const { user, setUser } = useContext(AuthContext)
  const isAuthenticated = !!user
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.6,
  })

  useEffect(() => {
    fetch("http://127.0.0.1:8000/pets/")
      .then((res) => res.json())
      .then((data) => {
        if (data.pets && Array.isArray(data.pets.results)) {
          setPets(data.pets.results)
        }
        if (data.stats) {
          setStats(data.stats)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (searchActive && inputRef.current) {
      inputRef.current.focus()
    }
  }, [searchActive])

  const handleCategorySelect = (categoryValue) => {
    setSelectedCategory(categoryValue)
  }

  const handleSearch = () => {
    console.log("Searching for:", searchQuery, "in", location)
  }

  const filteredPets = selectedCategory
    ? pets.filter((p) => p.type === selectedCategory && p.status === "adopting")
    : pets.filter((p) => p.status === "adopting")

  if (loading) return <div className="loading">Yüklənir...</div>

  return (
    <div className="homepage-container">
      <Navbar />
      <Menu />
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">Yeni ən yaxşı dostunu tap</h1>
            <p className="hero-subtitle">14,500-dən çox sığınacaq və xilasetmə şəbəkəmizdən heyvanları axtarın.</p>
          </div>
        </div>
      </section>

      <section className="category-section">
        <div className="category-grid">
          <div className="category-card" onClick={() => handleCategorySelect("dog")}>
            <div className="category-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#7C3AED"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                class="lucide lucide-dog-icon lucide-dog"
              >
                <path d="M11.25 16.25h1.5L12 17z" />
                <path d="M16 14v.5" />
                <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a11.702 11.702 0 0 0-.493-3.309" />
                <path d="M8 14v.5" />
                <path d="M8.5 8.5c-.384 1.05-1.083 2.028-2.344 2.5-1.931.722-3.576-.297-3.656-1-.113-.994 1.177-6.53 4-7 1.923-.321 3.651.845 3.651 2.235A7.497 7.497 0 0 1 14 5.277c0-1.39 1.844-2.598 3.767-2.277 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5" />
              </svg>{" "}
            </div>
            <p>İtlər</p>
          </div>

          <div className="category-card" onClick={() => navigate("/pets/?")}>
            <div className="category-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#7C3AED"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                class="lucide lucide-cat-icon lucide-cat"
              >
                <path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z" />
                <path d="M8 14v.5" />
                <path d="M16 14v.5" />
                <path d="M11.25 16.25h1.5L12 17l-.75-.75Z" />
              </svg>{" "}
            </div>
            <p>Pişiklər</p>
          </div>

          <div className="category-card" onClick={() => handleCategorySelect("other")}>
            <div className="category-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#7C3AED"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                class="lucide lucide-bird-icon lucide-bird"
              >
                <path d="M16 7h.01" />
                <path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20" />
                <path d="m20 7 2 .5-2 .5" />
                <path d="M10 18v3" />
                <path d="M14 17.75V21" />
                <path d="M7 18a6 6 0 0 0 3.84-10.61" />
              </svg>{" "}
            </div>
            <p>Quşlar</p>
          </div>

          <div className="category-card" onClick={() => handleCategorySelect("other")}>
            <div className="category-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#7C3AED"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                class="lucide lucide-fish-icon lucide-fish"
              >
                <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z" />
                <path d="M18 12v.5" />
                <path d="M16 17.93a9.77 9.77 0 0 1 0-11.86" />
                <path d="M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33" />
                <path d="M10.46 7.26C10.2 5.88 9.17 4.24 8 3h5.8a2 2 0 0 1 1.98 1.67l.23 1.4" />
                <path d="m16.01 17.93-.23 1.4A2 2 0 0 1 13.8 21H9.5a5.96 5.96 0 0 0 1.49-3.98" />
              </svg>{" "}
            </div>
            <p>Balıqlar</p>
          </div>

          <div className="category-card" onClick={() => handleCategorySelect("other")}>
            <div className="category-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#7C3AED"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                class="lucide lucide-rabbit-icon lucide-rabbit"
              >
                <path d="M13 16a3 3 0 0 1 2.24 5" />
                <path d="M18 12h.01" />
                <path d="M18 21h-8a4 4 0 0 1-4-4 7 7 0 0 1 7-7h.2L9.6 6.4a1 1 0 1 1 2.8-2.8L15.8 7h.2c3.3 0 6 2.7 6 6v1a2 2 0 0 1-2 2h-1a3 3 0 0 0-3 3" />
                <path d="M20 8.54V4a2 2 0 1 0-4 0v3" />
                <path d="M7.612 12.524a3 3 0 1 0-1.6 4.3" />
              </svg>{" "}
            </div>
            <p>Dovşan</p>
          </div>

          <div className="category-card" onClick={() => handleCategorySelect("other")}>
            <div className="category-icon">
              <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2">
                <circle cx="12" cy="12" r="4" />
                <circle cx="12" cy="12" r="8" />
              </svg>
            </div>
            <p>Digər</p>
          </div>
        </div>
      </section>

      <section className="stats-section" ref={ref}>
        <div className="stat-card">
          <h2>🐶 {inView && <CountUp end={stats.total || 0} duration={3} />}</h2>
          <p>Heyvanlar Platformada</p>
        </div>
        <div className="stat-card">
          <h2>🏡 {inView && <CountUp end={stats.adopting || 0} duration={3} />}</h2>
          <p>Adopt olunmağı gözləyir</p>
        </div>
        <div className="stat-card">
          <h2>💰 {inView && <CountUp end={stats.selling || 0} duration={3} />}</h2>
          <p>Satış üçün</p>
        </div>
        <div className="stat-card">
          <h2>🐾 {inView && <CountUp end={stats.breeding || 0} duration={3} />}</h2>
          <p>Yetişdirilməkdədir</p>
        </div>
        <div className="stat-card">
          <h2>🚨 {inView && <CountUp end={stats.urgent || 0} duration={3} />}</h2>
          <p>Təcili Ev Axtaran</p>
        </div>
      </section>

      <section className="about-section">
        <div className="hero-content">
          <h1 className="hero-title">About Platform</h1>
          <br />
          <p className="hero-subtitle">Learn more about what we do and how our platform works.</p>
        </div>
        <div className="about-container">
          <div className="about-card">
            <h2>Our Mission</h2>
            <p>
              Our platform is designed to make it easy for people to explore categories, and find exactly what they're
              looking for. We focus on simplicity, speed, and accessibility.
            </p>
          </div>

          <div className="about-card">
            <h2>How It Works</h2>
            <p>
              The process is simple:
              <br />
              1. Browse through categories
              <br />
              2. Use the search bar to quickly find items
              <br />
              3. Check details and connect directly
              <br />
              4. Create your own account to manage your profile
            </p>
          </div>

          <div className="about-card">
            <h2>Why Choose Us?</h2>
            <p>
              With a clean design, fast performance, and user-friendly interface, we make sure your experience is
              smooth. Plus, your data is secure with modern authentication and encryption.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
