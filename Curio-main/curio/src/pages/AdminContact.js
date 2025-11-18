import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminContact = () => {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const rowsPerPage = 5;

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await axios.get("http://localhost:3001/contact");
        const formatted = res.data.map((item, index) => ({
          id: index + 1,
          _id: item._id,
          name: item.name,
          email: item.email,
          message: item.message,
          createdAt: new Date(item.createdAt).toLocaleString(),
        }));
        setContacts(formatted);
      } catch (err) {
        console.error("Error fetching contacts:", err);
      }
    };

    fetchContacts();
  }, []);

  const filtered = contacts.filter(
    (row) =>
      row.name.toLowerCase().includes(search.toLowerCase()) ||
      row.email.toLowerCase().includes(search.toLowerCase()) ||
      row.message.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const displayedRows = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Handle opening modal
  const handleReplyClick = (contact) => {
    setSelectedContact(contact);
    setShowModal(true);
    setReplyMessage("");
    setSuccessMessage("");
  };

  // Handle sending reply
  const handleSendReply = () => {
    console.log("Replied to:", selectedContact);
    console.log("Reply message:", replyMessage);

    setShowModal(false);
    setSuccessMessage(`Message replied to ${selectedContact.name}! ✅`);

    // Optional: clear success message after a few seconds
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div style={{ padding: "20px", marginLeft: "120px" }}>
      <h2>Contact Messages</h2>

      <input
        type="text"
        placeholder="Search by name, email, or message"
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

      {successMessage && (
        <div
          style={{
            backgroundColor: "#d4edda",
            color: "#155724",
            padding: "10px",
            borderRadius: "4px",
            marginBottom: "15px",
          }}
        >
          {successMessage}
        </div>
      )}

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
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Message</th>
            <th style={thStyle}>Created At</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayedRows.length > 0 ? (
            displayedRows.map((row) => (
              <tr key={row._id} style={trStyle}>
                <td style={tdStyle}>{row.id}</td>
                <td style={tdStyle}>{row.name}</td>
                <td style={tdStyle}>{row.email}</td>
                <td style={tdStyle}>{row.message}</td>
                <td style={tdStyle}>{row.createdAt}</td>
                <td style={tdStyle}>
                  <button
                    style={replyBtn}
                    onClick={() => handleReplyClick(row)}
                  >
                    Reply
                  </button>
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

      {/* Reply Modal */}
      {showModal && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3>
              Reply to <span style={{ color: "#4e73df" }}>{selectedContact.name}</span>
            </h3>
            <p>
              <strong>Email:</strong> {selectedContact.email}
            </p>
            <textarea
              placeholder="Type your reply message..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              rows="4"
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                marginBottom: "10px",
              }}
            ></textarea>
            <div style={{ textAlign: "right" }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  marginRight: "10px",
                  padding: "6px 12px",
                  border: "none",
                  borderRadius: "4px",
                  background: "#ccc",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSendReply}
                style={{
                  padding: "6px 12px",
                  border: "none",
                  borderRadius: "4px",
                  background: "#28a745",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
const thStyle = { padding: "10px", textAlign: "left" };
const tdStyle = { padding: "8px", borderBottom: "1px solid #ddd" };
const trStyle = { transition: "background 0.3s" };
const replyBtn = {
  marginRight: "5px",
  padding: "4px 8px",
  background: "#28a745",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};
const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};
const modalContent = {
  background: "#fff",
  padding: "20px",
  borderRadius: "8px",
  width: "400px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
};

export default AdminContact;
