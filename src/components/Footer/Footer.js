import React from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footerInner">

        {/* Top Section */}
        <div className="footerTop">
          {/* Contact Info */}
          <div className="footerContact">
            <h4>Contact Us</h4>
            <p>📍 Ethiopia, Addis Ababa</p>
            <p>✉️ <a href="mailto:info@tradethiopiaonline.com">info@tradethiopiaonline.com</a></p>
            <p>📞 <a href="tel:+251111234567">+251 11 123 4567</a></p>
          </div>

          {/* Social Media Links */}
          <div className="footerSocial">
            <h4>Follow Us</h4>
            <div className="socialIcons">
              <a href="https://facebook.com/tradethiopiaonline" target="_blank" rel="noopener noreferrer">
                <FaFacebook />
              </a>
              <a href="https://twitter.com/tradethiopiaonline" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </a>
              <a href="https://linkedin.com/company/tradethiopiaonline" target="_blank" rel="noopener noreferrer">
                <FaLinkedin />
              </a>
              <a href="https://instagram.com/tradethiopiaonline" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footerBottom">
          <p>© 2026 TradeEthiopia Online. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}
