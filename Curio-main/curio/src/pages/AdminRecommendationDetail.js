import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminRecommendationDetail = () => {
  const [details, setDetails] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Replace with your API endpoint
        const res = await axios.get("http://localhost:3001/recommendation-details");
        const formatted = res.data.map((item, index) => ({
          id: index + 1,
          _id: item._id,
          masterCategory: item.masterCategory || "N/A",
          subCategory: item.subCategory || "N/A",
          recommendation: item.recommendation || "—",
          createdAt: new Date(item.createdAt).toLocaleString(),
        }));
        setDetails(formatted);
      } catch (err) {
        console.error("Error fetching recommendation details:", err);
      }
    };
    fetchDetails();
  }, []);

  const filtered = details.filter(
    (row) =>
      row.masterCategory.toLowerCase().includes(search.toLowerCase()) ||
      row.subCategory.toLowerCase().includes(search.toLowerCase()) ||
      row.recommendation.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const displayedRows = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div style={{ padding: "20px", marginLeft: "120px" }}>
      <h2>Recommendation Detail</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by category, sub-category, or recommendation"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        style={inputStyle}
      />

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={tableStyle}>
          <thead>
            <tr style={theadStyle}>
              <th style={thStyle}>#</th>
              <th style={thStyle}>Master Category</th>
              <th style={thStyle}>Sub Category</th>
              <th style={thStyle}>Recommendation</th>
              <th style={thStyle}>Created At</th>
            </tr>
          </thead>
          <tbody>
            {displayedRows.length > 0 ? (
              displayedRows.map((row) => (
                <tr key={row._id} style={trStyle}>
                  <td style={tdStyle}>{row.id}</td>
                  <td style={tdStyle}>{row.masterCategory}</td>
                  <td style={tdStyle}>{row.subCategory}</td>
                  <td style={tdStyle}>{row.recommendation}</td>
                  <td style={tdStyle}>{row.createdAt}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "10px" }}>
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              style={{
                ...pageBtn,
                backgroundColor: p === currentPage ? "#4e73df" : "#eee",
                color: p === currentPage ? "#fff" : "#000",
              }}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Styles
const inputStyle = {
  marginBottom: "15px",
  padding: "8px",
  width: "300px",
  border: "1px solid #ccc",
  borderRadius: "4px",
};
const tableStyle = { width: "100%", borderCollapse: "collapse", minWidth: "600px" };
const theadStyle = { backgroundColor: "#4e73df", color: "#fff" };
const thStyle = { padding: "10px", textAlign: "left" };
const tdStyle = { padding: "8px", borderBottom: "1px solid #ddd" };
const trStyle = { transition: "background 0.3s" };
const pageBtn = { marginRight: "5px", padding: "5px 10px", border: "none", borderRadius: "4px", cursor: "pointer" };

export default AdminRecommendationDetail;