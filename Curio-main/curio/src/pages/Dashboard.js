import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileCard from "../components/ProfileCard";
import axios from "axios";
import "../styles/dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
          localStorage.setItem("username", res.data.user.username);
          localStorage.setItem("email", res.data.user.email);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <p className="text-center mt-20 text-gray-500 animate-pulse">
        Loading your dashboard...
      </p>
    );

  if (!user)
    return (
      <p className="text-center mt-20 text-red-500 font-semibold">
        Oops! No user data found. Please log in.
      </p>
    );

  return (
    <div className="dashboard container mx-auto p-6">
      {/* Fun Welcome Banner */}
      <div className="welcome-banner flex flex-col md:flex-row justify-between items-center bg-yellow-100 p-6 rounded-md shadow-md mb-6">
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl font-bold">Hey {user.fullname} 👋</h2>
          <p className="text-gray-800 mt-1">
            Wanna discover your <strong>face vibes</strong>, <strong>body type</strong>, and <strong>height & build</strong>? 🎯  
            Hit the button and let's make some magic happen!
          </p>
        </div>
        <button
          className="btn-analysis bg-purple-500 text-white px-5 py-2 rounded hover:bg-purple-600 transition font-semibold"
          onClick={() => navigate("/analysis", { state: { user } })}
        >
          Let's Analyze!
        </button>
      </div>

      {/* Profile Cards Grid */}
      <div className="profile-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProfileCard user={user} />
      </div>
    </div>
  );
};

export default Dashboard;
