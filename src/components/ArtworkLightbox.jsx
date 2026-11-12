// src/components/ArtworkLightbox.jsx
import { useEffect } from 'react';
import { useSwipe } from '../utils/useSwipe';
import '../styles/Artworks.css';

/**
 * Unified artwork lightbox used across Artworks, God Arts, and gallery views.
 * - Desktop: Center stage contain-fit artwork + info panel + left/right navigation arrows + keyboard navigation
 * - Mobile: Fluid contain-fit artwork + info panel + swipe left/right gestures + arrows hidden
 */
export default function ArtworkLightbox({
  artwork,
  onClose,
  onNext,
  onPrev,
  direction = null,
}) {
  const { onTouchStart, onTouchEnd } = useSwipe({
    onSwipeLeft: onNext,
    onSwipeRight: onPrev,
    threshold: 45,
  });

  // Lock background body scroll while lightbox is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Keyboard navigation (ArrowRight -> next, ArrowLeft -> prev, Escape -> close)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') onNext?.();
      else if (e.key === 'ArrowLeft') onPrev?.();
      else if (e.key === 'Escape') onClose?.();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrev, onClose]);

  if (!artwork) return null;

  const title = artwork.title || artwork.Title || 'Artwork';
  const imageUrl =
    artwork.image ||
    artwork.imageUrl ||
    (artwork.Image?.url
      ? artwork.Image.url.startsWith('http')
        ? artwork.Image.url
        : `${import.meta.env.VITE_STRAPI_URL}${artwork.Image.url}`
      : '');
  const description = artwork.description || artwork.Description || '';
  const category = artwork.category || artwork.Category || '';
  const mediums = Array.isArray(artwork.mediums)
    ? artwork.mediums.map((m) => m.Name || m.name || m).join(', ')
    : artwork.mediums || '';

  return (
    <div
      className="lightbox"
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Accessible Close Button */}
      <button
        type="button"
        className="lightbox-close"
        onClick={(e) => {
          e.stopPropagation();
          onClose?.();
        }}
        aria-label="Close viewer"
      >
        ✕
      </button>

      {/* Main Lightbox Content with Direction Slide Animation */}
      <div
        className={`lightbox-content ${
          direction === 'next'
            ? 'slide-next'
            : direction === 'prev'
              ? 'slide-prev'
              : ''
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={title}
          className="lightbox-img"
        />

        <div className="lightbox-info">
          <h2>{title}</h2>

          {description && <p>{description}</p>}

          {category && <span className="art-category">{category}</span>}

          {mediums && (
            <div className="art-mediums">
              <strong>Medium:</strong> {mediums}
            </div>
          )}
        </div>
      </div>

      {/* Desktop/Tablet Navigation Arrows (hidden on mobile via CSS) */}
      <button
        type="button"
        className="nav-arrow prev"
        onClick={(e) => {
          e.stopPropagation();
          onPrev?.();
        }}
        aria-label="Previous artwork"
      >
        ‹
      </button>

      <button
        type="button"
        className="nav-arrow next"
        onClick={(e) => {
          e.stopPropagation();
          onNext?.();
        }}
        aria-label="Next artwork"
      >
        ›
      </button>
    </div>
  );
}

