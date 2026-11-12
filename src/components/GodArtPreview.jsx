// src/components/GodArtPreview.jsx
import ArtworkLightbox from './ArtworkLightbox';

/**
 * GodArtPreview — reuses the unified ArtworkLightbox to guarantee 100% visual and behavioral
 * consistency with the original Artworks lightbox viewer across desktop and mobile.
 */
function GodArtPreview({ selectedArt, onClose, onNext, onPrev, direction = null }) {
  if (!selectedArt) return null;

  return (
    <ArtworkLightbox
      artwork={selectedArt}
      onClose={onClose}
      onNext={onNext}
      onPrev={onPrev}
      direction={direction}
    />
  );
}

export default GodArtPreview;
