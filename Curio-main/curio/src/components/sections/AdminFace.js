import React, { useState, useEffect } from "react";

const AdminFace = () => {
  const [faceEntries, setFaceEntries] = useState([]); // dynamic data
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Fetch data from backend
  useEffect(() => {
    const fetchFaceShapes = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/face-shape"); // your GET endpoint
        if (!response.ok) throw new Error("Failed to fetch face shapes");
        const data = await response.json();
        setFaceEntries(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFaceShapes();
  }, []);

  // Filtering
  const filtered = faceEntries.filter(
    (entry) =>
      entry.face_shape?.toLowerCase().includes(search.toLowerCase()) ||
      entry.faceLength?.toString().includes(search) ||
      entry.foreheadWidth?.toString().includes(search) ||
      entry.cheekboneWidth?.toString().includes(search) ||
      entry.jawlineWidth?.toString().includes(search)
  );

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const displayedRows = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div style={{ padding: "20px", marginLeft: "120px" }}>
      <h2>Face Shape Entries</h2>

      <input
        type="text"
        placeholder="Search by shape or measurements"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        style={{
          marginBottom: "15px",
          padding: "8px",
          width: "300px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "15px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#4e73df", color: "#fff" }}>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Gender</th>
            <th style={thStyle}>Face Length</th>
            <th style={thStyle}>Forehead Width</th>
            <th style={thStyle}>Cheekbone Width</th>
            <th style={thStyle}>Jawline Width</th>
            <th style={thStyle}>Shape</th>
          </tr>
        </thead>
        <tbody>
          {displayedRows.length > 0 ? (
            displayedRows.map((entry, idx) => (
              <tr key={entry._id} style={trStyle}>
                <td style={tdStyle}>
                  {idx + 1 + (currentPage - 1) * rowsPerPage}
                </td>
                <td style={tdStyle}>{entry.userName}</td>
                <td style={tdStyle}>{entry.gender}</td>
                <td style={tdStyle}>{entry.faceLength}</td>
                <td style={tdStyle}>{entry.foreheadWidth}</td>
                <td style={tdStyle}>{entry.cheekboneWidth}</td>
                <td style={tdStyle}>{entry.jawlineWidth}</td>
                <td style={tdStyle}>{entry.face_shape}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: "center", padding: "10px" }}>
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
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

export default AdminFace;