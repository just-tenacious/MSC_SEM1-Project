import React, { forwardRef, useEffect, useState } from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import "./Recommendation.css";

const NextArrow = ({ onClick }) => (
  <div className="custom-arrow custom-next" onClick={onClick}>
    ▶
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div className="custom-arrow custom-prev" onClick={onClick}>
    ◀
  </div>
);

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 600,
  slidesToShow: 3,
  slidesToScroll: 1,
  centerMode: true,
  centerPadding: "60px",
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 2, centerPadding: "40px" } },
    { breakpoint: 600, settings: { slidesToShow: 1, centerPadding: "20px" } },
  ],
};

const RecommendationsSection = forwardRef((props, ref) => {
  const [recommendations, setRecommendations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3001/recommendations") // call backend API
      .then((res) => res.json())
      .then((data) => setRecommendations(data))
      .catch((err) => console.error("Failed to fetch recommendations:", err));
  }, []);

  const handleExploreClick = () => {
    navigate("/login"); // navigate to login page
  };

  return (
    <section className="recommendations" id="recommendations" ref={ref}>
      <div className="section-content">
        <h2>Personalized Recommendations</h2>
        <p>Style tips, outfit ideas, and curated product recommendations just for you.</p>
      </div>

      <div className="recs-slider-wrap">
        <Slider {...sliderSettings}>
          {recommendations.map((item) => (
            <div key={item._id} className="mag-card">
              <div className="mag-cover">{item.icon}</div>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
              <button className="btn-explore" onClick={handleExploreClick}>Explore</button>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
});

export default RecommendationsSection;
