"use client"

import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import "./Home.css"
import Navbar from "../pages/Navbar"
import Footer from "../pages/Footer"
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

  // Contact form state
  const [contactForm, setContactForm] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

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

  const handleContactChange = (e) => {
    const { name, value } = e.target
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      console.log("Form data before sending:", contactForm)

      const response = await fetch("http://127.0.0.1:8000/contact/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: contactForm.fullName,
          email: contactForm.email,
          subject: contactForm.subject,
          message: contactForm.message
        })
      })

      const data = await response.json()
      console.log("Response:", data)

      if (response.ok) {
        setSubmitStatus("success")
        setContactForm({
          fullName: "",
          email: "",
          subject: "",
          message: ""
        })
      } else {
        console.error("Error response:", data)
        setSubmitStatus("error")
      }
    } catch (error) {
      console.error("Error:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
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
          <div className="category-card"  onClick={() => navigate("/pets?type=dog")}>
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
                className="lucide lucide-dog-icon lucide-dog"
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

          <div className="category-card" onClick={() => navigate("/pets/?type=cat")}>
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
                className="lucide lucide-cat-icon lucide-cat"
              >
                <path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z" />
                <path d="M8 14v.5" />
                <path d="M16 14v.5" />
                <path d="M11.25 16.25h1.5L12 17l-.75-.75Z" />
              </svg>{" "}
            </div>
            <p>Pişiklər</p>
          </div>

          <div className="category-card"  onClick={() => navigate("/pets?type=bird")}>
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
                className="lucide lucide-bird-icon lucide-bird"
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

          <div className="category-card" onClick={() => navigate("/pets?type=fish")}>
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
                className="lucide lucide-fish-icon lucide-fish"
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

          <div className="category-card"  onClick={() => navigate("/pets?type=rabbit")}>
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
                className="lucide lucide-rabbit-icon lucide-rabbit"
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

          <div className="category-card"  onClick={() => navigate("/pets?type=other")}>
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
          <h1 className="hero-title">Haqqımızda</h1>
          <br />
          <p className="hero-subtitle">
            Nə etdiyimizi və platformamızın necə işlədiyini daha ətraflı öyrənin.
          </p>
        </div>
        <div className="about-container">
          <div className="about-card">
            <h2>Missiyamız</h2>
            <p>
              Platformamız insanların kateqoriyaları asanlıqla araşdırmasını və
              məhz axtardıqları şeyi tapmasını təmin etmək üçün hazırlanıb. Biz sadəliyə
              , sürətə və əlçatanlığa fokuslanırıq.
            </p>
          </div>

          <div className="about-card">
            <h2>Necə işləyir?</h2>
            <p>
              Proses çox sadədir:
              <br />
              1. Kateqoriyalara nəzər yetirin
              <br />
              2. Axtarış panelindən istifadə edərək tez bir zamanda tapın
              <br />
              3. Detallara baxın və birbaşa əlaqə saxlayın
              <br />
              4. Öz hesabınızı yaradın və profilinizi idarə edin
            </p>
          </div>

          <div className="about-card">
            <h2>Niyə bizi seçməlisiniz?</h2>
            <p>
              Təmiz dizayn, sürətli performans və istifadəçi dostu interfeys ilə sizin təcrübənizin rahat olmasını təmin edirik.
              Üstəlik, müasir identifikasiya və şifrələmə ilə məlumatlarınız tam təhlükəsizlikdədir.
            </p>
          </div>
        </div>
      </section>

      <section className="contact-section">
        <div className="hero-content">
          <h1 className="hero-title">Bizimlə Əlaqə</h1>
          <br />
          <p className="hero-subtitle">
            Sizin suallarınız və rəyləriniz bizim üçün önəmlidir. Mesajınızı göndərin!
          </p>
        </div>

        <div className="contact-container">
          <div className="contact-form-wrapper">
            <form className="contact-form" onSubmit={handleContactSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullName">
                    Ad Soyad <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={contactForm.fullName}
                    onChange={handleContactChange}
                    required
                    placeholder="Adınızı daxil edin"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleContactChange}
                    required
                    placeholder="emailiniz@example.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">
                  Mövzu <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={contactForm.subject}
                  onChange={handleContactChange}
                  required
                  placeholder="Mesajınızın mövzusu"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">
                  Mesaj <span className="required">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={contactForm.message}
                  onChange={handleContactChange}
                  required
                  placeholder="Mesajınızı buraya yazın..."
                  rows="6"
                />
              </div>

              {submitStatus === "success" && (
                <div className="alert alert-success">
                  ✓ Mesajınız uğurla göndərildi! Tezliklə sizinlə əlaqə saxlayacağıq.
                </div>
              )}

              {submitStatus === "error" && (
                <div className="alert alert-error">
                  ✗ Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.
                </div>
              )}

              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Göndərilir..." : "Göndər"}
              </button>
            </form>
          </div>

          <div className="contact-info">
            <div className="info-card">
              <div className="info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <h3>Ünvan</h3>
              <p>Bakı, Azərbaycan</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </div>
              <h3>Email</h3>
              <p>info@petadopt.az</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <h3>Telefon</h3>
              <p>+994 XX XXX XX XX</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}