import React, { forwardRef } from "react"; // <-- Import forwardRef
import { useNavigate } from "react-router-dom";
import "./Analysis.css";

const analysisData = [
  {
    type: "face",
    title: "Face Shape Analysis",
    desc: "Identify your face shape using our interactive tool. Get personalized hairstyle, makeup, and accessory recommendations.",
    iconClass: "fas fa-user-circle",
    exampleImg: "/assets/analysis/face_analysis.webp",
    btnText: "Analyze Face",
  },
  {
    type: "body",
    title: "Body Type Analysis",
    desc: "Understand your body shape and proportions. Learn which clothing cuts and patterns highlight your best attributes.",
    iconClass: "fas fa-child",
    exampleImg: "/assets/analysis/body_analysis.webp",
    btnText: "Analyze Body",
  },
  {
    type: "clothing",
    title: "Style Preference Analysis",
    desc: "Discover your preferred fashion style. Our tool evaluates your color, pattern, and clothing preferences for a tailored style profile.",
    iconClass: "fas fa-tshirt",
    exampleImg: null, // handled in detail
    btnText: "Analyze Style",
  },
];

const AnalysisSection = forwardRef((props, ref) => { // now works correctly
  const navigate = useNavigate();

  const handleClick = (type) => {
    navigate(`/analysis-detail?type=${type}`);
  };

  return (
    <section className="section" id="analysis" ref={ref}>
      <h3>Analysis</h3>
      <p>
        Use our tools to understand your unique features and discover the styles that suit you best.
      </p>

      <div className="analysis-container scroll-animate">
        {analysisData.map((item, idx) => (
          <div className="analysis-card" key={idx}>
            <div className="icon-wrapper">
              <i className={item.iconClass}></i>
            </div>
            <h4>{item.title}</h4>
            <p>{item.desc}</p>
            <button className="btn-small" onClick={() => handleClick(item.type)}>
              {item.btnText}
            </button>
          </div>
        ))}
      </div>

      <p className="analysis-note">
        Tip: Combining your face, body, and style analyses provides a full fashion profile for optimal outfit recommendations.
      </p>
    </section>
  );
});

export default AnalysisSection;
