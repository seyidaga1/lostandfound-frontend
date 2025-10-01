import React, { useState, useEffect } from "react";

export default function PetFilterForm({ onFilter, defaultValues }) {
  const [type, setType] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // URL-dən default dəyərləri set et
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
