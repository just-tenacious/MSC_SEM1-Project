import React, { useState, useEffect } from "react";

const AdminHeightBuild = () => {
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Fetch data from backend
  useEffect(() => {
    const fetchHeightBuild = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/height-build"); // adjust endpoint
        if (!response.ok) throw new Error("Failed to fetch height-build data");
        const data = await response.json();
        setEntries(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchHeightBuild();
  }, []);

  const filtered = entries.filter(
    (entry) =>
      entry.userName?.toLowerCase().includes(search.toLowerCase()) ||
      entry.gender?.toLowerCase().includes(search.toLowerCase()) ||
      entry.footSize?.toString().includes(search) ||
      entry.height?.toString().includes(search) ||
      entry.weight?.toString().includes(search) ||
      entry.frame?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const displayedRows = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div style={{ padding: "20px", marginLeft: "120px" }}>
      <h2>User Body Frame Entries</h2>

      <input
        type="text"
        placeholder="Search by name, gender, foot size, height, weight, or frame"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        style={{
          marginBottom: "15px",
          padding: "8px",
          width: "400px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />

      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "15px" }}>
        <thead>
          <tr style={{ backgroundColor: "#4e73df", color: "#fff" }}>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Gender</th>
            <th style={thStyle}>Foot Size (cm)</th>
            <th style={thStyle}>Height (cm)</th>
            <th style={thStyle}>Weight (kg)</th>
            <th style={thStyle}>Frame</th>
          </tr>
        </thead>
        <tbody>
          {displayedRows.length > 0 ? (
            displayedRows.map((entry, idx) => (
              <tr key={entry._id} style={trStyle}>
                <td style={tdStyle}>{idx + 1 + (currentPage - 1) * rowsPerPage}</td>
                <td style={tdStyle}>{entry.userName}</td>
                <td style={tdStyle}>{entry.gender}</td>
                <td style={tdStyle}>{entry.footSize}</td>
                <td style={tdStyle}>{entry.height}</td>
                <td style={tdStyle}>{entry.weight}</td>
                <td style={tdStyle}>{entry.frame}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", padding: "10px" }}>
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              style={{
                marginRight: "5px",
                padding: "5px 10px",
                backgroundColor: p === currentPage ? "#4e73df" : "#eee",
                color: p === currentPage ? "#fff" : "#000",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
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
const thStyle = { padding: "10px", textAlign: "left" };
const tdStyle = { padding: "8px", borderBottom: "1px solid #ddd" };
const trStyle = { transition: "background 0.3s" };

export default AdminHeightBuild;
