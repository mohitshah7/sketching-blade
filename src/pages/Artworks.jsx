import { useState, useEffect, useRef } from 'react';
import '../styles/Artworks.css';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

function Artworks() {
  const [artworks, setArtworks] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [direction, setDirection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const SWIPE_THRESHOLD = 60;

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await fetch(
          `${STRAPI_URL}/api/artworks?populate=*`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch artworks');
        }

        const result = await response.json();

        setArtworks(result.data);
      } catch (err) {
        console.error('Error fetching artworks:', err);
        setError('Unable to load artworks.');
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  const getImageUrl = (artwork) => {
    const imageUrl = artwork.Image?.url;

    if (!imageUrl) return '';

    return imageUrl.startsWith('http')
      ? imageUrl
      : `${STRAPI_URL}${imageUrl}`;
  };

  const closeLightbox = () => setSelectedIndex(null);

  const showNext = () => {
    setDirection('next');

    setSelectedIndex((prev) => {
      if (prev === null || artworks.length === 0) return prev;
      return (prev + 1) % artworks.length;
    });
  };

  const showPrev = () => {
    setDirection('prev');

    setSelectedIndex((prev) => {
      if (prev === null || artworks.length === 0) return prev;
      return (prev - 1 + artworks.length) % artworks.length;
    });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex === null) return;

      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'Escape') closeLightbox();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedIndex, artworks.length]);

  // Swipe handling
  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    handleSwipe();
  };

  const handleSwipe = () => {
    if (touchStartX.current === null || touchEndX.current === null) {
      return;
    }

    const distance = touchStartX.current - touchEndX.current;

    if (Math.abs(distance) < SWIPE_THRESHOLD) return;

    if (distance > 0) {
      showNext();
    } else {
      showPrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (loading) {
    return (
      <div className="artworks-gallery">
        <h2 className="gallery-title">Original Artworks</h2>
        <p>Loading artworks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="artworks-gallery">
        <h2 className="gallery-title">Original Artworks</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="artworks-gallery">
      <h2 className="gallery-title">Original Artworks</h2>

      <div className="gallery-grid">
        {artworks.map((artwork, index) => (
          <div key={artwork.documentId} className="art-card">
            <img
              src={getImageUrl(artwork)}
              alt={artwork.Title || 'Artwork'}
              className="art-img"
              onClick={() => setSelectedIndex(index)}
            />
          </div>
        ))}
      </div>

      {selectedIndex !== null && artworks[selectedIndex] && (
        <div
          className="lightbox"
          onClick={closeLightbox}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className={`lightbox-content ${direction === 'next'
              ? 'slide-next'
              : direction === 'prev'
                ? 'slide-prev'
                : ''
              }`}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={getImageUrl(artworks[selectedIndex])}
              alt={artworks[selectedIndex].Title || 'Artwork'}
              className="lightbox-img"
            />

            <div className="lightbox-info">
              <h2>{artworks[selectedIndex].Title}</h2>

              {artworks[selectedIndex].Description && (
                <p>{artworks[selectedIndex].Description}</p>
              )}

              {artworks[selectedIndex].Category && (
                <span className="art-category">
                  {artworks[selectedIndex].Category}
                </span>
              )}
              {artworks[selectedIndex].mediums?.length > 0 && (
                <div className="art-mediums">
                  <strong>Medium:</strong>{' '}
                  {artworks[selectedIndex].mediums
                    .map((medium) => medium.Name)
                    .join(', ')}
                </div>
              )}
            </div>
          </div>

          <button
            className="nav-arrow prev"
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
          >
            ‹
          </button>

          <button
            className="nav-arrow next"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}

export default Artworks;