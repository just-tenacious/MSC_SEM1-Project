import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faUsers,
  faUserShield,
  faFileAlt,
  faFaceSmile,
  faChild,
  faRuler,
  faClipboard,
  faInfoCircle,
  faUserCircle,
  faSignOutAlt,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/AdminNavbar.css";

const AdminNavbar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem("username") || "Admin";
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const sidebarRef = useRef(null);

  // ✅ Close submenu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setOpenSubmenu(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSwitchMode = () => {
    localStorage.setItem("mode", "user");
    navigate("/dashboard");
  };

  const toggleSubmenu = (key) => {
    setOpenSubmenu(openSubmenu === key ? null : key);
  };

  const isActive = (path) => location.pathname === path;

  const Submenu = ({ title, icon, keyName, links }) => (
    <li
      className={`has-submenu ${openSubmenu === keyName ? "open" : ""}`}
      onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
    >
      <div className="submenu-title" onClick={() => toggleSubmenu(keyName)}>
        <FontAwesomeIcon icon={icon} />
        {isOpen && <span>{title}</span>}
        {isOpen && (
          <FontAwesomeIcon
            icon={faChevronDown}
            className={`chevron ${openSubmenu === keyName ? "rotate" : ""}`}
          />
        )}
      </div>
      {openSubmenu === keyName && (
        <ul
          className="popup-submenu"
          onClick={() => setOpenSubmenu(null)} // closes submenu when clicking any submenu item
        >
          {links.map((link) => (
            <li key={link.path} className={isActive(link.path) ? "active" : ""}>
              <Link to={link.path}>
                <FontAwesomeIcon icon={link.icon} /> {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );

  return (
    <div
      className={`admin-sidebar ${isOpen ? "open" : "collapsed"}`}
      ref={sidebarRef}
    >
      <div className="sidebar-header">
        {isOpen && <h2>Admin Panel</h2>}
        <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>
      </div>

      <ul>
        {/* Dashboard */}
        <li className={isActive("/admin-dashboard") ? "active" : ""}>
          <Link to="/admin-dashboard">
            <FontAwesomeIcon icon={faTachometerAlt} />
            {isOpen && <span>Dashboard</span>}
          </Link>
        </li>

        {/* Manage Users */}
        <Submenu
          title="Manage Users"
          icon={faUsers}
          keyName="users"
          links={[
            { path: "/admin-users/sub-user", label: "Users", icon: faUserCircle },
            { path: "/admin-users/blocked", label: "Blocked Users", icon: faUserCircle },
            { path: "/admin-users/unverified", label: "Unverified Users", icon: faUserCircle },
          ]}
        />

        {/* Manage Admins */}
        <Submenu
          title="Manage Admins"
          icon={faUserShield}
          keyName="admins"
          links={[
            { path: "/admin-ask-request", label: "Request Admins", icon: faUserShield },
            { path: "/admin-users/admin", label: "Approved Admins", icon: faUserShield },
            { path: "/admin-requests", label: "Admin Requests", icon: faUserShield },
          ]}
        />

        {/* Information */}
        <Submenu
          title="Information"
          icon={faInfoCircle}
          keyName="info"
          links={[
            { path: "/face-view", label: "Face View", icon: faFaceSmile },
            { path: "/body-view", label: "Body View", icon: faChild },
            { path: "/height-build-view", label: "Height/Build", icon: faRuler },
          ]}
        />

        {/* Recommendation */}
        <Submenu
          title="Recommendation"
          icon={faClipboard}
          keyName="rec"
          links={[
            { path: "/admin-recommendations", label: "Master", icon: faClipboard },
            { path: "/admin-recommendations/detail", label: "Detail", icon: faClipboard },
          ]}
        />

        {/* Reports */}
        <li className={isActive("/reports") ? "active" : ""}>
          <Link to="/reports">
            <FontAwesomeIcon icon={faFileAlt} />
            {isOpen && <span>Reports</span>}
          </Link>
        </li>

        {/* Contact */}
        <li className={isActive("/admin-contact") ? "active" : ""}>
          <Link to="/admin-contact">
            <FontAwesomeIcon icon={faFileAlt} />
            {isOpen && <span>Contact</span>}
          </Link>
        </li>

        {/* Profile */}
        <li className={isActive("/profile") ? "active" : ""}>
          <Link to="/profile">
            <FontAwesomeIcon icon={faUserCircle} />
            {isOpen && <span>Profile</span>}
          </Link>
        </li>

        {/* Switch to User Mode */}
        <li>
          <button className="logout-btn" onClick={handleSwitchMode}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            {isOpen && <span>Switch to User Mode ({username})</span>}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default AdminNavbar;