// components/ComicReader.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/ComicReader.css';

const ComicReader = () => {
  const { comicId } = useParams();
  const navigate = useNavigate();
  const [comic, setComic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/comics.json')
      .then(res => res.json())
      .then(data => {
        const selectedComic = data.find(c => c.id === comicId);
        setComic(selectedComic);
        setLoading(false);
      });
  }, [comicId]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!comic) return <div className="error">Comic not found.</div>;

  return (
    <div className="comic-reader">
      <button className="exit-button" onClick={() => navigate(-1)}>✕</button>
      <h2 className="comic-title">{comic.title}</h2>

      {comic.audio && (
        <audio controls className="comic-audio">
          <source src={comic.audio} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}

      <div className="comic-pages">
        {comic.pages.map((page, index) => (
          <img
            key={index}
            src={page}
            alt={`Page ${index + 1}`}
            className="comic-page"
          />
        ))}
      </div>
    </div>
  );
};

export default ComicReader;
