import React from 'react';
import { formatChapterNumber, cleanChapterTitle } from '../utils/strapi';

export default function ChapterSelector({
  chapters,
  currentIndex,
  onSelectChapter,
  className = '',
}) {
  if (!chapters || chapters.length === 0) return null;

  return (
    <div className={`chapter-select-custom ${className}`}>
      <select
        id="chapter-select-dropdown"
        className="chapter-dropdown"
        value={currentIndex}
        onChange={(e) => onSelectChapter(Number(e.target.value))}
        aria-label="Select chapter"
      >
        {chapters.map((ch, idx) => {
          const num = formatChapterNumber(ch.ChapterNumber ?? ch.chapterNumber ?? idx + 1);
          const title = cleanChapterTitle(ch.Title || ch.title || `Chapter ${idx + 1}`);
          return (
            <option key={ch.documentId || ch.id || idx} value={idx}>
              Chapter {num} — {title}
            </option>
          );
        })}
      </select>
      <span className="dropdown-chevron" aria-hidden="true">▼</span>
    </div>
  );
}
