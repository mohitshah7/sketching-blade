import '../styles/ContactFooter.css';
import { FaInstagram, FaTwitter, FaYoutube, FaEnvelope } from 'react-icons/fa';

function ContactFooter() {
  return (
    <footer className="contact-footer">
      <div className="footer-content">
        <h2 className="footer-title">Get in Touch</h2>
        <p className="footer-text">
          For commissions, queries or feedback — feel free to reach out:
        </p>

        <a
          href="https://mail.google.com/mail/?view=cm&fs=1&to=sketchingblade@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-button"
        >
          <FaEnvelope className="button-icon" /> Email Me
        </a>

        <div className="social-links" aria-label="Social media links">
          <a
            href="https://www.instagram.com/sketchingblade.art?igsh=dHJ6NnV3cWcwMWVq"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon-btn"
            aria-label="Instagram"
            title="Instagram"
          >
            <FaInstagram />
          </a>
          <a
            href="https://x.com/sketching_blade?t=i0U5kp0Nfaad7UXJUdN9-g&s=08"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon-btn"
            aria-label="Twitter / X"
            title="Twitter / X"
          >
            <FaTwitter />
          </a>
          <a
            href="https://youtube.com/@sketchingblade1513?si=3RWE9GEAL93LYkYk"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon-btn"
            aria-label="YouTube"
            title="YouTube"
          >
            <FaYoutube />
          </a>
        </div>

        <p className="footer-copyright">
          © {new Date().getFullYear()} Sketching Blade. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default ContactFooter;
