import React from "react";
import { Link } from "react-router-dom"; 
import './Footer.css'; 

function Footer() {
  return (
    <footer className="app-footer"> {/* Main footer container */}
      <div className="footer-content"> {/* Inner container for layout */}
        <div className="footer-socials">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <i className="fa-brands fa-facebook-f"></i> {/* Use specific icon for solid circle look */}
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <i className="fa-brands fa-instagram"></i>
          </a>
          <a href="https://www.linkedin.com/in/niharika-gangala-4191b035b/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <i className="fa-brands fa-linkedin-in"></i> {/* Use specific icon for solid circle look */}
          </a>
        </div>

        <div className="footer-brand">
          &copy; {new Date().getFullYear()} FinanceFlow Private Limited
        </div>

        <div className="footer-links">
          <Link to="/">Privacy Policy</Link> {/* More descriptive text */}
          <Link to="/">Terms of Service</Link> {/* More descriptive text */}
        </div>
      </div>
    </footer>
  );
}

export default Footer;