import React, { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cardData } from "../data/cardData";
import "../styles/MainInfo.css";

const UserMainInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract type from URL and map to cardData keys
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];

  const segmentMap = {
    "user-face-style": "face",
    "user-body-style": "body",
    "user-clothing-style": "clothing"
  };

  const type = segmentMap[lastSegment] || "face"; // default to "face" if not matched

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Filter data according to search
  const filteredData = useMemo(() => {
    const data = cardData[type] || []; // fallback to empty array
    return data.filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, type]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Scroll to top with offset on type change
  useEffect(() => {
    const navbarHeight = 40;
    window.scrollTo({ top: 0, behavior: "auto" });
    setTimeout(() => window.scrollTo({ top: navbarHeight, behavior: "smooth" }), 50);
  }, [type]);

  return (
    <section className="main-info-section">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <i className="fas fa-arrow-left"></i> Back
      </button>

      <h2 id="sectionTitle">
        {type.charAt(0).toUpperCase() + type.slice(1)} Details
      </h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="card-container">
        {currentData.length > 0 ? (
          currentData.map((item, idx) => (
            <div className="card" key={idx}>
              <img src={item.img} alt={item.title} />
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          ))
        ) : (
          <p>No items found.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default UserMainInfo;
