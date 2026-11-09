import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import ChapterSelector from './ChapterSelector';
import {
  getStrapiMediaUrl,
  formatChapterNumber,
  cleanChapterTitle,
  getGenreName,
  sanitizeAndFormatContent,
} from '../utils/strapi';

export default function StoryReader({ story, onClose }) {
  // Sort chapters ascending by ChapterNumber
  const sortedChapters = useMemo(() => {
    if (!story || !story.chapters) return [];
    return [...story.chapters].sort((a, b) => {
      const numA = a.ChapterNumber ?? a.chapterNumber ?? 0;
      const numB = b.ChapterNumber ?? b.chapterNumber ?? 0;
      return numA - numB;
    });
  }, [story]);

  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const touchStartY = useRef(null);
  const touchEndY = useRef(null);
  const contentPaneRef = useRef(null);

  const currentChapter = sortedChapters[currentChapterIndex] || null;
  const coverUrl = getStrapiMediaUrl(story.CoverImage);
  const genres = story.genres || [];

  // Reset reading scroll to top on chapter change (instant, natural)
  useEffect(() => {
    if (contentPaneRef.current) {
      contentPaneRef.current.scrollTop = 0;
    }
  }, [currentChapterIndex]);

  const goToNextChapter = useCallback(() => {
    setCurrentChapterIndex((prev) => {
      if (prev < sortedChapters.length - 1) {
        return prev + 1;
      }
      return prev;
    });
  }, [sortedChapters.length]);

  const goToPrevChapter = useCallback(() => {
    setCurrentChapterIndex((prev) => {
      if (prev > 0) {
        return prev - 1;
      }
      return prev;
    });
  }, []);

  // Keyboard navigation: Left/Right arrows for chapters, Escape to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        goToNextChapter();
      } else if (e.key === 'ArrowLeft') {
        goToPrevChapter();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, goToNextChapter, goToPrevChapter]);

  // Touch swipe handling for mobile (strict horizontal detection so vertical reading scroll never stutters)
  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX;
    touchStartY.current = e.changedTouches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    touchEndY.current = e.changedTouches[0].clientY;
    handleSwipe();
  };

  const handleSwipe = () => {
    if (
      touchStartX.current === null ||
      touchEndX.current === null ||
      touchStartY.current === null ||
      touchEndY.current === null
    ) {
      return;
    }
    const deltaX = touchStartX.current - touchEndX.current;
    const deltaY = touchStartY.current - touchEndY.current;

    // Only switch chapter if gesture is predominantly horizontal
    if (Math.abs(deltaX) > 70 && Math.abs(deltaX) > Math.abs(deltaY) * 1.6) {
      if (deltaX > 0) {
        goToNextChapter();
      } else {
        goToPrevChapter();
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
    touchStartY.current = null;
    touchEndY.current = null;
  };

  const formattedHtml = useMemo(() => {
    if (!currentChapter) return '';
    const rawContent = currentChapter.Content ?? currentChapter.content ?? '';
    return sanitizeAndFormatContent(rawContent);
  }, [currentChapter]);

  const chapterNumStr = currentChapter
    ? formatChapterNumber(
        currentChapter.ChapterNumber ??
          currentChapter.chapterNumber ??
          currentChapterIndex + 1
      )
    : '01';

  const chapterCleanTitle = currentChapter
    ? cleanChapterTitle(
        currentChapter.Title || currentChapter.title || `Chapter ${currentChapterIndex + 1}`
      )
    : '';

  return (
    <div
      className="reader-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={story.Title}
    >
      <div
        className="reader-container"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Desktop Close Button */}
        <button
          className="reader-close-btn desktop-only"
          onClick={onClose}
          aria-label="Close reader"
        >
          ✕
        </button>

        {/* 1A. MOBILE HEADER: ONLY Back, Story Title, Chapter Selector */}
        <div className="reader-mobile-header mobile-only">
          <div className="mobile-header-top">
            <button
              type="button"
              className="mobile-back-btn"
              onClick={onClose}
              aria-label="Back to stories"
            >
              ← Back
            </button>
          </div>
          <h2 className="mobile-story-title">{story.Title}</h2>
          <div className="mobile-chapter-select-bar">
            <ChapterSelector
              chapters={sortedChapters}
              currentIndex={currentChapterIndex}
              onSelectChapter={setCurrentChapterIndex}
            />
          </div>
          <div className="mobile-header-divider" />
        </div>

        {/* 1B. DESKTOP HEADER: Story Overview (Cover, Title, Genres, Description) */}
        <header className="story-overview-header desktop-only">
          {coverUrl && (
            <div className="overview-cover-wrap">
              <img
                src={coverUrl}
                alt={story.Title}
                className="overview-cover-img"
              />
            </div>
          )}

          <div className="overview-meta">
            <h1 className="overview-title">{story.Title}</h1>

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

            {story.Description && (
              <p className="overview-description">{story.Description}</p>
            )}
          </div>
        </header>

        {/* 2. Reader Body: Split Layout on Desktop / Clean Reading on Mobile */}
        <div className="reader-split-body">
          {/* Desktop Chapter Sidebar */}
          <aside
            className="reader-chapter-sidebar desktop-only"
            aria-label="Story Chapters"
          >
            <div className="sidebar-header">
              <h3>Chapters</h3>
              <span className="sidebar-count">{sortedChapters.length}</span>
            </div>

            <nav className="sidebar-nav">
              <ul className="sidebar-chapter-list">
                {sortedChapters.map((ch, idx) => {
                  const num = formatChapterNumber(
                    ch.ChapterNumber ?? ch.chapterNumber ?? idx + 1
                  );
                  const title = cleanChapterTitle(
                    ch.Title || ch.title || `Chapter ${idx + 1}`
                  );
                  const isActive = idx === currentChapterIndex;

                  return (
                    <li key={ch.documentId || ch.id || idx}>
                      <button
                        type="button"
                        className={`sidebar-chapter-item ${
                          isActive ? 'active' : ''
                        }`}
                        onClick={() => setCurrentChapterIndex(idx)}
                      >
                        <span className="chapter-item-num">{num}</span>
                        <span className="chapter-item-title">{title}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          {/* Reading Pane - Smooth, natural vertical scrolling */}
          <main className="reader-content-pane" ref={contentPaneRef}>
            {sortedChapters.length === 0 ? (
              <div className="reader-empty-chapter">
                <p>No chapters available for this story yet.</p>
              </div>
            ) : currentChapter ? (
              <article className="reading-article">
                <header className="chapter-header">
                  <div className="chapter-kicker">Chapter {chapterNumStr}</div>
                  <h2 className="chapter-headline">{chapterCleanTitle}</h2>
                  <div className="chapter-divider" />
                </header>

                <div
                  className="rich-chapter-content"
                  dangerouslySetInnerHTML={{ __html: formattedHtml }}
                />
              </article>
            ) : (
              <div className="reader-empty-chapter">
                <p>Select a chapter to begin reading.</p>
              </div>
            )}
          </main>
        </div>

        {/* 3. Footer Navigation Bar */}
        {sortedChapters.length > 0 && (
          <footer className="reader-footer-nav">
            <button
              type="button"
              className="reader-nav-btn prev-btn"
              onClick={goToPrevChapter}
              disabled={currentChapterIndex === 0}
              aria-label="Previous Chapter"
            >
              ‹ <span className="nav-btn-text">Previous</span>
            </button>

            <div className="chapter-progress-indicator">
              <span>
                Chapter {currentChapterIndex + 1} of {sortedChapters.length}
              </span>
            </div>

            <button
              type="button"
              className="reader-nav-btn next-btn"
              onClick={goToNextChapter}
              disabled={currentChapterIndex >= sortedChapters.length - 1}
              aria-label="Next Chapter"
            >
              <span className="nav-btn-text">Next</span> ›
            </button>
          </footer>
        )}
      </div>
    </div>
  );
}
