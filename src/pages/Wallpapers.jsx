// src/pages/Wallpapers.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { getStrapiBaseUrl, getStrapiMediaUrl } from '../utils/strapi';
import { useSwipe } from '../utils/useSwipe';
import '../styles/Wallpapers.css';

const Wallpapers = () => {
  const [wallpapers, setWallpapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeType, setActiveType] = useState('Mobile'); // 'Mobile' | 'Desktop'

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Fetch wallpapers from Strapi
  useEffect(() => {
    const fetchWallpapers = async () => {
      setLoading(true);
      setError(null);
      try {
        const baseUrl = getStrapiBaseUrl();
        const res = await fetch(`${baseUrl}/api/wallpapers?populate=*`);
        if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
        const json = await res.json();
        const items = Array.isArray(json.data) ? json.data : [];
        const mapped = items.map((item) => ({
          id: item.documentId || item.id,
          name: item.Name || item.name || '',
          type: item.Type || item.type || 'Mobile',
          imageUrl: getStrapiMediaUrl(item.Image || item.image),
        }));
        setWallpapers(mapped);
      } catch (err) {
        console.error('Failed to load wallpapers:', err);
        setError('Failed to load wallpapers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchWallpapers();
  }, []);

  // Filtered list based on selected type
  const filtered = wallpapers.filter((w) => w.type === activeType);

  // Lightbox handlers
  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };
  const closeLightbox = () => setLightboxOpen(false);

  const showPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
  }, [filtered.length]);

  const showNext = useCallback(() => {
    setLightboxIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
  }, [filtered.length]);

  const handleKeyDown = useCallback(
    (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'Escape') closeLightbox();
    },
    [lightboxOpen, showPrev, showNext]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Reusable swipe gesture support (avoids hijacking vertical scroll)
  const { onTouchStart: handleTouchStart, onTouchEnd: handleTouchEnd } = useSwipe({
    onSwipeLeft: showNext,
    onSwipeRight: showPrev,
    threshold: 45,
  });

  const currentWallpaper = filtered[lightboxIndex];

  return (
    <div className="wallpapers-page">
      <h1 className="wallpapers-title">Wallpapers</h1>

      {/* Type toggle */}
      <div className="wallpapers-toggle" role="group" aria-label="Wallpaper type">
        <button
          className={`toggle-btn${activeType === 'Mobile' ? ' active' : ''}`}
          onClick={() => { setActiveType('Mobile'); setLightboxOpen(false); }}
        >
          Mobile
        </button>
        <button
          className={`toggle-btn${activeType === 'Desktop' ? ' active' : ''}`}
          onClick={() => { setActiveType('Desktop'); setLightboxOpen(false); }}
        >
          Desktop
        </button>
      </div>

      {/* Content area */}
      {loading && (
        <div className="wallpapers-status">
          <span className="wallpapers-loading">Loading wallpapers…</span>
        </div>
      )}

      {!loading && error && (
        <div className="wallpapers-status">
          <span className="wallpapers-error">{error}</span>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="wallpapers-status">
          <span className="wallpapers-empty">No {activeType.toLowerCase()} wallpapers found.</span>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className={`wallpapers-grid wallpapers-grid--${activeType.toLowerCase()}`}>
          {filtered.map((wp, index) => (
            <div
              key={wp.id}
              className="wallpaper-card"
              onClick={() => openLightbox(index)}
              role="button"
              tabIndex={0}
              aria-label={`View ${wp.name}`}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openLightbox(index); }}
            >
              <img
                src={wp.imageUrl}
                alt={wp.name}
                className="wallpaper-card__img"
                loading="lazy"
              />
              <div className="wallpaper-card__overlay">
                <span className="wallpaper-card__name">{wp.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && currentWallpaper && (
        <div
          className="wallpaper-lightbox"
          onClick={closeLightbox}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          role="dialog"
          aria-modal="true"
          aria-label="Wallpaper viewer"
        >
          <button
            className="lightbox-close"
            onClick={closeLightbox}
            aria-label="Close"
          >
            &times;
          </button>

          <img
            src={currentWallpaper.imageUrl}
            alt={currentWallpaper.name}
            className="lightbox-image"
            onClick={(e) => e.stopPropagation()}
          />

          <div className="lightbox-controls" onClick={(e) => e.stopPropagation()}>
            <button
              className="lightbox-nav"
              onClick={showPrev}
              aria-label="Previous"
            >
              &#8592;
            </button>
            <a
              href={currentWallpaper.imageUrl}
              download={currentWallpaper.name}
              className="lightbox-download"
              aria-label="Download"
            >
              ⬇ Download
            </a>
            <button
              className="lightbox-nav"
              onClick={showNext}
              aria-label="Next"
            >
              &#8594;
            </button>
          </div>

          <p className="lightbox-caption">{currentWallpaper.name}</p>
        </div>
      )}
    </div>
  );
};

export default Wallpapers;
