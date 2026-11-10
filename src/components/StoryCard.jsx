import React, { useState } from 'react';
import { getStrapiMediaUrl, getGenreName } from '../utils/strapi';

const DESC_LIMIT = 150;

export default function StoryCard({ story, onOpen }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const coverUrl = getStrapiMediaUrl(story.CoverImage);
  const chapterCount = story.chapters ? story.chapters.length : 0;
  const genres = story.genres || [];

  const description = story.Description || '';
  const isLong = description.length > DESC_LIMIT;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen(story);
    }
  };

  const handleToggleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded((prev) => !prev);
  };

  return (
    <div
      className="story-card"
      onClick={() => onOpen(story)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Read story: ${story.Title}`}
    >
      <div className="card-image-wrap">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={story.Title}
            className="story-thumbnail"
            loading="lazy"
          />
        ) : (
          <div className="card-placeholder-img">
            <span>No Cover</span>
          </div>
        )}
        <span className="card-badge story-badge">
          {chapterCount} {chapterCount === 1 ? 'Chapter' : 'Chapters'}
        </span>
      </div>

      <div className="story-info">
        <h2 className="card-title">{story.Title}</h2>

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
          <span className="read-cta">Read Story →</span>
        </div>
      </div>
    </div>
  );
}
