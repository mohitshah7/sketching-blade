import { useState, useEffect } from 'react';
import ArtworkLightbox from '../components/ArtworkLightbox';
import '../styles/Artworks.css';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

function Artworks() {
  const [artworks, setArtworks] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [direction, setDirection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

        setArtworks(result.data || []);
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

  const closeLightbox = () => {
    setSelectedIndex(null);
    setDirection(null);
  };

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

  const selectedArtwork =
    selectedIndex !== null && artworks[selectedIndex]
      ? {
          ...artworks[selectedIndex],
          image: getImageUrl(artworks[selectedIndex]),
        }
      : null;

  return (
    <div className="artworks-gallery">
      <h2 className="gallery-title">Original Artworks</h2>

      <div className="gallery-grid">
        {artworks.map((artwork, index) => (
          <div key={artwork.documentId || artwork.id || index} className="art-card">
            <img
              src={getImageUrl(artwork)}
              alt={artwork.Title || 'Artwork'}
              className="art-img"
              onClick={() => {
                setDirection(null);
                setSelectedIndex(index);
              }}
            />
          </div>
        ))}
      </div>

      {selectedArtwork && (
        <ArtworkLightbox
          artwork={selectedArtwork}
          onClose={closeLightbox}
          onNext={showNext}
          onPrev={showPrev}
          direction={direction}
        />
      )}
    </div>
  );
}

export default Artworks;
