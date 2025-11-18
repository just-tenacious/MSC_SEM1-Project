import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminUsers = ({ type }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ fullname: "", username: "", email: "" });

  const rowsPerPage = 5;

  const statusMap = {
    all: null,
    active: 1,
    blocked: 2,
    unverified: 0,
  };

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const status = statusMap[type];
        const query = status !== null ? `?acc_status=${status}` : "";
        const res = await axios.get(`http://localhost:3001/users${query}`);
        setUsers(res.data);
      } catch (err) {
        console.error("❌ Error fetching users:", err);
      }
    };
    fetchUsers();
  }, [type]);

  // Update user status (block/unblock or admin approve/reject)
  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.post("http://localhost:3001/users/update-status", { _id: id, status: newStatus });
      setUsers(prev =>
        prev.map(u => (u._id === id ? { ...u, acc_status: newStatus } : u))
      );
    } catch (err) {
      console.error("❌ Error updating status:", err);
    }
  };

  // Delete user or reject admin request
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await axios.post("http://localhost:3001/users/delete", { _id: id });
      alert(res.data.message || "User deleted successfully");
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (err) {
      console.error("❌ Error deleting user:", err);
    }
  };

  // Edit user
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ fullname: user.fullname, username: user.username, email: user.email });
  };

  const handleSaveEdit = async () => {
    try {
      await axios.post("http://localhost:3001/users/update-profile", {
        _id: editingUser._id,
        ...formData,
      });
      setUsers(prev =>
        prev.map(u => (u._id === editingUser._id ? { ...u, ...formData } : u))
      );
      setEditingUser(null);
    } catch (err) {
      console.error("❌ Error saving user:", err);
    }
  };

  // Filter and paginate
  const filteredUsers = users.filter(u =>
    [u.fullname, u.username, u.email].some(field =>
      field.toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
  const displayedRows = filteredUsers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div style={{ padding: "20px", marginLeft: "120px" }}>
      <h2>
        {type === "blocked" ? "Blocked Users" :
         type === "active" ? "Active Users" :
         type === "unverified" ? "Unverified Users" : "All Users"}
      </h2>

      <input
        type="text"
        placeholder="Search by name, username, or email"
        value={search}
        onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
        style={inputStyle}
      />

      <table style={tableStyle}>
        <thead style={theadStyle}>
          <tr>
            <th style={thStyle}>#</th>
            <th style={thStyle}>Fullname</th>
            <th style={thStyle}>Username</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Created At</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayedRows.length ? (
            displayedRows.map((u, idx) => (
              <tr key={u._id} style={trStyle}>
                <td style={tdStyle}>{idx + 1}</td>
                <td style={tdStyle}>{u.fullname}</td>
                <td style={tdStyle}>{u.username}</td>
                <td style={tdStyle}>{u.email}</td>
                <td style={tdStyle}>{new Date(u.createdAt).toLocaleString()}</td>
                <td style={tdStyle}>
                  <button
                    style={u.acc_status === 2 ? unblockBtn : blockBtn}
                    onClick={() => handleStatusChange(u._id, u.acc_status === 2 ? 1 : 2)}
                  >
                    {u.acc_status === 2 ? "Unblock" : "Block"}
                  </button>
                  <button style={editBtn} onClick={() => handleEdit(u)}>Edit</button>
                  <button style={deleteBtn} onClick={() => handleDelete(u._id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "10px" }}>
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              style={{ ...pageBtn, backgroundColor: p === currentPage ? "#4e73df" : "#eee", color: p === currentPage ? "#fff" : "#000" }}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {editingUser && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3>Edit User</h3>
            {["fullname", "username", "email"].map(field => (
              <input
                key={field}
                type={field === "email" ? "email" : "text"}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={formData[field]}
                onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                style={inputStyle}
              />
            ))}
            <div>
              <button style={saveBtn} onClick={handleSaveEdit}>Save</button>
              <button style={cancelBtn} onClick={() => setEditingUser(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles (unchanged)
const inputStyle = { marginBottom: "10px", padding: "8px", width: "250px" };
const tableStyle = { width: "100%", borderCollapse: "collapse", marginBottom: "15px" };
const theadStyle = { backgroundColor: "#4e73df", color: "#fff" };
const thStyle = { padding: "10px", textAlign: "left" };
const tdStyle = { padding: "8px", borderBottom: "1px solid #ddd" };
const trStyle = { transition: "background 0.3s" };
const blockBtn = { padding: "4px 8px", marginRight: "5px", background: "#dc3545", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" };
const unblockBtn = { padding: "4px 8px", marginRight: "5px", background: "#28a745", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" };
const editBtn = { padding: "4px 8px", marginRight: "5px", background: "#ffc107", color: "#000", border: "none", borderRadius: "4px", cursor: "pointer" };
const deleteBtn = { padding: "4px 8px", background: "#6c757d", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" };
const pageBtn = { marginRight: "5px", padding: "5px 10px", border: "none", borderRadius: "4px", cursor: "pointer" };
const modalOverlay = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" };
const modalBox = { background: "#fff", padding: "20px", borderRadius: "8px", width: "300px", boxShadow: "0 0 10px rgba(0,0,0,0.2)" };
const saveBtn = { ...unblockBtn, marginRight: "5px", background: "#28a745" };
const cancelBtn = { ...deleteBtn, background: "#6c757d" };

export default AdminUsers;
