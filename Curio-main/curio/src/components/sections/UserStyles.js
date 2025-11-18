import React, { forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import "../sections/Styles.css";

const UserStyles = forwardRef((props, ref) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const styleCards = [
    {
      title: "Face Shapes",
      desc: "Identify your face shape and find hairstyles and makeup tips that enhance your features.",
      iconClass: "fas fa-user-circle style-icon face-icon",
      path: "/user-face-style"
    },
    {
      title: "Body Types",
      desc: "Learn how to choose clothing that complements your body type and accentuates your best features.",
      iconClass: "fas fa-child style-icon body-icon",
      path: "/user-body-style"
    },
    {
      title: "Clothing Styles",
      desc: "Explore trending outfits, colors, and patterns to elevate your wardrobe and personal style.",
      iconClass: "fas fa-tshirt style-icon fashion-icon",
      path: "/user-clothing-style"
    }
  ];
  return (
    <section className="section" id="styles" ref={ref}>
      <h3>Explore Your Style</h3>
      <p>Discover different fashion styles tailored to your face shape, body type, and personal preferences.</p>

      <div className="styles-container scroll-animate">
        {styleCards.map((card, index) => (
          <div key={index} className="style-card" onClick={() => handleNavigation(card.path)}>
            <div className="icon-wrapper">
              <i className={card.iconClass}></i>
            </div>
            <h4>{card.title}</h4>
            <p>{card.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
});

export default UserStyles;
