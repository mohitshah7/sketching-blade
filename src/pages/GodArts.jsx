// src/pages/GodArts.jsx
import { useState, useEffect } from 'react';
import { getStrapiBaseUrl, getStrapiMediaUrl } from '../utils/strapi';
import '../styles/GodArts.css';
import GodArtPreview from '../components/GodArtPreview';

function GodArts() {
  const [godArts, setGodArts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [direction, setDirection] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchGodArts = async () => {
      setLoading(true);
      setError(null);
      try {
        const baseUrl = getStrapiBaseUrl();
        const res = await fetch(`${baseUrl}/api/god-arts?populate=*`);
        if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
        const json = await res.json();
        const items = Array.isArray(json.data) ? json.data : [];
        const mapped = items.map((item) => ({
          id: item.documentId || item.id,
          title: item.Title || item.title || '',
          description: item.Description || item.description || '',
          image: getStrapiMediaUrl(item.Image || item.image),
        }));
        if (isMounted) {
          setGodArts(mapped);
        }
      } catch (err) {
        console.error('[GodArts] Failed to load God Arts from Strapi:', err);
        if (isMounted) {
          setError('Failed to load God Arts. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchGodArts();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleClose = () => {
    setSelectedIndex(null);
    setDirection(null);
  };

  const handleNext = () => {
    setDirection('next');
    setSelectedIndex((prev) => (prev === godArts.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setDirection('prev');
    setSelectedIndex((prev) => (prev === 0 ? godArts.length - 1 : prev - 1));
  };

  return (
    <div className="god-arts-page">
      <h1 className="god-arts-title">God Arts</h1>

      {loading && (
        <div className="god-arts-status">
          <span className="god-arts-loading">Loading artworks…</span>
        </div>
      )}

      {!loading && error && (
        <div className="god-arts-status">
          <span className="god-arts-error">{error}</span>
        </div>
      )}

      {!loading && !error && godArts.length === 0 && (
        <div className="god-arts-status">
          <span className="god-arts-empty">No artworks found.</span>
        </div>
      )}

      {!loading && !error && godArts.length > 0 && (
        <div className="god-arts-grid">
          {godArts.map((art, index) => (
            <div
              key={art.id}
              className="godart-card"
              onClick={() => {
                setDirection(null);
                setSelectedIndex(index);
              }}
              role="button"
              tabIndex={0}
              aria-label={`View ${art.title}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setDirection(null);
                  setSelectedIndex(index);
                }
              }}
            >
              <img
                src={art.image}
                alt={art.title}
                className="godart-card__img"
                loading="lazy"
              />
              <div className="godart-card__overlay">
                <span className="godart-card__title">{art.title}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedIndex !== null && godArts[selectedIndex] && (
        <GodArtPreview
          selectedArt={godArts[selectedIndex]}
          onClose={handleClose}
          onNext={handleNext}
          onPrev={handlePrev}
          direction={direction}
        />
      )}
    </div>
  );
}

export default GodArts;
