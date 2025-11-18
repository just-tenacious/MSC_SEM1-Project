// import React from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import "../styles/Navbar.css";

// const Navbar = ({ scrollToHero, scrollToStyle, scrollToAnalysis, scrollToRecommendations }) => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const handleClick = (scrollFunc, sectionName) => {
//     if (location.pathname !== "/") {
//       // Navigate to home and pass state for scrolling
//       navigate("/", { state: { scrollTo: sectionName } });
//     } else {
//       scrollFunc();
//     }
//   };

//   return (
//     <header>
//       <div className="navbar">
//         <div className="logo">
//           <img src="/logo.jpg" alt="Curio Logo" className="logo-img" />
//           <span>Curio</span>
//         </div>

//         <nav className="nav-links">
//           <span onClick={() => handleClick(scrollToHero, "hero")}>Home</span>
//           <span onClick={() => handleClick(scrollToStyle, "style")}>Styles</span>
//           <span onClick={() => handleClick(scrollToAnalysis, "analysis")}>Analysis</span>
//           <span onClick={() => handleClick(scrollToRecommendations, "recommendations")}>Recommendations</span>
//           <Link to="/contact">Contact</Link>
//         </nav>

//         <div className="login-btn">
//           <Link to="/login" className="btn-login">Login</Link>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Navbar;

import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = ({
  scrollToHero,
  scrollToStyle,
  scrollToAnalysis,
  scrollToRecommendations,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (scrollFunc, sectionName) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: sectionName } });
    } else {
      scrollFunc();
    }
  };

  const handleTopNavigation = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header>
      <div className="navbar">
        <div className="logo">
          <img src="/logo.jpg" alt="Curio Logo" className="logo-img" />
          <span>Curio</span>
        </div>

        <nav className="nav-links">
          <span onClick={() => handleClick(scrollToHero, "hero")}>Home</span>
          <span onClick={() => handleClick(scrollToStyle, "style")}>
            Styles
          </span>
          <span onClick={() => handleClick(scrollToAnalysis, "analysis")}>
            Analysis
          </span>
          <span
            onClick={() =>
              handleClick(scrollToRecommendations, "recommendations")
            }
          >
            Recommendations
          </span>
          <span onClick={() => handleTopNavigation("/contact")}>Contact</span>
        </nav>

        <div className="login-btn">
          <span
            onClick={() => handleTopNavigation("/login")}
            className="btn-login"
            style={{ cursor: "pointer" }}
          >
            Login
          </span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
