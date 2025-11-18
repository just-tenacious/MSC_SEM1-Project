import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./AnalysisDetail.css";

const clothingOptions = [
  { name: "Casual", male: "/assets/analysis/style_casual_m.webp", female: "/assets/analysis/style_casual_f.jpg" },
  { name: "Formal", male: "/assets/analysis/style_formal_m.webp", female: "/assets/analysis/style_formal_f.webp" },
  { name: "Business Casual", male: "/assets/analysis/style_business_m.webp", female: "/assets/analysis/style_business_f.webp" },
  { name: "Athleisure", male: "/assets/analysis/style_athleisure_m.webp", female: "/assets/analysis/style_athleisure_f.webp" },
  { name: "Bohemian", male: "/assets/analysis/style_bohemian_m.jpg", female: "/assets/analysis/style_bohemian_f.webp" },
];

const AnalysisDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const type = params.get("type") || "face";

  const [modal, setModal] = useState({ show: false, img1: "", img2: "" });

  const openModal = (img1, img2 = null) => setModal({ show: true, img1, img2 });
  const closeModal = () => setModal({ show: false, img1: "", img2: "" });

  useEffect(() => {
    window.scrollTo({ top: 100, behavior: "smooth" }); // navbar offset
  }, []);

  const renderContent = () => {
    if (type === "face") {
      return (
        <>
          <p>Measure your face length, width, and jawline. Follow the steps below:</p>
          <ol>
            <li>Stand in front of a mirror and pull your hair back.</li>
            <li>Measure forehead width, cheekbones, jawline, and face length.</li>
            <li>Compare measurements to identify your face shape: Oval, Round, Square, Heart, or Diamond.</li>
          </ol>
          <button className="style-option" onClick={() => openModal("/assets/analysis/face_analysis.webp")}>
            View Face Manual
          </button>
        </>
      );
    } else if (type === "body") {
      return (
        <>
          <p>Measure your shoulders, bust, waist, and hips. Use the steps below:</p>
          <ol>
            <li>Stand straight and measure shoulders, bust, waist, and hips.</li>
            <li>Compare measurements to identify your body type: Apple, Pear, Rectangle, Hourglass, Inverted Triangle.</li>
            <li>Note areas you want to highlight with clothing.</li>
          </ol>
          <button className="style-option" onClick={() => openModal("/assets/analysis/body_analysis.webp")}>
            View Body Manual
          </button>
        </>
      );
    } else if (type === "clothing") {
      return (
        <>
          <p>Choose your preferred style based on body type or occasion:</p>
          {clothingOptions.map((opt, idx) => (
            <button
              key={idx}
              className="style-option"
              onClick={() => openModal(opt.male, opt.female)}
            >
              {opt.name}
            </button>
          ))}
        </>
      );
    }
  };

  return (
    <>
      <section className="detail-section">
        <h2>
          {type === "face"
            ? "Face Shape Analysis Instructions"
            : type === "body"
            ? "Body Type Analysis Instructions"
            : "Style Preference Analysis"}
        </h2>

        {renderContent()}

        <button className="btn-back" onClick={() => navigate(-1)}>Back</button>
      </section>

      {modal.show && (
        <div className="modal-overlay show" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="modal-close" onClick={closeModal}>✖</span>
            <img src={modal.img1} alt="" className="modal-img" />
            {modal.img2 && <img src={modal.img2} alt="" className="modal-img" />}
          </div>
        </div>
      )}
    </>
  );
};

export default AnalysisDetail;
