import React, { useRef, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";
import Home from "../pages/Home";

const Layout = () => {
  const location = useLocation();

  const heroRef = useRef(null);
  const styleRef = useRef(null);
  const analysisRef = useRef(null);
  const recommendationsRef = useRef(null);

  const scrollWithOffset = (ref, offset = 80) => {
    if (ref?.current) {
      const elementPosition = ref.current.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementPosition - offset, behavior: "smooth" });
    }
  };

  const isHome = location.pathname === "/";

  // Scroll to section if coming from another page
  useEffect(() => {
    if (location.state?.scrollTo && isHome) {
      const map = {
        hero: heroRef,
        style: styleRef,
        analysis: analysisRef,
        recommendations: recommendationsRef,
      };
      const ref = map[location.state.scrollTo];
      scrollWithOffset(ref, 80);
    }
  }, [location.state, isHome]);

  return (
    <div className="app-container">
      <Navbar
        scrollToHero={() => scrollWithOffset(heroRef,40)}
        scrollToStyle={() => scrollWithOffset(styleRef, 10)}
        scrollToAnalysis={() => scrollWithOffset(analysisRef, 10)}
        scrollToRecommendations={() => scrollWithOffset(recommendationsRef, 10)}
      />

      <main className="content">
        {isHome ? (
          <Home
            heroRef={heroRef}
            styleRef={styleRef}
            analysisRef={analysisRef}
            recommendationsRef={recommendationsRef}
          />
        ) : (
          <Outlet />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
