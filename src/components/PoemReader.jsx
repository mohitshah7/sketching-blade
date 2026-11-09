import React, { useEffect, useMemo } from 'react';
import { getStrapiMediaUrl, getGenreName, sanitizeAndFormatContent } from '../utils/strapi';

export default function PoemReader({ poem, onClose }) {
  const coverUrl = getStrapiMediaUrl(poem.CoverImage);
  const genres = poem.genres || [];

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const formattedHtml = useMemo(() => {
    const raw = poem.Content ?? poem.content ?? '';
    return sanitizeAndFormatContent(raw);
  }, [poem]);

  return (
    <div
      className="reader-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={poem.Title}
    >
      <div
        className="reader-container poem-reader-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Desktop Close Button */}
        <button
          className="reader-close-btn desktop-only"
          onClick={onClose}
          aria-label="Close poem reader"
        >
          ✕
        </button>

        {/* Mobile Header: Back and Title only */}
        <div className="reader-mobile-header mobile-only">
          <div className="mobile-header-top">
            <button
              type="button"
              className="mobile-back-btn"
              onClick={onClose}
              aria-label="Back to poems"
            >
              ← Back
            </button>
          </div>
          <span className="poem-kicker">Poem</span>
          <h2 className="mobile-story-title">{poem.Title}</h2>
          <div className="mobile-header-divider" />
        </div>

        {/* Desktop Poem Header */}
        <header className="poem-reader-header desktop-only">
          {coverUrl && (
            <div className="poem-cover-wrap">
              <img
                src={coverUrl}
                alt={poem.Title}
                className="poem-cover-img"
              />
            </div>
          )}

          <div className="poem-meta">
            <span className="poem-kicker">Poem</span>
            <h1 className="poem-title">{poem.Title}</h1>

            {genres.length > 0 && (
              <div className="overview-genres">
                {genres.map((g, idx) => {
                  const name = getGenreName(g);
                  if (!name) return null;
                  return (
                    <React.Fragment key={g.documentId || g.id || idx}>
                      <span className="overview-genre-name">{name}</span>
                      {idx < genres.length - 1 && (
                        <span className="genre-bullet">•</span>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            )}

            {poem.Description && (
              <p className="poem-description">{poem.Description}</p>
            )}
          </div>
        </header>

        <div className="poem-divider desktop-only" />

        {/* Poem Reading Content */}
        <main className="poem-content-pane">
          <div
            className="rich-poem-content"
            dangerouslySetInnerHTML={{ __html: formattedHtml }}
          />
        </main>
      </div>
    </div>
  );
}
