import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "../components/AdminNavbar";
import "../styles/AdminDashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faUserShield,
  faFaceSmile,
  faChild,
  faRuler,
  faClipboard,
  faTachometerAlt,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

const AdminDashboard = () => {
  const [counts, setCounts] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3001/admin-counts", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.status === "ok") {
          setCounts(res.data.counts);
        }
      } catch (error) {
        console.error("❌ Failed to fetch admin counts:", error);
      }
    };

    fetchCounts();
  }, []);

  const cards = [
    { title: "Dashboard", icon: faTachometerAlt, className: "dashboard" },
    { title: "Users", count: counts.users || 0, icon: faUsers, className: "users" },
    { title: "Blocked Users", count: counts.blockedUsers || 0, icon: faUsers, className: "blockedUsers" },
    { title: "Admins", count: counts.admins || 0, icon: faUserShield, className: "admins" },
    { title: "Admin Requests", count: counts.adminRequests || 0, icon: faUserShield, className: "adminRequests" },
    { title: "Face View", count: counts.faceView || 0, icon: faFaceSmile, className: "faceView" },
    { title: "Body View", count: counts.bodyView || 0, icon: faChild, className: "bodyView" },
    { title: "Height/Build", count: counts.heightBuild || 0, icon: faRuler, className: "heightBuild" },
    { title: "Recommendations", count: counts.recommendations || 0, icon: faClipboard, className: "recommendations" },
    { title: "Contact", count: counts.contact || 0, icon: faEnvelope, className: "contact" },
  ];

  return (
    <div className="admin-dashboard">
      <AdminNavbar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div
        className="admin-main"
        style={{
          marginLeft: sidebarOpen ? "220px" : "60px",
          transition: "margin-left 0.3s ease",
        }}
      >
        <div className="dashboard-cards">
          {cards.map((card, idx) => (
            <div key={idx} className={`card ${card.className}`}>
              <FontAwesomeIcon icon={card.icon} size="2x" style={{ marginBottom: "8px" }} />
              <h3>{card.title}</h3>
              {card.count !== undefined && <p>{card.count}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
