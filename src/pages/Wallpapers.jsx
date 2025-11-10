// src/pages/Wallpapers.jsx
import React, { useState, useEffect, useCallback } from 'react';
import '../styles/Wallpapers.css';

const desktopWallpapers = [
  
];

const mobileWallpapers = [
  "mobile/wp2.jpg", "mobile/wp3.jpg",
  "mobile/wp4.jpg", "mobile/wp5.jpg", "mobile/wp6.jpg",
  "mobile/wp7.jpg", "mobile/wp-8.jpg", "mobile/wp-9.jpg",
  "mobile/radha-wp.jpg", "mobile/kisna-wp.jpg"
];

const allWallpapers = [...desktopWallpapers, ...mobileWallpapers];

const Wallpapers = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const showPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : allWallpapers.length - 1));
  }, []);

  const showNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < allWallpapers.length - 1 ? prev + 1 : 0));
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (!lightboxOpen) return;
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'Escape') closeLightbox();
  }, [lightboxOpen, showPrev, showNext]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Swipe gesture handlers
  let touchStartX = 0;
  let touchEndX = 0;

  const handleTouchStart = (e) => {
    touchStartX = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) showNext(); // swipe left
    if (touchEndX - touchStartX > 50) showPrev(); // swipe right
  };

  return (
    <div className="wallpaper-gallery">
      <h2 className="gallery-title">Wallpapers Gallery</h2>
      <div className="gallery-grid">
        {allWallpapers.map((imgPath, index) => (
          <img
            key={index}
            src={`/assets/wallpapers/${imgPath}`}
            alt={`Wallpaper ${index}`}
            onClick={() => openLightbox(index)}
            className="gallery-img"
          />
        ))}
      </div>

      {lightboxOpen && (
        <div
          className="lightbox"
          onClick={closeLightbox}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <span className="close-btn" onClick={closeLightbox}>&times;</span>
          <img
            src={`/assets/wallpapers/${allWallpapers[currentIndex]}`}
            alt="Enlarged"
            className="lightbox-img"
          />
          <div className="lightbox-controls">
            <button onClick={(e) => { e.stopPropagation(); showPrev(); }}>&#8592;</button>
            <a
              href={`/assets/wallpapers/${allWallpapers[currentIndex]}`}
              download
              className="download-btn"
              onClick={(e) => e.stopPropagation()}
            >
              ⬇
            </a>
            <button onClick={(e) => { e.stopPropagation(); showNext(); }}>&#8594;</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallpapers;
