import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ContactFooter from './components/ContactFooter';
import ScrollToTop from './components/ScrollToTop';

import Home from './pages/Home';
import Artworks from './pages/Artworks';
import Wallpapers from './pages/Wallpapers';
import Comics from './pages/Comics';
import ComicReader from './components/ComicReader';
import Stories from './pages/Stories';
import Contact from './pages/Contact';
import GodArts from './pages/GodArts';

function App() {
  const location = useLocation(); // 👈 get current route

  return (
    <div>
      <ScrollToTop />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/artworks" element={<Artworks />} />
        <Route path="/wallpapers" element={<Wallpapers />} />
        <Route path="/comics" element={<Comics />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/god-arts" element={<GodArts />} />
        <Route path="/comics/:comicId" element={<ComicReader />} />
      </Routes>

      {/* Show ContactFooter everywhere except on the Contact page */}
      {location.pathname !== "/contact" && <ContactFooter />}
    </div>
  );
}

export default App;
