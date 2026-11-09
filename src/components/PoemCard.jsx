import React from 'react';
import { getStrapiMediaUrl, getGenreName } from '../utils/strapi';

export default function PoemCard({ poem, onOpen }) {
  const coverUrl = getStrapiMediaUrl(poem.CoverImage);
  const genres = poem.genres || [];

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen(poem);
    }
  };

  return (
    <div
      className="story-card poem-card"
      onClick={() => onOpen(poem)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Read poem: ${poem.Title}`}
    >
      <div className="card-image-wrap">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={poem.Title}
            className="story-thumbnail"
            loading="lazy"
          />
        ) : (
          <div className="card-placeholder-img">
            <span>No Cover</span>
          </div>
        )}
        <span className="card-badge poem-badge">Poem</span>
      </div>

      <div className="story-info">
        <h2 className="card-title">{poem.Title}</h2>

        {genres.length > 0 && (
          <div className="genre-pill-list">
            {genres.map((genre, idx) => {
              const name = getGenreName(genre);
              if (!name) return null;
              return (
                <span key={genre.documentId || genre.id || idx} className="genre-pill">
                  {name}
                </span>
              );
            })}
          </div>
        )}

        {poem.Description && (
          <p className="story-desc">{poem.Description}</p>
        )}

        <div className="card-footer-action">
          <span className="read-cta">Read Poem →</span>
        </div>
      </div>
    </div>
  );
}
