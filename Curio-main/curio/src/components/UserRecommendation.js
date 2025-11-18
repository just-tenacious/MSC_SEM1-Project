// UserRecommendation.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserRecommendation.css";

const UserRecommendation = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get("http://localhost:3001/recommendation-master");
        setRecommendations(res.data);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  if (loading) return <p className="loading">Loading recommendations...</p>;

  return (
    <div className="recommendation-page">
      <h2>Main Recommendations</h2>
      <div className="recommendation-grid">
        {recommendations.map((rec) => (
          <div
            key={rec._id}
            className="rec-card"
            onClick={() => navigate(`/recommendation/${encodeURIComponent(rec.name)}`)}
          >
            <div className="rec-card-img">{rec.img || "🎨"}</div>
            <h3>{rec.name}</h3>
            <p>{rec.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserRecommendation;
