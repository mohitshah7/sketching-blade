import React, { useState } from 'react';
import { getStrapiMediaUrl, getGenreName } from '../utils/strapi';

const DESC_LIMIT = 150;

export default function PoemCard({ poem, onOpen }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const coverUrl = getStrapiMediaUrl(poem.CoverImage);
  const genres = poem.genres || [];

  const description = poem.Description || '';
  const isLong = description.length > DESC_LIMIT;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen(poem);
    }
  };

  const handleToggleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded((prev) => !prev);
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

        {description && (
          <>
            <p className={`story-desc ${!isExpanded && isLong ? 'clamp-text' : ''}`}>
              {description}
            </p>
            {isLong && (
              <button
                type="button"
                className="read-more-btn"
                onClick={handleToggleExpand}
                aria-expanded={isExpanded}
              >
                {isExpanded ? 'Read less ▲' : 'Read more ▼'}
              </button>
            )}
          </>
        )}

        <div className="card-footer-action">
          <span className="read-cta">Read Poem →</span>
        </div>
      </div>
    </div>
  );
}
