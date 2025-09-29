import React, { useState, useEffect } from 'react';
// IMPORTANT: To make this work, you MUST place your image file (ruins.jpg)
// in the SAME folder as this GameSlide.jsx file.
import ruinsImage from './ruins.jpg';

// --- Configuration Data (EASY CUSTOMIZATION AREA) ---
const BACKGROUND_IMAGE_URL = ruinsImage; 

const CHARACTER_NAME = "Joel";
const CURRENT_DIALOGUE = [
  "Twenty years after the outbreak, the cities are nothing but graveyards now.",
  "We've been surviving day by day, but supplies are running low. The infected are getting more aggressive.",
  "We need to make a decision soon...",
];

const CHOICE_BUTTONS = [
  { id: 1, text: "Search for supplies in the ruins", icon: "🔍" },
  { id: 2, text: "Fortify this position and wait", icon: "🧱" },
  { id: 3, text: "Try to contact other survivors", icon: "📞" },
  { id: 4, text: "Prepare to move to the coast", icon: "🧭" },
];

// ---------------------------------------------------

const FULL_DIALOGUE_TEXT = CURRENT_DIALOGUE.join('\n');
const TYPING_SPEED = 30; // ms per character

const VisualNovelInterface = () => {
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [displayedText, setDisplayedText] = useState("");
  const [isSkipping, setIsSkipping] = useState(false);

  // --- Typewriter Effect Logic ---
  useEffect(() => {
    if (isSkipping) return; // stop typing if skip was pressed

    if (displayedText.length < FULL_DIALOGUE_TEXT.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(FULL_DIALOGUE_TEXT.substring(0, displayedText.length + 1));
      }, TYPING_SPEED);
      return () => clearTimeout(timeout);
    }
  }, [displayedText, isSkipping]);
  // -------------------------------

  const handleChoiceClick = (id, text) => {
    setSelectedChoice(id);
    console.log(`Choice selected: ${text}`);
  };

  const handleSkip = () => {
    setDisplayedText(FULL_DIALOGUE_TEXT); // instantly show all text
    setIsSkipping(true);
  };

  const renderChoiceButtons = () => (
    <div className="flex flex-col space-y-3 w-full">
      {CHOICE_BUTTONS.map((choice) => (
        <button
          key={choice.id}
          onClick={() => handleChoiceClick(choice.id, choice.text)}
          className={`
            relative flex items-center justify-start py-1.5 px-4 rounded-3xl text-white text-base
            font-thin italic shadow-xl transition-all duration-200 ease-in-out border border-gray-600/50
            bg-white/40 backdrop-blur-sm w-80
            hover:scale-[1.02] hover:bg-white/60
            ${selectedChoice === choice.id ? 'ring-4 ring-blue-500 ring-opacity-70' : ''}
          `}
        >
          <span className="truncate">{choice.text}</span>
        </button>
      ))}
    </div>
  );

  const renderDialogue = () => (
    <div className="text-xl text-gray-200 font-light whitespace-pre-line">
      {displayedText}
      {displayedText.length < FULL_DIALOGUE_TEXT.length && (
        <span className="animate-pulse text-white">_</span>
      )}
    </div>
  );

  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-black flex items-end justify-center font-inter"
      style={{
        backgroundImage: `url(${BACKGROUND_IMAGE_URL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(0.85)'
      }}
    >
      {/* Black Fade Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

      {/* Top-right Buttons */}
      <div className="absolute top-6 right-6 flex space-x-3">
        {/* Map Button */}
        <div className="p-3 rounded-full bg-gray-800/70 border-2 border-gray-600 cursor-pointer hover:bg-gray-700/80 transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.553-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-1.553-.894L15 9m0 8V9m0 0l-6-3" />
          </svg>
        </div>
        {/* Backpack Button */}
        <div className="p-3 rounded-full bg-gray-800/70 border-2 border-gray-600 cursor-pointer hover:bg-gray-700/80 transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
      </div>

      {/* Main UI Container */}
      <div className="absolute bottom-[5vh] left-[5%] w-[90%] z-10"> 
        {/* Choices */}
        <div className="absolute right-4 z-20 w-80" style={{ bottom: '180px' }}>
          {renderChoiceButtons()}
        </div>
        
        {/* Name Tag */}
        <div 
          className="absolute z-30 text-white text-3xl italic font-bold" 
          style={{ textShadow: '0 0 8px rgba(0, 0, 0, 0.9)', bottom: 'calc(180px - 10px)', left: '25px' }}
        >
          {CHARACTER_NAME}
        </div>

        {/* Dialogue Content */}
        <div className="relative bg-black/50 backdrop-blur-sm w-full p-6 rounded-xl border-[3px] border-gray-500 min-h-[150px]">
          {renderDialogue()}
          {/* Skip Button */}
          {displayedText.length < FULL_DIALOGUE_TEXT.length && (
            <button
              onClick={handleSkip}
              className="absolute bottom-4 right-6 text-lg italic px-4 py-2 text-white rounded-xl hover:bg-gray-600/25 transition"
            >
              Skip &gt;&gt;
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisualNovelInterface;
