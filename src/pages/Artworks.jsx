import { useState, useEffect, useRef } from 'react';
import '../styles/Artworks.css';

const artworks = [
  '/assets/artworks/kisna.jpg',
  '/assets/artworks/tangled.jpg',
  '/assets/artworks/hanuman-ashok.jpg',
  '/assets/artworks/hanuman-fire.jpg',
  '/assets/artworks/bappa.jpg',
  '/assets/artworks/t20.jpg',
  '/assets/artworks/shakti.jpg',
  '/assets/artworks/wonder.jpg',
  '/assets/artworks/batman-mirror.jpg',
  '/assets/artworks/batman.jpg',
  '/assets/artworks/bhishma.jpg',
  '/assets/artworks/blue-rain.jpg',
  '/assets/artworks/chandrayaan.jpg',
  '/assets/artworks/bal-shivaji.jpg',
  '/assets/artworks/cute.jpg',
  '/assets/artworks/dark.jpg',
  '/assets/artworks/desire.jpg',
  '/assets/artworks/fireflies.jpg',
  '/assets/artworks/fireflies2.jpg',
  '/assets/artworks/fireflies3.jpg',
  '/assets/artworks/fishing-true.jpg',
  '/assets/artworks/fishing.jpg',
  '/assets/artworks/gita-gyaan.jpg',
  '/assets/artworks/hagrid.jpg',
  '/assets/artworks/hanuman-fire2.jpg',
  '/assets/artworks/bali-vadh.jpg',
  '/assets/artworks/itachi.jpg',
  '/assets/artworks/jatayu.jpg',
  '/assets/artworks/kaizen-snake.jpg',
  '/assets/artworks/kaizen-true.jpg',
  '/assets/artworks/kaizen.jpg',
  '/assets/artworks/kakashi.jpg',
  '/assets/artworks/karna.jpg',
  '/assets/artworks/krishna-vishwaroop.jpg',
  '/assets/artworks/krishna.jpg',
  '/assets/artworks/law.jpg',
  '/assets/artworks/luffy-boat.jpg',
  '/assets/artworks/luffy-kaido.jpg',
  '/assets/artworks/mahadev.jpg',
  '/assets/artworks/mataji.jpg',
  '/assets/artworks/neeraj-chopra.jpg',
  '/assets/artworks/roy.jpg',
  '/assets/artworks/roy-small.jpg',
  '/assets/artworks/zoro.jpg',
  '/assets/artworks/wolves.jpg',
  '/assets/artworks/rain-reaction.jpg',
  '/assets/artworks/obito.jpg',
  '/assets/artworks/ronaldo.jpg',
  '/assets/artworks/redflags.jpg',
  '/assets/artworks/warrior.jpg',
  '/assets/artworks/bharat1.jpg',
  '/assets/artworks/bharat2.jpg',
  '/assets/artworks/shivaji.jpg',
  '/assets/artworks/grass.jpg',
  '/assets/artworks/december.jpg',
  '/assets/artworks/shiv.jpg',
  '/assets/artworks/ganesha.jpg',
  '/assets/artworks/me.jpg',
  '/assets/artworks/abhimanyu.jpg',
  '/assets/artworks/pokemon.jpg',
  '/assets/artworks/naruto.jpg',
  '/assets/artworks/run.jpg',
  '/assets/artworks/pumkin.jpg',
  '/assets/artworks/kakashi-sword.jpg',
  '/assets/artworks/naruto-sasuke.webp',
];

function Artworks() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [direction, setDirection] = useState(null); // ➡️ animation direction
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const SWIPE_THRESHOLD = 60; // minimum swipe distance

  const closeLightbox = () => setSelectedIndex(null);

  const showNext = () => {
    setDirection('next');
    setSelectedIndex((prev) => (prev + 1) % artworks.length);
  };

  const showPrev = () => {
    setDirection('prev');
    setSelectedIndex((prev) => (prev - 1 + artworks.length) % artworks.length);
  };

  // 🎹 Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex === null) return;
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex]);

  // 📱 Swipe handling
  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    handleSwipe();
  };

  const handleSwipe = () => {
    const distance = touchStartX.current - touchEndX.current;
    if (Math.abs(distance) < SWIPE_THRESHOLD) return; // ignore short swipes
    if (distance > 0) showNext(); // swipe left
    else showPrev(); // swipe right
  };

  return (
    <div className="artworks-gallery">
      <h2 className="gallery-title">Original Artworks</h2>

      <div className="gallery-grid">
        {artworks.map((src, index) => (
          <div key={index} className="art-card">
            <img
              src={src}
              alt=""
              className="art-img"
              onClick={() => setSelectedIndex(index)}
            />
          </div>
        ))}
      </div>

      {selectedIndex !== null && (
        <div
          className="lightbox"
          onClick={closeLightbox}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className={`lightbox-content ${
              direction === 'next' ? 'slide-next' : direction === 'prev' ? 'slide-prev' : ''
            }`}
          >
            <img
              src={artworks[selectedIndex]}
              alt="Full Preview"
              className="lightbox-img"
              onClick={(e) => e.stopPropagation()}
            />
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
