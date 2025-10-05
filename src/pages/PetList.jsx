import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./PetList.css"
import Navbar from "./Navbar"; // Import your Navbar component
import Menu from "./Menu"; // Import your Menu component
import Footer from "./Footer";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

// Filter formu
function PetFilterForm({ onFilter, defaultValues, isOpen, onClose }) {
  const [type, setType] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [priceRange, setPriceRange] = useState([0, 2000]);

  useEffect(() => {
    if (defaultValues) {
      setType(defaultValues.type || "");
      setGender(defaultValues.gender || "");
      setCity(defaultValues.city || "");
      setMinPrice(defaultValues.minPrice || "");
      setMaxPrice(defaultValues.maxPrice || "");
      setPriceRange([
        Number(defaultValues.minPrice) || 0,
        Number(defaultValues.maxPrice) || 2000,
      ]);
    }
  }, [defaultValues]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (type) params.append("type", type);
    if (gender) params.append("gender", gender);
    if (city) params.append("city", city);

    // Qiyməti URL-ə əlavə et
    if (priceRange[0] > 0) params.append("price__gte", priceRange[0]);
    if (priceRange[1] < 5000) params.append("price__lte", priceRange[1]);

    onFilter(params.toString());
    onClose(); // Close the filter after applying
  };

  const handleMinChange = (e) => {
    const newMin = Number(e.target.value) || 0;
    setPriceRange([newMin, priceRange[1]]);
  };

  const handleMaxChange = (e) => {
    const newMax = Number(e.target.value) || 0;
    setPriceRange([priceRange[0], newMax]);
  };

  if (!isOpen) return null;

  return (
    <div className="filter-overlay" onClick={onClose}>
      <form onSubmit={handleSubmit} className="filter-form" onClick={(e) => e.stopPropagation()}>
        <div className="filter-header">
          <h3>Filterlər</h3>
          <button type="button" className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="filter-content">
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Bütün növlər</option>
            <option value="dog">İt</option>
            <option value="cat">Pişik</option>
            <option value="bird">Quş</option>
            <option value="fish">Balıq</option>
            <option value="rabbit">Dovşan</option>
            <option value="other">Digər</option>
          </select>

          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Bütün cinslər</option>
            <option value="male">Erkək</option>
            <option value="female">Dişi</option>
          </select>

          <input
            type="text"
            placeholder="Şəhər"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          
          <div className="price-filter">
            <label>Qiymət aralığı</label>
            <div className="price-inputs">
              <input
                type="number"
                value={priceRange[0]}
                onChange={handleMinChange}
                placeholder="Min"
              />
              <input
                type="number"
                value={priceRange[1]}
                onChange={handleMaxChange}
                placeholder="Max"
              />
            </div>

            <Slider
              range
              min={0}
              max={5000}
              step={50}
              value={priceRange}
              onChange={setPriceRange}
              trackStyle={[{ backgroundColor: "#ff004d" }]}
              handleStyle={[
                { borderColor: "#ff004d" },
                { borderColor: "#ff004d" },
              ]}
            />
          </div>

          <button type="submit" className="filter-apply-btn">Filterlə</button>
        </div>
      </form>
    </div>
  );
}

