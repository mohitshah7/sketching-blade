// components/ComicReader.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getStrapiBaseUrl, getStrapiMediaUrl } from '../utils/strapi';
import '../styles/ComicReader.css';

const ComicReader = () => {
  const { comicId } = useParams();
  const navigate = useNavigate();
  const [comic, setComic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchComic = async () => {
      try {
        setLoading(true);
        setError(null);
        const baseUrl = getStrapiBaseUrl();

        // Populate CoverImage, Audio, genres, and nested comic_pages -> Image
        const populateQuery = 'populate[comic_pages][populate]=Image&populate[CoverImage]=true&populate[Audio]=true&populate[genres]=true';
        let res = await fetch(`${baseUrl}/api/comics/${comicId}?${populateQuery}`);

        // If direct fetch returns 404 (or numeric id was used), fallback to filter query
        if (!res.ok) {
          const filterQuery = /^\d+$/.test(comicId)
            ? `filters[id][$eq]=${comicId}`
            : `filters[documentId][$eq]=${comicId}`;
          res = await fetch(`${baseUrl}/api/comics?${filterQuery}&${populateQuery}`);
        }

        if (!res.ok) {
          throw new Error(`Failed to load comic (${res.status} ${res.statusText})`);
        }

        const json = await res.json();
        const item = Array.isArray(json.data) ? json.data[0] : json.data;

        if (!item) {
          if (isMounted) {
            setComic(null);
          }
          return;
        }

        // Extract and sort pages by PageNumber / SerialNumber ascending
        const rawPages = item.comic_pages || item.ComicPages || item.pages || item.Pages || [];
        const sortedPages = [...rawPages].sort((a, b) => {
          const numA = a.PageNumber ?? a.pageNumber ?? a.SerialNumber ?? a.serial_number ?? a.order ?? 0;
          const numB = b.PageNumber ?? b.pageNumber ?? b.SerialNumber ?? b.serial_number ?? b.order ?? 0;
          return Number(numA) - Number(numB);
        });

        const pages = sortedPages
          .map((p) => getStrapiMediaUrl(p.Image || p.image || p.url || p))
          .filter(Boolean);

        const audioUrl = item.Audio ? getStrapiMediaUrl(item.Audio) : '';

        if (isMounted) {
          setComic({
            id: item.documentId || item.id,
            title: item.Title || item.title || '',
            audio: audioUrl,
            pages,
          });
        }
      } catch (err) {
        console.error('[ComicReader] Error fetching comic details:', err);
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (comicId) {
      fetchComic();
    }

    return () => {
      isMounted = false;
    };
  }, [comicId]);

  if (loading) {
    return (
      <div className="comic-reader">
        <div className="comic-reader-state">
          Loading comic...
        </div>
      </div>
    );
  }

  if (error || !comic) {
    return (
      <div className="comic-reader">
        <button
          type="button"
          className="comic-reader-exit-btn"
          onClick={() => navigate(-1)}
          aria-label="Close comic reader"
        >
          ✕
        </button>
        <div className="comic-reader-state error">
          {error ? `Error: ${error}` : 'Comic not found.'}
        </div>
      </div>
    );
  }

  return (
    <div className="comic-reader">
      <button
        type="button"
        className="comic-reader-exit-btn"
        onClick={() => navigate(-1)}
        aria-label="Close comic reader"
      >
        ✕
      </button>

      <div className="comic-reader-content">
        <h2 className="comic-title">{comic.title}</h2>

        {comic.audio && (
          <div className="comic-audio-container" aria-label="Comic soundtrack player">
            <span className="comic-audio-label">Soundtrack</span>
            <audio controls className="comic-audio-element" preload="metadata">
              <source src={comic.audio} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        <div className="comic-pages">
          {comic.pages.map((page, index) => (
            <img
              key={index}
              src={page}
              alt={`Page ${index + 1}`}
              className="comic-page"
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComicReader;
