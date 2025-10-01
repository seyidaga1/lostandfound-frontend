import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./PetList.css"

// Filter formu
function PetFilterForm({ onFilter, defaultValues }) {
  const [type, setType] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    if (defaultValues) {
      setType(defaultValues.type || "");
      setGender(defaultValues.gender || "");
      setCity(defaultValues.city || "");
      setMinPrice(defaultValues.minPrice || "");
      setMaxPrice(defaultValues.maxPrice || "");
    }
  }, [defaultValues]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (type) params.append("type", type);
    if (gender) params.append("gender", gender);
    if (city) params.append("city", city);
    if (minPrice) params.append("price__gte", minPrice);
    if (maxPrice) params.append("price__lte", maxPrice);
    onFilter(params.toString());
  };

  return (
    <form onSubmit={handleSubmit} className="filter-form">
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="">All Types</option>
        <option value="dog">Dog</option>
        <option value="cat">Cat</option>
      </select>

      <select value={gender} onChange={(e) => setGender(e.target.value)}>
        <option value="">All Genders</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>

      <input
        type="text"
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <input
        type="number"
        placeholder="Min Price"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
      />
      <input
        type="number"
        placeholder="Max Price"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
      />
      <button type="submit">Filter</button>
    </form>
  );
}

// Hər bir heyvan üçün card
function PetCard({ pet }) {
  return (
    <div className="pet-card">
      <h3>{pet.name}</h3>
      <p>{pet.type} - {pet.gender} - {pet.city}</p>
      <p>Price: {pet.price} - Age: {pet.age}</p>
    </div>
  );
}

// Main PetList komponenti
export default function PetList() {
  const [pets, setPets] = useState([]);
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
    };
  };

  const [filters, setFilters] = useState(getFiltersFromURL());

  const fetchPets = async (queryString = "") => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/pets/?${queryString}`);
      if (!res.ok) throw new Error("Network response not ok");
      const data = await res.json();
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

  return (
    <div className="pet-list-page">
      <PetFilterForm onFilter={handleFilter} defaultValues={filters} />

      <div className="pet-grid">
        {pets.length > 0 ? (
          pets.map((pet) => <PetCard key={pet.id} pet={pet} />)
        ) : (
          <p>No pets found.</p>
        )}
      </div>
    </div>
  );
}
