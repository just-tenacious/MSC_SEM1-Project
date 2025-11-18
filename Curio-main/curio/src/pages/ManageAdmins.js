import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageAdmins = ({ type }) => {
  const [admins, setAdmins] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  const rowsPerPage = 5;

  const typeToFilter = {
    "ask-requests": { is_admin: 0, acc_status: 1 },
    requests: { is_admin: 1, acc_status: 1 },
    approved: { is_admin: 2, acc_status: 1 },
  };

  // Helper: update is_admin only
  const updateAdminStatus = async (_id, is_admin) => {
    await axios.post("http://localhost:3001/users/update-admin", {
      _id,
      is_admin,
    });
  };

  // Fetch admins
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        const filters = typeToFilter[type] || {};
        const query = new URLSearchParams(filters).toString();
        const res = await axios.get(`http://localhost:3001/users?${query}`);
        setAdmins(res.data || []);
      } catch (err) {
        console.error("❌ Error fetching admins:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, [type]);

  // Approve/Reject admin requests
  const handleRequestAction = async (id, action) => {
    try {
      let is_admin = 0;
      if (type === "ask-requests") is_admin = action === "approve" ? 1 : 0;
      if (type === "requests") is_admin = action === "approve" ? 2 : 0;

      await updateAdminStatus(id, is_admin);
      setAdmins((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error("❌ Error updating admin request:", err);
    }
  };

  // Edit admin
  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setFormData({
      fullname: admin.fullname,
      username: admin.username,
      email: admin.email,
    });
  };

  const handleSaveEdit = async () => {
    try {
      await axios.post("http://localhost:3001/update-profile", {
        _id: editingAdmin._id,
        ...formData,
      });
      setAdmins((prev) =>
        prev.map((a) => (a._id === editingAdmin._id ? { ...a, ...formData } : a))
      );
      setEditingAdmin(null);
    } catch (err) {
      console.error("❌ Error saving admin:", err);
    }
  };

  // Remove admin (set is_admin = 0)
  const handleRemove = async (id) => {
    if (!window.confirm("Remove this admin?")) return;
    try {
      await updateAdminStatus(id, 0);
      setAdmins((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error("❌ Error removing admin:", err);
    }
  };

  // Search filter
  const filtered = admins.filter(
    (a) =>
      a.fullname.toLowerCase().includes(search.toLowerCase()) ||
      a.username.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const displayedRows = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div style={{ padding: "20px", marginLeft: "120px" }}>
      <h2>
        {type === "ask-requests"
          ? "Ask Admin Requests"
          : type === "requests"
          ? "Admin Approval Requests"
          : "Approved Admins"}
      </h2>

      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        style={inputStyle}
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={tableStyle}>
          <thead style={theadStyle}>
            <tr>
              <th style={thStyle}>SR No</th>
              <th style={thStyle}>Fullname</th>
              <th style={thStyle}>Username</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Created At</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedRows.length ? (
              displayedRows.map((a, index) => (
                <tr key={a._id} style={trStyle}>
                  <td style={tdStyle}>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                  <td style={tdStyle}>{a.fullname}</td>
                  <td style={tdStyle}>{a.username}</td>
                  <td style={tdStyle}>{a.email}</td>
                  <td style={tdStyle}>
                    {a.created_at ? new Date(a.created_at).toLocaleString() : "-"}
                  </td>
                  <td style={tdStyle}>
                    {type === "approved" ? (
                      <>
                        <button style={editBtn} onClick={() => handleEdit(a)}>
                          Edit
                        </button>
                        <button style={deleteBtn} onClick={() => handleRemove(a._id)}>
                          Remove
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          style={approveBtn}
                          onClick={() => handleRequestAction(a._id, "approve")}
                        >
                          Approve
                        </button>
                        <button
                          style={rejectBtn}
                          onClick={() => handleRequestAction(a._id, "reject")}
                        >
                          Reject
                        </button>
                      </>
                    )}
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
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ marginTop: "10px" }}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            style={paginationBtn}
          >
            Prev
          </button>
          <span style={{ margin: "0 10px" }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            style={paginationBtn}
          >
            Next
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {editingAdmin && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3>Edit Admin</h3>
            <input
              type="text"
              placeholder="Fullname"
              value={formData.fullname}
              onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              style={inputStyle}
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={inputStyle}
            />
            <div>
              <button style={approveBtn} onClick={handleSaveEdit}>
                Save
              </button>
              <button style={rejectBtn} onClick={() => setEditingAdmin(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* Styles */
const inputStyle = { marginBottom: "10px", padding: "8px", width: "250px", display: "block" };
const tableStyle = { width: "100%", borderCollapse: "collapse", marginBottom: "15px" };
const theadStyle = { backgroundColor: "#4e73df", color: "#fff" };
const thStyle = { padding: "10px", textAlign: "left" };
const tdStyle = { padding: "8px", borderBottom: "1px solid #ddd" };
const trStyle = { transition: "background 0.3s" };
const approveBtn = { padding: "4px 8px", marginRight: "5px", background: "#28a745", color: "#fff", borderRadius: "4px", border: "none" };
const rejectBtn = { padding: "4px 8px", marginRight: "5px", background: "#dc3545", color: "#fff", borderRadius: "4px", border: "none" };
const editBtn = { padding: "4px 8px", marginRight: "5px", background: "#ffc107", color: "#000", border: "none", borderRadius: "4px" };
const deleteBtn = { padding: "4px 8px", background: "#6c757d", color: "#fff", borderRadius: "4px", border: "none" };
const paginationBtn = { padding: "4px 8px", marginRight: "5px", borderRadius: "4px", border: "1px solid #ccc", cursor: "pointer" };
const modalOverlay = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" };
const modalContent = { background: "#fff", padding: "20px", borderRadius: "8px", width: "300px", textAlign: "center" };

export default ManageAdmins;
