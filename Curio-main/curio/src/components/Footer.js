import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaPinterest, FaArrowUp } from "react-icons/fa";
import "../styles/Footer.css";

const Footer = () => {
  // Scroll-to-top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <footer>
        <div className="footer-container">
          {/* Left: Brand */}
          <div className="footer-col brand">
            <h2>Curio</h2>
            <p>
              At Curio, we believe fashion is about expressing yourself. From face
              shapes to body types, we guide you with insights and recommendations
              so you can feel amazing in every outfit.
            </p>
          </div>

          {/* Middle: Links */}
          <div className="footer-col links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/#home">Home</a></li>
              <li><a href="/#styles">Styles</a></li>
              <li><a href="/#analysis">Analysis</a></li>
              <li><a href="/#recommendations">Recommendations</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/login">Login</a></li>
            </ul>
          </div>

          {/* Right: Social Media */}
          <div className="footer-col social">
            <h4>Connect with Us</h4>
            <div className="social-icons">
              <a href="https://www.facebook.com" target="_blank" rel="noreferrer">
                <FaFacebookF /> Facebook
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
                <FaInstagram /> Instagram
              </a>
              <a href="https://www.twitter.com" target="_blank" rel="noreferrer">
                <FaTwitter /> Twitter
              </a>
              <a href="https://www.youtube.com" target="_blank" rel="noreferrer">
                <FaYoutube /> YouTube
              </a>
              <a href="https://www.pinterest.com" target="_blank" rel="noreferrer">
                <FaPinterest /> Pinterest
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p>© 2025 Curio. All Rights Reserved.</p>
        </div>
      </footer>

      {/* Back to Top Button */}
      <button id="backToTopBtn" title="Go to top" onClick={scrollToTop}>
        <FaArrowUp />
      </button>
    </>
  );
};

export default Footer;
