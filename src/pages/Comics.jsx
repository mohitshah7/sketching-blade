// pages/Comics.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Comics.css';

const Comics = () => {
  const [comics, setComics] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/data/comics.json')
      .then(res => res.json())
      .then(setComics);
  }, []);

  return (
    <div className="comic-gallery">
      <h1 className="page-title">Comics</h1>
      <div className="comic-grid">
        {comics.map(comic => (
          <div key={comic.id} className="comic-card" onClick={() => navigate(`/comics/${comic.id}`)}>
            <img src={comic.cover} alt={comic.title} />
            <p>{comic.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comics;
