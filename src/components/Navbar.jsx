import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import logo from "/assets/logo.png"; // ✅ served from public folder

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="Sketching Blade Logo" className="logo-img" />
        </Link>
      </div>

      {/* 🌌 Animated Hamburger */}
      <div
        className={`menu-toggle ${isMenuOpen ? "open" : ""}`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* 🌠 Slide-in Links */}
      <ul className={`nav-links ${isMenuOpen ? "active" : ""}`}>
        <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
        <li><Link to="/artworks" onClick={() => setIsMenuOpen(false)}>Artworks</Link></li>
        <li><Link to="/wallpapers" onClick={() => setIsMenuOpen(false)}>Wallpapers</Link></li>
        <li><Link to="/comics" onClick={() => setIsMenuOpen(false)}>Comics</Link></li>
        <li><Link to="/stories" onClick={() => setIsMenuOpen(false)}>Stories</Link></li>
        <li><Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
      </ul>

      {/* ✨ Optional blur background when menu is open */}
      {isMenuOpen && <div className="menu-backdrop" onClick={() => setIsMenuOpen(false)}></div>}
    </nav>
  );
}

export default Navbar;
