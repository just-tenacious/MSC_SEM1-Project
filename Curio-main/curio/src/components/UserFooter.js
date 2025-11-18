import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaPinterest, FaArrowUp } from "react-icons/fa";
import "../styles/UserFooter.css";

const UserFooter = () => {
  // Scroll-to-top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <footer className="user-footer">
        <div className="user-footer-container">
          {/* Left: Brand */}
          <div className="footer-col brand">
            <h2>Curio</h2>
            <p>
              Explore your personal style! Get tailored recommendations based on your
              face shape, body type, and preferences to make every outfit your best one.
            </p>
          </div>

          {/* Middle: Links */}
          <div className="footer-col links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/dashboard">Dashboard</a></li>
              <li><a href="/styles">Styles</a></li>
              <li><a href="/analysis">Analysis</a></li>
              <li><a href="/recommendation">Recommendations</a></li>
              <li><a href="/review">Review</a></li>
              <li><a href="/login">Logout</a></li>
            </ul>
          </div>

          {/* Right: Social Media */}
          <div className="footer-col social">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a href="https://www.facebook.com" target="_blank" rel="noreferrer"><FaFacebookF /> Facebook</a>
              <a href="https://www.instagram.com" target="_blank" rel="noreferrer"><FaInstagram /> Instagram</a>
              <a href="https://www.twitter.com" target="_blank" rel="noreferrer"><FaTwitter /> Twitter</a>
              <a href="https://www.youtube.com" target="_blank" rel="noreferrer"><FaYoutube /> YouTube</a>
              <a href="https://www.pinterest.com" target="_blank" rel="noreferrer"><FaPinterest /> Pinterest</a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p>© 2025 Curio. All Rights Reserved.</p>
        </div>
      </footer>

      {/* Back to Top Button */}
      <button className="back-to-top" onClick={scrollToTop} title="Back to top">
        <FaArrowUp />
      </button>
    </>
  );
};

export default UserFooter;
