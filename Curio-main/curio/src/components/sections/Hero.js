// components/sections/HeroSection.jsx
import React, { forwardRef } from "react";
import "./Hero.css";

const HeroSection = forwardRef((props, ref) => {
  return (
    <section className="hero" id="hero" ref={ref}>
      <div className="hero-content">
        <h1 className="fade-in-up">Your Style is Your Signature</h1>
        <p className="fade-in-up delay-1">
          Style isn’t luxury — it's identity. Let us help you own yours with
          elegance and clarity.
        </p>
        <a href="#analysis" className="btn pulse delay-2">
          Get Styled
        </a>

        {/* Floating Icons */}
        <div className="floating-icons">
          <i className="fas fa-tshirt float icon1"></i>
          <i className="fas fa-user float icon2"></i>
          <i className="fas fa-hat-cowboy float icon3"></i>
          <i className="fas fa-glasses float icon4"></i>
          <i className="fas fa-ring float icon5"></i>
        </div>
      </div>
    </section>
  );
});

export default HeroSection;
