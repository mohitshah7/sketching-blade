import React, { useState, useEffect } from "react";
import "../styles/Stories.css";

export default function Stories() {
  const [storiesData, setStoriesData] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [chapterContent, setChapterContent] = useState("");
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch("/data/stories.json")
      .then((res) => res.json())
      .then((data) => setStoriesData(data))
      .catch((err) => console.error("Error loading stories.json:", err));
  }, []);

  const openStory = (story) => {
    setSelectedStory(story);
    setChapterContent("");
    setSelectedChapter(null);
    setIsModalOpen(true);
    document.body.classList.add("no-scroll");
  };

  const closeStory = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedStory(null);
      setChapterContent("");
      setSelectedChapter(null);
      document.body.classList.remove("no-scroll");
    }, 300); // wait for fade-out animation
  };

  const loadChapter = async (chapter) => {
    try {
      const res = await fetch(chapter.content);
      const text = await res.text();
      setChapterContent(text);
      setSelectedChapter(chapter.title);
    } catch (err) {
      console.error("Error loading chapter:", err);
    }
  };

  return (
    <div className="stories-container">
      <h1 className="stories-title">Stories & Poems</h1>

      {storiesData.length === 0 ? (
        <p className="loading">Loading stories...</p>
      ) : (
        <div className="stories-grid">
          {storiesData.map((story) => (
            <div
              key={story.id}
              className="story-card"
              onClick={() => openStory(story)}
            >
              <img
                src={story.coverImage}
                alt={story.title}
                className="story-thumbnail"
              />
              <div className="story-info">
                <h2>{story.title}</h2>
                <p className="story-type">{story.type}</p>
                <p className="story-desc">{story.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && selectedStory && (
        <div className={`story-modal ${isModalOpen ? "show" : ""}`}>
          <div className="story-modal-content">
            <button className="close-btn" onClick={closeStory}>
              ✖
            </button>

            <div className="modal-scroll">
              <img
                src={selectedStory.coverImage}
                alt={selectedStory.title}
                className="modal-cover"
              />
              <h2>{selectedStory.title}</h2>
              <p className="modal-type">{selectedStory.type}</p>
              <p className="modal-summary">{selectedStory.description}</p>

              <h3>Chapters</h3>
              <ul className="chapter-list">
                {selectedStory.chapters.map((chapter, idx) => (
                  <li
                    key={idx}
                    onClick={() => loadChapter(chapter)}
                    className={
                      selectedChapter === chapter.title ? "active" : ""
                    }
                  >
                    {chapter.title}
                  </li>
                ))}
              </ul>

              {chapterContent && (
                <div className="chapter-content">
                  <h4>{selectedChapter}</h4>
                  {chapterContent.split("\n").map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
