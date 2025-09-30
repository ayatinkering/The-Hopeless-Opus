import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Import your minigame components
import M1 from '../Minigames/M1'; // KnobPuzzle
import M2 from '../Minigames/M2'; // Cake Matching
import M3 from '../Minigames/M3'; // Chip Connection
import M4 from '../Minigames/M4'; // Cake Slicing
import M5 from '../Minigames/M5'; // Morse Code
import M6 from '../Minigames/M6'; // Cipher
import M7 from '../Minigames/M7'; // Token Puzzle

// --- Config ---
const TYPING_SPEED = 30;
const API_BASE = "http://localhost:5000/api/story";

// --- Minigame Mapper ---
const MINIGAME_COMPONENTS = {
  M1: M1,
  M2: M2,
  M3: M3,
  M4: M4,
  M5: M5,
  M6: M6,
  M7: M7,
};

const VisualNovelInterface = () => {
  const [storyData, setStoryData] = useState(null);
  const [fullDialogue, setFullDialogue] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [isSkipping, setIsSkipping] = useState(false);
  
  // Minigame state
  const [activeMinigame, setActiveMinigame] = useState(null);
  const [minigameConfig, setMinigameConfig] = useState(null);
  const [pendingStory, setPendingStory] = useState(null);

  const getToken = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

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

  useEffect(() => {
    if (isSkipping || !fullDialogue) return;

    if (displayedText.length < fullDialogue.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(fullDialogue.substring(0, displayedText.length + 1));
      }, TYPING_SPEED);
      return () => clearTimeout(timeout);
    }
  }, [displayedText, isSkipping, fullDialogue]);

  const fetchStoryById = async (storyId) => {
    try {
      const res = await axios.get(`${API_BASE}/${storyId}`, getToken());
      return res.data;
    } catch (err) {
      console.error("Error fetching story by ID:", err);
      return null;
    }
  };

  const handleChoiceClick = async (id, index) => {
    setSelectedChoice(id);

    try {
      const res = await axios.post(
        `${API_BASE}/current/choice`,
        { storyId: storyData.storyID, choiceIndex: index },
        getToken()
      );

      const { nextStory, minigame } = res.data;

      // Check if minigame was triggered
      if (minigame) {
        setActiveMinigame(minigame.id);
        setMinigameConfig(minigame.config[minigame.id]);
        
        // Store the next story to show after minigame
        setPendingStory(nextStory);
      } else if (nextStory) {
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

  const handleMinigameComplete = async (success) => {
    // Clear minigame state
    setActiveMinigame(null);
    setMinigameConfig(null);

    // If there's a pending story after the minigame, show it
    if (pendingStory) {
      setStoryData(pendingStory);
      setFullDialogue(pendingStory.text.join("\n"));
      setDisplayedText("");
      setIsSkipping(false);
      setPendingStory(null);
      setSelectedChoice(null);
    } else {
      // Otherwise fetch the current story from the backend
      try {
        const res = await axios.get(`${API_BASE}/current/me`, getToken());
        const { story } = res.data;

        if (story) {
          setStoryData(story);
          setFullDialogue(story.text.join("\n"));
          setDisplayedText("");
          setIsSkipping(false);
          setSelectedChoice(null);
        }
      } catch (err) {
        console.error("Error fetching story after minigame:", err);
      }
    }
  };

  const handleSkip = () => {
    setDisplayedText(fullDialogue);
    setIsSkipping(true);
  };

  const handleNext = async () => {
    if (!storyData) return;

    try {
      let nextStory = null;

      if (storyData.levelEnd) {
        const res = await axios.post(
          `${API_BASE}/level-end`,
          { storyId: storyData.storyID },
          getToken()
        );
        nextStory = res.data.nextStory;
      } else if (storyData.nextID?.length > 0) {
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

  const renderDialogue = () => (
    <div className="relative">
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

  // If minigame is active, render it instead
  if (activeMinigame) {
    const MinigameComponent = MINIGAME_COMPONENTS[activeMinigame];
    
    return (
      <div className="w-screen h-screen">
        {MinigameComponent ? (
          <MinigameComponent 
            config={minigameConfig} 
            onComplete={handleMinigameComplete}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-900">
            <div className="text-white text-2xl">Unknown minigame: {activeMinigame}</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-black flex items-end justify-center font-inter"
      style={{
        backgroundImage: storyData?.backgroundImg ? `url(${storyData.backgroundImg})` : 'linear-gradient(to bottom, #1a1a2e, #16213e)',
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