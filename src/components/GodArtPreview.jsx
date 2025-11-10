import { useEffect, useRef } from 'react';
import '../styles/GodArtPreview.css';

function GodArtPreview({ selectedArt, onClose, onNext, onPrev }) {
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  // Handle arrow keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        onNext();
      } else if (e.key === 'ArrowLeft') {
        onPrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrev, onClose]);

  // Handle swipe gestures
  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const deltaX = touchStartX.current - touchEndX.current;

    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        onNext(); // Swipe left
      } else {
        onPrev(); // Swipe right
      }
    }
  };

  if (!selectedArt) return null;

  return (
   <div
  className="godart-preview-overlay"
  onClick={onClose}
  onTouchStart={handleTouchStart}
  onTouchEnd={handleTouchEnd}
>
  <div className="godart-nav-buttons">
    <button className="nav-button prev" onClick={(e) => { e.stopPropagation(); onPrev(); }}>←</button>
    <button className="nav-button next" onClick={(e) => { e.stopPropagation(); onNext(); }}>→</button>
  </div>

  <div className="godart-preview-card" onClick={(e) => e.stopPropagation()}>
    <img src={selectedArt.image} alt={selectedArt.title} className="godart-preview-img" />
    <div className="godart-preview-info">
      <h2 className="godart-preview-title">{selectedArt.title}</h2>
      <p className="godart-preview-desc">{selectedArt.description}</p>
      <button className="godart-preview-close" onClick={onClose}>✕</button>
    </div>
  </div>
</div>

  );
}

export default GodArtPreview;
