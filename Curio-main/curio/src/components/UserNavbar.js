import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/UserNavbar.css";

const UserNavbar = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "U";
  const profilePic = localStorage.getItem("profilePic");
  const isAdmin = Number(localStorage.getItem("is_admin")); // 2 = admin

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("profilePic");
    localStorage.removeItem("is_admin");
    navigate("/login");
  };

  return (
    <nav className="user-navbar">
      {/* Left - Logo */}
      <div className="nav-left">
        <h2 className="logo">Curio</h2>
      </div>

      {/* Middle - Links */}
      <div className="nav-center">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/user-styles">Styles</Link>
        <Link to="/analysis">Analysis</Link>
        <Link to="/recommendations">Recommendation</Link>
        <Link to="/review">Review</Link>

        {/* Admin Mode button */}
        {isAdmin === 2 && (
          <button
            className="admin-btn"
            onClick={() => navigate("/admin-dashboard")}
          >
            Admin Mode
          </button>
        )}
      </div>

      {/* Right - Profile */}
      <div className="nav-right">
        {profilePic ? (
          <img src={profilePic} alt="profile" className="profile-pic" />
        ) : (
          <div className="nav-profile-initial">
            {username.charAt(0).toUpperCase()}
          </div>
        )}
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default UserNavbar;
