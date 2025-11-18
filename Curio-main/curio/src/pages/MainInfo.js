import React, { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cardData } from "../data/cardData";
import "../styles/MainInfo.css";

const MainInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract type reliably from URL: /face-style, /body-style, /clothing-style
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];
  const type = lastSegment?.split("-")[0] || "face";

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Filter data according to search
  const filteredData = useMemo(() => {
    return cardData[type].filter(
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
        {currentData.map((item, idx) => (
          <div className="card" key={idx}>
            <img src={item.img} alt={item.title} />
            <h4>{item.title}</h4>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>

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
    </section>
  );
};

export default MainInfo;

