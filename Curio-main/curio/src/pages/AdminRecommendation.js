import React, { useEffect, useState } from "react";
import axios from "axios";

const ICONS = [
  "👗", "👚", "👖", "👕", "👟", "👜", "👒", "👠", "👡", "🧢",
  "🧥", "🩳", "🧤", "🧦", "👢", "🎽", "👔", "🩱", "🩲", "🩴"
];

const AdminRecommendation = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ icon: "", title: "", desc: "" });
  const [showIconPanel, setShowIconPanel] = useState(false);
  const rowsPerPage = 5;

  const fetchRecommendations = async () => {
    try {
      const res = await axios.get("http://localhost:3001/recommendations");
      setRecommendations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(
          `http://localhost:3001/recommendations/${editing}`,
          formData
        );
      } else {
        await axios.post("http://localhost:3001/recommendations", formData);
      }
      setFormData({ icon: "", title: "", desc: "" });
      setEditing(null);
      fetchRecommendations();
      setShowIconPanel(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (_id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await axios.delete(`http://localhost:3001/recommendations/${_id}`);
        fetchRecommendations();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleEdit = (rec) => {
    setEditing(rec._id);
    setFormData({ icon: rec.icon, title: rec.title, desc: rec.desc });
  };

  const filtered = recommendations.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.desc.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const displayedRows = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div style={{ padding: "20px", marginLeft: "120px" }}>
      <h2>Recommendation Master</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by title or description"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        style={inputStyle}
      />

      {/* Add/Edit Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px", position: "relative" }}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <input
            type="text"
            placeholder="Select Icon"
            value={formData.icon}
            readOnly
            onClick={() => setShowIconPanel(!showIconPanel)}
            style={{ ...inputStyle, cursor: "pointer" }}
          />
          {showIconPanel && (
            <div style={iconPanelStyle}>
              {ICONS.map((icon) => (
                <span
                  key={icon}
                  style={iconStyle}
                  onClick={() => {
                    setFormData({ ...formData, icon });
                    setShowIconPanel(false);
                  }}
                >
                  {icon}
                </span>
              ))}
            </div>
          )}
        </div>

        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Description"
          value={formData.desc}
          onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
          required
          style={inputStyle}
        />
        <button type="submit" style={submitBtnStyle}>
          {editing ? "Update" : "Add"}
        </button>
        {editing && (
          <button
            type="button"
            style={{ ...submitBtnStyle, marginLeft: "10px", background: "#888" }}
            onClick={() => {
              setEditing(null);
              setFormData({ icon: "", title: "", desc: "" });
              setShowIconPanel(false);
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={tableStyle}>
          <thead>
            <tr style={theadStyle}>
              <th style={thStyle}>#</th>
              <th style={thStyle}>Icon</th>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedRows.length > 0 ? (
              displayedRows.map((row, idx) => (
                <tr key={row._id} style={trStyle}>
                  <td style={tdStyle}>{idx + 1 + (currentPage - 1) * rowsPerPage}</td>
                  <td style={tdStyle}>{row.icon}</td>
                  <td style={tdStyle}>{row.title}</td>
                  <td style={tdStyle}>{row.desc}</td>
                  <td style={tdStyle}>
                    <button onClick={() => handleEdit(row)} style={actionBtn}>Edit</button>
                    <button onClick={() => handleDelete(row._id)} style={deleteBtn}>Delete</button>
                  </td>
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
        <div style={{ marginTop: "10px" }}>
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
  marginRight: "10px",
  marginBottom: "10px",
  padding: "8px",
  width: "200px",
  border: "1px solid #ccc",
  borderRadius: "4px",
};
const submitBtnStyle = {
  padding: "8px 16px",
  border: "none",
  borderRadius: "4px",
  background: "#4e73df",
  color: "#fff",
  cursor: "pointer",
};
const tableStyle = { width: "100%", borderCollapse: "collapse", minWidth: "600px" };
const theadStyle = { backgroundColor: "#4e73df", color: "#fff" };
const thStyle = { padding: "10px", textAlign: "left" };
const tdStyle = { padding: "8px", borderBottom: "1px solid #ddd" };
const trStyle = { transition: "background 0.3s" };
const pageBtn = { marginRight: "5px", padding: "5px 10px", border: "none", borderRadius: "4px", cursor: "pointer" };
const actionBtn = { padding: "5px 10px", marginRight: "5px", border: "none", borderRadius: "4px", cursor: "pointer", backgroundColor: "#4e73df", color: "#fff" };
const deleteBtn = { ...actionBtn, backgroundColor: "#e74a3b" };

const iconPanelStyle = {
  position: "absolute",
  top: "40px",
  left: "0",
  background: "#fff",
  border: "1px solid #ccc",
  padding: "10px",
  borderRadius: "4px",
  display: "grid",
  gridTemplateColumns: "repeat(5, 40px)",
  gap: "10px",
  zIndex: 10,
};

const iconStyle = {
  fontSize: "24px",
  cursor: "pointer",
  textAlign: "center",
};

export default AdminRecommendation;
