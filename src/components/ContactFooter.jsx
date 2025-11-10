import '../styles/ContactFooter.css';
import { FaInstagram, FaTwitter, FaYoutube, FaEnvelope } from "react-icons/fa";


function ContactFooter() {
  return (
    <div className="contact-footer">
      <h2 className="footer-title">Get in Touch</h2>
      <p className="footer-text">
        For commissions, queries or feedback — feel free to reach out:
      </p>
      <a  href="mailto:sketchingblade@gmail.com" className="footer-button">
        Email Me
      </a>

      <div className="social-links">
        <a href="https://www.instagram.com/sketchingblade.art?igsh=dHJ6NnV3cWcwMWVq" target="_blank" rel="noopener noreferrer">Instagram</a>
        <a href="https://x.com/sketching_blade?t=i0U5kp0Nfaad7UXJUdN9-g&s=08" target="_blank" rel="noopener noreferrer">Twitter</a>
        <a href="https://youtube.com/@sketchingblade1513?si=3RWE9GEAL93LYkYk" target="_blank" rel="noopener noreferrer">Youtube</a>
      </div>
    </div>
  );
}

export default ContactFooter;
