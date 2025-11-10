import { useState } from 'react';
import '../styles/GodArts.css';
import GodArtPreview from '../components/GodArtPreview';

// 🖼️ Sample artworks (you'll add full data later)
const godArtworks = [
 {
  title: 'Bali Vadh',
  image: '/assets/god-arts/bali-vadh.jpg',
  description: "Bali Vadh is a key episode in the Ramayana where Lord Rama kills the monkey king Bali from hiding while Bali fights his brother Sugriva. Bali had wrongfully exiled Sugriva and taken his wife. Rama's act was done to uphold dharma and restore justice, helping Sugriva reclaim his rightful place."
},
{
  title: 'Bhishma',
  image: '/assets/god-arts/bhishma.jpg',
  description: "Bhishma, son of King Shantanu and Goddess Ganga, was known for his wisdom, valor, and vow of celibacy. As the grandsire of the Kuru dynasty, he fought for duty and was felled by Arjuna, choosing his time of death while lying on a bed of arrows."
},

  {
  title: 'Krishna as Charioteer',
  image: '/assets/god-arts/krishna.jpg',
  description: "Krishna, as Arjuna's charioteer in the Kurukshetra war, guided with divine wisdom and calm strength. He steered both the chariot and Arjuna’s mind, delivering the timeless teachings of the Bhagavad Gita."
},

 {
  title: 'Karna',
  image: '/assets/god-arts/karna.jpg',
  description: "Karna, son of Surya and Kunti, was known for his valor, loyalty, and unmatched generosity. Despite being abandoned at birth and later cursed, he remained steadfast and died a heroic death in the Kurukshetra war."
},

{
  title: 'Mahadev',
  image: '/assets/god-arts/mahadev.jpg',
  description: "Mahadev, or Lord Shiva, is the destroyer in the Hindu Trinity. A symbol of both peace and power, he protects dharma and destroys evil to preserve universal balance."
},


 {
  title: "Hanuman's Burning Tail",
  image: '/assets/god-arts/hanuman-fire.jpg',
  description: "Captured in Lanka, Hanuman's tail was set on fire. Using it as a weapon, he leapt across the city, setting Lanka ablaze — a bold act of courage and devotion to Lord Rama."
},

{
  title: "Krishna Vishwaroop",
  image: '/assets/god-arts/krishna-vishwaroop.jpg',
  description: "Faced with Arjuna's hesitation, Krishna reveals his Vishwaroop — a terrifying, divine form that devours time and creation. It serves as a brutal reality check: the war is inevitable, and Arjuna is just a tool of fate."
},

{
  title: 'Hanuman After Burning Lanka',
  image: '/assets/god-arts/hanuman-fire2.jpg',
  description: "After setting Lanka ablaze with his burning tail, Hanuman stands as a fierce force of justice. His destruction was not just revenge, but a divine warning to Ravana — devotion empowered by righteousness."
},

{
  title: 'Jatayu',
  image: '/assets/god-arts/jatayu.jpg',
  description: "Jatayu, the noble vulture, fought valiantly to stop Ravana from abducting Sita. Despite his age, he gave his life for righteousness, becoming a symbol of courage and devotion."
},

{
  title: 'Durga Maa',
  image: '/assets/god-arts/mataji.jpg',
  description: "Durga Maa symbolizes divine strength and protection. Created to defeat Mahishasura, she rides a lion, wielding celestial weapons. Her victory marks the triumph of good over evil and inspires unwavering courage."
},

 {
  title: 'Krishna The Divine Consciousness',
  image: '/assets/god-arts/kisna.jpg',
  description: "Krishna is the whisper in silence and the calm within chaos. He carries the weight of the world with a smile and guides the soul not through command but through awakening. His presence is the divine consciousness that lives within us all."
},

{
  title: 'Krishna Guiding Arjun',
  image: '/assets/god-arts/gita-gyaan.jpg',
  description: "As the charioteer of Arjun, Krishna steadied a conflicted heart. On a battlefield torn by duty and emotion, he became the voice of calm, guiding Arjun toward clarity, courage and inner truth."
},

{
  title: 'Ganpati Bappa',
  image: '/assets/god-arts/bappa.jpg',
  description: "He is the first name remembered and the last one forgotten. Ganpati Bappa removes obstacles with grace. In his presence is wisdom, joy and a quiet strength that comforts every beginning and every journey."
},


{
  title: 'Hanuman Meeting Maa Sita',
  image: '/assets/god-arts/hanuman-ashok.jpg',
  description: "In Ashok Vatika, Hanuman meets Maa Sita — not as a warrior, but as a messenger of hope. In that quiet moment, he brings her the strength of Ram's love and a silent vow of unwavering devotion."
},

];

function GodArts() {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleClose = () => setSelectedIndex(null);

  const handleNext = () => {
    setSelectedIndex((prevIndex) =>
      prevIndex === godArtworks.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setSelectedIndex((prevIndex) =>
      prevIndex === 0 ? godArtworks.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="god-arts-gallery">
      <h2 className="gallery-title">God Arts</h2>
      <div className="gallery-grid">
        {godArtworks.map((art, index) => (
          <div key={index} className="godart-card" onClick={() => setSelectedIndex(index)}>
            <img src={art.image} alt={art.title} className="godart-img" />
          </div>
        ))}
      </div>

      {selectedIndex !== null && (
        <GodArtPreview
          selectedArt={godArtworks[selectedIndex]}
          onClose={handleClose}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </div>
  );
}

export default GodArts;