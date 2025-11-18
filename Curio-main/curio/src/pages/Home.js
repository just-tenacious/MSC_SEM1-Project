// src/pages/Home.jsx
import React from "react";
import HeroSection from "../components/sections/Hero";
import StyleSection from "../components/sections/StylesSection";
import AnalysisSection from "../components/sections/Analysis";
import RecommendationsSection from "../components/sections/Recommendations";

const Home = ({ heroRef, styleRef, analysisRef, recommendationsRef }) => {
  return (
    <>
      <HeroSection ref={heroRef} />
      <StyleSection ref={styleRef} />
      <AnalysisSection ref={analysisRef} />
      <RecommendationsSection ref={recommendationsRef} />
    </>
  );
};

export default Home;
