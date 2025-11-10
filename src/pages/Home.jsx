import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  return (
    <div className="home-sections">

      {/* 🔶 Hero Section */}
      <div className="hero-banner">
        <img
          src="/assets/herobanner.jpg"
          alt="Sketching Blade Banner"
          className="hero-image"
        />
      </div>

      {/* 🔹 Section: Original Artworks */}
      <div className="section-wrapper">
        <div className="section-card" style={{ backgroundImage: `url('/assets/original-artworks.jpg')` }}></div>
        <div className="section-info">
          <h2>Original Artworks</h2>
          <p>Explore a world of original artworks, drawn with emotion, color, and storytelling.</p>
          <Link to="/artworks" className="section-button">Explore</Link>
        </div>
      </div>

      {/* 🔹 Section: Short Comics */}
      <div className="section-wrapper">
        <div className="section-card" style={{ backgroundImage: `url('/assets/short-comics.jpg')` }}></div>
        <div className="section-info">
          <h2>Short Comics</h2>
          <p>Bite-sized stories packed with humor, heart, and unique characters. Perfect for quick reads!</p>
          <Link to="/comics" className="section-button">Read</Link>
        </div>
      </div>

     

      {/* 🔹 Section: God Arts */}
      <div className="section-wrapper">
        <div className="section-card" style={{ backgroundImage: `url('/assets/godly-realm.jpg')` }}></div>
        <div className="section-info">
          <h2>God Arts</h2>
          <p>Divine expressions and visuals drawn with devotion.</p>
          <Link to="/god-arts" className="section-button">Explore</Link>
        </div>
      </div>

    </div>
  );
}

export default Home;
