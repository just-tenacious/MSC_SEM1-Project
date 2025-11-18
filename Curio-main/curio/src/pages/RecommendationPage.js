import React, { useState } from "react";
import subRecommendations from "../data/recommendation-detail.json";

const mainRecommendations = [
  { _id: 1, name: "Outfit Ideas", desc: "Curated outfits for everyday and events.", img: "👗" },
  { _id: 2, name: "Accessories", desc: "Bags, belts, and jewelry to complete your look.", img: "👜" },
  { _id: 3, name: "Footwear", desc: "Comfort & style picks for every outfit.", img: "👠" },
  { _id: 4, name: "Hairstyles", desc: "Flattering cuts & styling tips.", img: "💇‍♀️" },
  { _id: 5, name: "Seasonal Trends", desc: "What's in and how to wear it elegantly.", img: "🌸" },
];

const categoryFilters = {
  1: ["gender", "bodyType", "season", "occasion"],
  2: ["gender", "suitableWith", "occasion"],
  3: ["gender", "suitableWith", "occasion"],
  4: ["gender", "faceType", "occasion"],
  5: ["bodyType", "season", "occasion"],
};

const filterOptions = {
  gender: ["all", "men", "women", "unisex"],
  bodyType: ["all", "hourglass", "rectangular", "pear", "apple", "petite", "tall", "medium", "slim"],
  season: ["all", "spring", "summer", "autumn", "winter", "monsoon", "winter/festive"],
  occasion: ["all", "casual", "formal", "party", "festival", "wedding", "travel", "office", "brunch", "outdoor", "sport"],
  faceType: ["all", "oval", "round", "square", "heart"],
  suitableWith: ["all", "casual", "formal", "party", "traditional", "travel", "office", "summer", "winter", "beach", "sporty"],
};

// Color coding for tags
const tagColors = {
  gender: "#6C63FF",
  bodyType: "#FF6584",
  season: "#FFA41B",
  occasion: "#4CAF50",
  faceType: "#FFB6C1",
  suitableWith: "#00BFFF",
};

const RecommendationPage = () => {
  const [selectedMain, setSelectedMain] = useState(null);
  const [filters, setFilters] = useState({});

  const handleFilterChange = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));
  const removeFilter = (key) => setFilters((prev) => ({ ...prev, [key]: "all" }));

  const filteredSubs = selectedMain
    ? subRecommendations
        .filter((sub) => sub.id === selectedMain._id)
        .filter((sub) =>
          categoryFilters[selectedMain._id].every((filterKey) => {
            const filterValue = filters[filterKey] || "all";
            if (filterValue === "all") return true;
            if (!sub[filterKey]) return false;
            if (Array.isArray(sub[filterKey])) return sub[filterKey].includes(filterValue) || sub[filterKey].includes("all");
            return sub[filterKey] === filterValue;
          })
        )
    : [];

  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Recommendations</h1>

      {/* Main category cards */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
        {mainRecommendations.map((rec) => (
          <div
            key={rec._id}
            onClick={() => {
              setSelectedMain(rec);
              setFilters({});
            }}
            style={{
              flex: "0 0 180px",
              cursor: "pointer",
              padding: "15px",
              border: "1px solid #ccc",
              borderRadius: "10px",
              textAlign: "center",
              marginBottom: "10px",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ fontSize: "40px" }}>{rec.img}</div>
            <h3>{rec.name}</h3>
            <p style={{ fontSize: "14px", color: "#555" }}>{rec.desc}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      {selectedMain && categoryFilters[selectedMain._id] && (
        <div style={{ marginTop: "30px", marginBottom: "20px", display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
          {categoryFilters[selectedMain._id].map((filterKey) => (
            <div key={filterKey} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <label style={{ fontWeight: "bold", marginBottom: "5px" }}>
                {filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}
              </label>
              <select
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  minWidth: "120px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
                onChange={(e) => handleFilterChange(filterKey, e.target.value)}
                value={filters[filterKey] || "all"}
              >
                {filterOptions[filterKey].map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      {/* Active filter tags */}
      {selectedMain && Object.entries(filters).some(([key, value]) => value !== "all") && (
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
          {Object.entries(filters).map(([key, value]) =>
            value !== "all" ? (
              <div
                key={key}
                style={{
                  background: tagColors[key] || "#ddd",
                  color: "#fff",
                  padding: "5px 12px",
                  borderRadius: "20px",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                <span>{`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`}</span>
                <button
                  onClick={() => removeFilter(key)}
                  style={{
                    marginLeft: "8px",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  ×
                </button>
              </div>
            ) : null
          )}
        </div>
      )}

      {/* Sub-items */}
      {selectedMain && (
        <div style={{ marginTop: "20px", width: "80%" }}>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>{selectedMain.name}</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
            {filteredSubs.length > 0 ? (
              filteredSubs.map((sub, index) => (
                <div
                  key={index}
                  style={{
                    flex: "0 0 180px",
                    padding: "15px",
                    border: "1px solid #ccc",
                    borderRadius: "10px",
                    textAlign: "center",
                    background: "#fafafa",
                  }}
                >
                  <h4>{sub.name}</h4>
                  <p style={{ fontSize: "14px", color: "#555" }}>{sub.desc}</p>
                </div>
              ))
            ) : (
              <p>No items match your filters.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationPage;
