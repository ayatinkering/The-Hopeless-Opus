import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ruinsImage from './ruins.jpg';

// --- Config ---
const BACKGROUND_IMAGE_URL = ruinsImage; 
const TYPING_SPEED = 30; // ms per character
const API_BASE = "http://localhost:5000/api/story"; // backend URL

const VisualNovelInterface = () => {
  const [storyData, setStoryData] = useState(null);
  const [fullDialogue, setFullDialogue] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [isSkipping, setIsSkipping] = useState(false);

  // --- Axios config with token ---
  const getToken = () => {
    const token = localStorage.getItem("token");
    return {
      headers: { Authorization: `Bearer ${token}` }
    };
  };

  // --- Fetch Current Story on mount ---
  useEffect(() => {
    const fetchCurrentStory = async () => {
      try {
        const res = await axios.get(`${API_BASE}/current/me`, getToken());
        const { story } = res.data;

        if (story) {
          setStoryData(story);
          setFullDialogue(story.text.join("\n"));
          setDisplayedText("");
          setIsSkipping(false);
        }
      } catch (err) {
        console.error("Error fetching current story:", err);
      }
    };

    fetchCurrentStory();
  }, []);

  // --- Typewriter effect ---
  useEffect(() => {
    if (isSkipping || !fullDialogue) return;

    if (displayedText.length < fullDialogue.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(fullDialogue.substring(0, displayedText.length + 1));
      }, TYPING_SPEED);
      return () => clearTimeout(timeout);
    }
  }, [displayedText, isSkipping, fullDialogue]);

  // --- Fetch next story by ID ---
  const fetchStoryById = async (storyId) => {
    try {
      const res = await axios.get(`${API_BASE}/${storyId}`, getToken());
      const story = res.data;
      if (story) {
        setStoryData(story);
        setFullDialogue(story.text.join("\n"));
        setDisplayedText("");
        setIsSkipping(false);
        setSelectedChoice(null);
      }
    } catch (err) {
      console.error("Error fetching story by ID:", err);
    }
  };

  // --- Handle Choice ---
  // --- Handle Choice ---
const handleChoiceClick = async (id, index) => {
  setSelectedChoice(id);

  try {
    const res = await axios.post(
      `${API_BASE}/current/choice`,
      { storyId: storyData.storyID, choiceIndex: index }, // send storyId too
      getToken()
    );

    const { nextStory } = res.data;

    if (nextStory) {
      setStoryData(nextStory);
      setFullDialogue(nextStory.text.join("\n"));
      setDisplayedText("");
      setIsSkipping(false);
      setSelectedChoice(null);
    }
  } catch (err) {
    console.error("Error making choice:", err);
  }
};


  // --- Handle Skip ---
  const handleSkip = () => {
    setDisplayedText(fullDialogue);
    setIsSkipping(true);
  };

  // --- Handle Next (for nextID) ---
  // --- Handle Next (for nextID / levelEnd) ---
const handleNext = async () => {
  if (!storyData) return;

  try {
    let nextStory = null;

    // If level ended, send storyData.storyID
    if (storyData.levelEnd) {
      const res = await axios.post(
        `${API_BASE}/level-end`,
        { storyId: storyData.storyID }, // send the story ID
        getToken()
      );
      nextStory = res.data.nextStory;
    } else if (storyData.choice?.length > 0) {
      nextStory = await fetchStoryById(storyData.nextID[0]);
    } else {
      nextStory = await fetchStoryById(storyData.nextID[0]);
    }

    if (nextStory) {
      setStoryData(nextStory);
      setFullDialogue(nextStory.text.join("\n"));
      setDisplayedText("");
      setIsSkipping(false);
      setSelectedChoice(null);
    }

  } catch (err) {
    console.error("Error updating user story on level end:", err);
  }
};
  // --- Render Choices ---
  const renderChoiceButtons = () => (
    <div className="flex flex-col space-y-3 w-full">
      {storyData?.choice?.map((choiceText, idx) => (
        <button
          key={idx}
          onClick={() => handleChoiceClick(idx + 1, idx)}
          className={`
            relative flex items-center justify-start py-1.5 px-4 rounded-3xl text-white text-base
            font-thin italic shadow-xl transition-all duration-200 ease-in-out border border-gray-600/50
            bg-white/40 backdrop-blur-sm w-80
            hover:scale-[1.02] hover:bg-white/60
            ${selectedChoice === idx + 1 ? 'ring-4 ring-blue-500 ring-opacity-70' : ''}
          `}
        >
          <span className="truncate">{choiceText}</span>
        </button>
      ))}
    </div>
  );

  // --- Render Dialogue ---
  // --- Render Dialogue ---
const renderDialogue = () => (
  <div className="relative">
    {/* Next button above the dialogue box */}
    {displayedText.length === fullDialogue.length && storyData?.nextID?.length > 0 && !storyData?.choice?.length && (
      <div className="flex justify-end mb-2">
        <button
          onClick={handleNext}
          className="text-lg italic px-4 py-2 text-white rounded-xl hover:bg-gray-600/25 transition"
        >
          Next &gt;&gt;
        </button>
      </div>
    )}

    <div className="text-xl text-gray-200 font-light whitespace-pre-line">
      {displayedText}
      {displayedText.length < fullDialogue.length && (
        <span className="animate-pulse text-white">_</span>
      )}
    </div>
  </div>
);


  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-black flex items-end justify-center font-inter"
      style={{
        backgroundImage: storyData?.backgroundImg ? `url(${storyData.backgroundImg})` : `url(${BACKGROUND_IMAGE_URL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(0.85)'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

      <div className="absolute bottom-[5vh] left-[5%] w-[90%] z-10"> 
        <div className="absolute right-4 z-20 w-80" style={{ bottom: '180px' }}>
          {renderChoiceButtons()}
        </div>

        <div 
          className="absolute z-30 text-white text-3xl italic font-bold" 
          style={{ textShadow: '0 0 8px rgba(0, 0, 0, 0.9)', bottom: 'calc(180px - 10px)', left: '25px' }}
        >
          {storyData?.characterName || " "}
        </div>

        <div className="relative bg-black/50 backdrop-blur-sm w-full p-6 rounded-xl border-[3px] border-gray-500 min-h-[150px]">
          {renderDialogue()}
          {displayedText.length < fullDialogue.length && (
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
