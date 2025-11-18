import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/ProfileCard.css";

const ProfileCard = ({ user: propUser }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(propUser || null);
  const [loading, setLoading] = useState(!propUser);
  const username = user?.username || "U"; // fallback initial
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...user, password: "" });
  const [message, setMessage] = useState("");

  // Fetch user if no propUser
  useEffect(() => {
    if (!propUser) {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      axios
        .get("http://localhost:3001/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.status === "ok") {
            setUser(res.data.user);
            setFormData({ ...res.data.user, password: "" });
            localStorage.setItem("username", res.data.user.username);
            localStorage.setItem("email", res.data.user.email);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [propUser]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3001/update-profile",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status === "ok") {
        setMessage("Profile updated successfully ✅");
        setEditMode(false);
        if (response.data.user) {
          setFormData(response.data.user);
          setUser(response.data.user);
        }
      } else setMessage(response.data.error || "Update failed ❌");
    } catch (err) {
      console.error(err);
      setMessage("Server error ❌");
    }
  };

  if (loading)
    return (
      <p className="text-center mt-20 text-gray-500 animate-pulse">
        Loading profile...
      </p>
    );

  if (!user)
    return (
      <p className="text-center mt-20 text-red-500 font-semibold">
        No user data found. Please log in.
      </p>
    );

  return (
    <div className="profile-card banner-card">
      {/* Header with user initial */}
      <div
        className="profile-header"
        onClick={() => navigate("/dashboard")}
        style={{ cursor: "pointer" }}
      >
        <div className="profile-initial">{username.charAt(0).toUpperCase()}</div>
        <h3>{formData.fullname}</h3>
        <p>@{formData.username}</p>
      </div>

      {/* Display / Edit */}
      {editMode ? (
        <form className="profile-form">
          <div className="form-row">
            <div className="form-field">
              <label>Full Name</label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-field">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>DOB</label>
              <input
                type="date"
                name="dob"
                value={formData.dob || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-field">
              <label>Gender</label>
              <select
                name="gender"
                value={formData.gender || ""}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-row full-width">
            <div className="form-field">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="New password"
              />
            </div>
          </div>
        </form>
      ) : (
        <div className="profile-info horizontal-info">
          <p>
            <strong>Full Name:</strong> {formData.fullname}
          </p>
          <p>
            <strong>Username:</strong> {formData.username}
          </p>
          <p>
            <strong>DOB:</strong> {formData.dob || "Not set"}
          </p>
          <p>
            <strong>Gender:</strong> {formData.gender || "Not set"}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="profile-actions">
        {editMode ? (
          <>
            <button className="btn-save" onClick={handleSave}>
              Save
            </button>
            <button className="btn-cancel" onClick={() => setEditMode(false)}>
              Cancel
            </button>
          </>
        ) : (
          <button className="btn-edit" onClick={() => setEditMode(true)}>
            Edit
          </button>
        )}
      </div>

      {message && (
        <p
          className={`message ${message.includes("❌") ? "error" : "success"}`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default ProfileCard;