// Sort dropdown component
function SortDropdown({ onSort, currentSort }) {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { value: "", label: "Əsas sıralama" },
    { value: "price", label: "Qiymət (aşağıdan yuxarı)" },
    { value: "-price", label: "Qiymət (yuxarıdan aşağı)" },
    { value: "age", label: "Yaş (kiçikdən böyüyə)" },
    { value: "-age", label: "Yaş (böyükdən kiçiyə)" },
    { value: "-created_at", label: "Ən yeni" },
    { value: "created_at", label: "Ən köhnə" }
  ];

  const handleSort = (sortValue) => {
    onSort(sortValue);
    setIsOpen(false);
  };

  const getCurrentSortLabel = () => {
    const currentOption = sortOptions.find(option => option.value === currentSort);
    return currentOption ? currentOption.label : "Sırala";
  };

  return (
    <div className="sort-dropdown">
      <button 
        className="sort-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{getCurrentSortLabel()}</span>
        <span className={`sort-icon ${isOpen ? 'open' : ''}`}>▼</span>
      </button>
      
      {isOpen && (
        <div className="sort-options">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              className={`sort-option ${currentSort === option.value ? 'active' : ''}`}
              onClick={() => handleSort(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Hər bir heyvan üçün card
function PetCard({ pet }) {
 
  // Use actual image from API if available, otherwise use placeholder
  const imageUrl = pet.image;

  // Format date if available
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('az-AZ');
  };

  return (
    <div className="pet-card">
      <div className="pet-image-container">
        <img 
          src={imageUrl} 
          alt={pet.name}
          className="pet-image"
        />
      </div>
      <div className="pet-info">
        <h3>{pet.name}</h3>
        <p className="pet-details">{pet.type} - {pet.gender} - {pet.city}</p>
        <p className="pet-price-age">Qiymət: {pet.price} AZN - Yaş: {pet.age}</p>
        {pet.created_at && (
          <p className="pet-date">Əlavə edildi: {formatDate(pet.created_at)}</p>
        )}
      </div>
    </div>
  );
}

// Main PetList komponenti
export default function PetList() {
  const [pets, setPets] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const query = location.search.replace("?", "");

  const getFiltersFromURL = () => {
    const params = new URLSearchParams(location.search);
    return {
      type: params.get("type") || "",
      gender: params.get("gender") || "",
      city: params.get("city") || "",
      minPrice: params.get("price__gte") || "",
      maxPrice: params.get("price__lte") || "",
      sort: params.get("ordering") || "",
    };
  };

  const [filters, setFilters] = useState(getFiltersFromURL());

  const fetchPets = async (queryString = "") => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/pets/?${queryString}`);
      if (!res.ok) throw new Error("Network response not ok");
      const data = await res.json();
      console.log("API Response:", data);
      setPets(data.results ?? data.pets ?? []);
    } catch (error) {
      console.error("Fetch error:", error);
      setPets([]);
    }
  };

  useEffect(() => {
    fetchPets(query);
    setFilters(getFiltersFromURL());
  }, [query]);

  const handleFilter = (params) => {
    navigate("?" + params);
  };

  const handleSort = (sortValue) => {
    const params = new URLSearchParams(location.search);
    
    // Remove existing sort parameter
    params.delete("ordering");
    
    // Add new sort parameter if not empty
    if (sortValue) {
      params.append("ordering", sortValue);
    }
    
    navigate("?" + params.toString());
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const closeFilter = () => {
    setIsFilterOpen(false);
  };

  return (
    <div className="pet-list-page">
      {/* Add Navbar and Menu at the top */}
      <div className="sticky-header">
        <Navbar />
      </div>
      
      <div className="pet-list-container">
        {/* Controls section with filter and sort buttons */}
        <div className="controls-section">
          {/* Filter toggle button */}
          <div className="filter-toggle-section">
            <button className="filter-toggle-btn" onClick={toggleFilter}>
              <span>Filterlər</span>
              <span className={`toggle-icon ${isFilterOpen ? 'open' : ''}`}>▼</span>
            </button>
          </div>

          {/* Sort dropdown */}
          <div className="sort-section">
            <SortDropdown 
              onSort={handleSort} 
              currentSort={filters.sort}
            />
          </div>
        </div>

        {/* Filter dropdown */}
        <PetFilterForm 
          onFilter={handleFilter} 
          defaultValues={filters}
          isOpen={isFilterOpen}
          onClose={closeFilter}
        />

        {/* Pet cards below filter */}
        <main className="pet-main">
          <div className="pet-grid">
            {pets.length > 0 ? (
              pets.map((pet) => <PetCard key={pet.id} pet={pet} />)
            ) : (
              <p>Heç bir heyvan tapılmadı.</p>
            )}
          </div>
        </main>
      </div>
      <div className="sticky-footer">
        <Footer />
      </div>
    </div>
  );
}