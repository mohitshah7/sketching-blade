import React from "react";
import "../styles/Contact.css";
import { FaInstagram, FaTwitter, FaYoutube, FaEnvelope } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="contact-container">
      {/* Image Section */}
      <div className="contact-image">
        <img
          src="/assets/contact.jpg" // place your image inside public/contact/profile.jpg
          alt="Sketching Blade"
        />
      </div>

      {/* Contact Info */}
      <div className="contact-info">
         <h2 className="footer-title">Get in Touch</h2>
      <p className="footer-text">
        For commissions, queries or feedback — feel free to reach out:
      </p>
        <a
          href="mailto:sketchingblade@gmail.com"
          className="contact-button"
        >
          <FaEnvelope className="icon" /> Email Me
        </a>

        <div className="social-links">
          <a
            href="https://www.instagram.com/sketchingblade.art?igsh=dHJ6NnV3cWcwMWVq"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram className="social-icon" />
          </a>
          <a
            href="https://x.com/sketching_blade?t=i0U5kp0Nfaad7UXJUdN9-g&s=08"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter className="social-icon" />
          </a>
          <a
            href="https://youtube.com/@sketchingblade1513?si=3RWE9GEAL93LYkYk"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaYoutube className="social-icon" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
