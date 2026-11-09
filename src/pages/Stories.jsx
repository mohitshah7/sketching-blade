import React, { useState, useEffect, useCallback } from 'react';
import StoryCard from '../components/StoryCard';
import PoemCard from '../components/PoemCard';
import StoryReader from '../components/StoryReader';
import PoemReader from '../components/PoemReader';
import '../styles/Stories.css';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

export default function Stories() {
  const [stories, setStories] = useState([]);
  const [poems, setPoems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('stories'); // 'stories' | 'poems'

  const [selectedStory, setSelectedStory] = useState(null);
  const [selectedPoem, setSelectedPoem] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (!STRAPI_URL) {
        throw new Error('Strapi URL environment variable (VITE_STRAPI_URL) is not defined.');
      }

      const [storiesRes, poemsRes] = await Promise.all([
        fetch(`${STRAPI_URL}/api/stories?populate=*`),
        fetch(`${STRAPI_URL}/api/poems?populate=*`),
      ]);

      if (!storiesRes.ok) {
        throw new Error(`Failed to fetch stories (HTTP ${storiesRes.status})`);
      }

      const storiesJson = await storiesRes.json();
      setStories(storiesJson.data || []);

      if (poemsRes.ok) {
        const poemsJson = await poemsRes.json();
        setPoems(poemsJson.data || []);
      } else {
        console.warn('Could not fetch poems:', poemsRes.statusText);
        setPoems([]);
      }
    } catch (err) {
      console.error('Error fetching Stories & Poems from Strapi:', err);
      setError(err.message || 'Unable to connect to the content server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle modal body scroll lock
  const openStory = useCallback((story) => {
    setSelectedStory(story);
    setSelectedPoem(null);
    document.body.classList.add('no-scroll');
  }, []);

  const closeStory = useCallback(() => {
    setSelectedStory(null);
    document.body.classList.remove('no-scroll');
  }, []);

  const openPoem = useCallback((poem) => {
    setSelectedPoem(poem);
    setSelectedStory(null);
    document.body.classList.add('no-scroll');
  }, []);

  const closePoem = useCallback(() => {
    setSelectedPoem(null);
    document.body.classList.remove('no-scroll');
  }, []);

  // Clean up body class if component unmounts with modal open
  useEffect(() => {
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);

  return (
    <div className="stories-gallery-page">
      {/* Page Title */}
      <h1 className="gallery-title">Stories & Poems</h1>

      {/* Stories / Poems Switch Toggle */}
      {!loading && !error && (
        <div className="section-toggle-container">
          <div className="section-toggle" role="tablist" aria-label="Content selection">
            <button
              type="button"
              role="tab"
              aria-selected={activeSection === 'stories'}
              className={`toggle-tab-btn ${activeSection === 'stories' ? 'active' : ''}`}
              onClick={() => setActiveSection('stories')}
            >
              Stories
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeSection === 'poems'}
              className={`toggle-tab-btn ${activeSection === 'poems' ? 'active' : ''}`}
              onClick={() => setActiveSection('poems')}
            >
              Poems
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="status-container loading-container" role="status">
          <div className="loading-spinner" aria-hidden="true" />
          <p className="status-text">Loading content...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="status-container error-container" role="alert">
          <h2 className="status-title">Unable to Load Content</h2>
          <p className="status-text">{error}</p>
          <button type="button" className="retry-btn" onClick={fetchData}>
            Try Again
          </button>
        </div>
      )}

      {/* Main Content: Displays ONLY the active section with smooth transition */}
      {!loading && !error && (
        <div className="stories-sections-container">
          <div className="toggle-content-pane" key={activeSection}>
            {activeSection === 'stories' ? (
              <section className="stories-section" aria-label="Stories">
                {stories.length === 0 ? (
                  <p className="empty-section-message">No stories available yet.</p>
                ) : (
                  <div className="stories-grid">
                    {stories.map((story) => (
                      <StoryCard
                        key={story.documentId || story.id}
                        story={story}
                        onOpen={openStory}
                      />
                    ))}
                  </div>
                )}
              </section>
            ) : (
              <section className="stories-section" aria-label="Poems">
                {poems.length === 0 ? (
                  <p className="empty-section-message">No poems available yet.</p>
                ) : (
                  <div className="stories-grid">
                    {poems.map((poem) => (
                      <PoemCard
                        key={poem.documentId || poem.id}
                        poem={poem}
                        onOpen={openPoem}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      )}

      {/* Story Reader Modal */}
      {selectedStory && (
        <StoryReader story={selectedStory} onClose={closeStory} />
      )}

      {/* Poem Reader Modal */}
      {selectedPoem && (
        <PoemReader poem={selectedPoem} onClose={closePoem} />
      )}
    </div>
  );
}
