// src/components/UserLayout.jsx
import React from "react";
import UserNavbar from "./UserNavbar";
import { Outlet } from "react-router-dom";
import UserFooter from "./UserFooter";

const UserLayout = ({ children }) => {
  return (
    <>
      <div>
        <UserNavbar />
          <Outlet/>
      </div>
      <UserFooter/>
    </>
    
  );
};

export default UserLayout;
