import React from "react";
import AdminNavbar from "./AdminNavbar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

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
        <Outlet /> {/* Admin pages will render here */}
      </div>
    </div>
  );
};

export default AdminLayout;
