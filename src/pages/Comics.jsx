// pages/Comics.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStrapiBaseUrl, getStrapiMediaUrl } from '../utils/strapi';
import '../styles/Comics.css';

const Comics = () => {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchComics = async () => {
      try {
        setLoading(true);
        setError(null);
        const baseUrl = getStrapiBaseUrl();
        const res = await fetch(`${baseUrl}/api/comics?populate=*`);

        if (!res.ok) {
          throw new Error(`Failed to fetch comics (${res.status} ${res.statusText})`);
        }

        const data = await res.json();
        const rawComics = Array.isArray(data?.data) ? data.data : (data?.data ? [data.data] : []);

        const mapped = rawComics.map((item) => ({
          id: item.documentId || item.id,
          title: item.Title || item.title || '',
          cover: getStrapiMediaUrl(item.CoverImage || item.coverImage || item.cover),
          genres: item.genres || [],
          description: item.Description || item.description || '',
        }));

        if (isMounted) {
          setComics(mapped);
        }
      } catch (err) {
        console.error('[Comics] Error fetching comics:', err);
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchComics();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="comic-gallery">
      <h1 className="page-title">Comics</h1>

      {loading && (
        <div className="comic-state-message">Loading comics...</div>
      )}

      {error && !loading && (
        <div className="comic-state-message error">
          Unable to load comics. Please ensure Strapi is running at {getStrapiBaseUrl()}.
        </div>
      )}

      {!loading && !error && comics.length === 0 && (
        <div className="comic-state-message">
          No comics available at the moment.
        </div>
      )}

      {!loading && !error && comics.length > 0 && (
        <div className="comic-grid">
          {comics.map((comic) => (
            <div
              key={comic.id}
              className="comic-card"
              onClick={() => navigate(`/comics/${comic.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(`/comics/${comic.id}`);
                }
              }}
            >
              <div className="comic-card-cover">
                {comic.cover ? (
                  <img src={comic.cover} alt={comic.title} loading="lazy" />
                ) : (
                  <div className="comic-cover-placeholder">No Cover</div>
                )}
              </div>
              <p className="comic-card-title">{comic.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comics;
