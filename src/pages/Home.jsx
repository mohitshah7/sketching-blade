import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStrapiBaseUrl, getStrapiMediaUrl } from '../utils/strapi';
import '../styles/Home.css';

function Home() {
  const [bannerUrl, setBannerUrl] = useState('');
  const [backgroundUrl, setBackgroundUrl] = useState('');
  const [bannerAlt, setBannerAlt] = useState('Sketching Blade Banner');

  useEffect(() => {
    let isMounted = true;

    const fetchHomePage = async () => {
      try {
        const baseUrl = getStrapiBaseUrl();
        const res = await fetch(`${baseUrl}/api/home-page?populate=*`);

        if (!res.ok) {
          throw new Error(`Failed to fetch home page data (${res.status} ${res.statusText})`);
        }

        const json = await res.json();
        const data = Array.isArray(json?.data) ? json.data[0] : (json?.data || null);

        if (data && isMounted) {
          const banner = getStrapiMediaUrl(data.BannerImage || data.bannerImage);
          const bg = getStrapiMediaUrl(data.BackgroundImage || data.backgroundImage);

          if (banner) {
            setBannerUrl(banner);
          }
          if (bg) {
            setBackgroundUrl(bg);
          }
          if (data.BannerImage?.alternativeText) {
            setBannerAlt(data.BannerImage.alternativeText);
          }
        }
      } catch (err) {
        console.error('[Home] Error fetching home page from Strapi:', err);
      }
    };

    fetchHomePage();

    return () => {
      isMounted = false;
    };
  }, []);

  const bannerSrc = bannerUrl || '/assets/herobanner.jpg';
  const homeStyle = backgroundUrl
    ? { backgroundImage: `url("${backgroundUrl}")` }
    : undefined;

  return (
    <div className="home-sections" style={homeStyle}>

      {/* 🔶 Hero Section */}
      <div className="hero-banner">
        <img
          src={bannerSrc}
          alt={bannerAlt}
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
