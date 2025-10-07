import React, { useState, useEffect } from 'react'; // <-- Import useEffect
import { motion, AnimatePresence } from 'framer-motion';

// --- Pattern Definitions ---
const defaultImagePatterns = [
  { id: 'blank', url: '/images/blank.png' }, // Ensure you have a transparent/empty image file here
  { id: 'circle', url: '/images/circle.png' },
  { id: 'sum', url: '/images/sum.png' },
  { id: 'cross', url: '/images/cross.png' },
  { id: 'dtriangle', url: '/images/dtriangle.png' },
  { id: 'horns', url: '/images/horns.png' },
  { id: 'rectangle', url: '/images/rectangle.png' },
  { id: 'tick', url: '/images/tick.png' },
  { id: 'tie', url: '/images/tie.png' },
  { id: 'triangle', url: '/images/triangle.png' },
  { id: 'tvlines', url: '/images/tvlines.png' },
];

export default function PatternFillMinigame({ designSheet, patterns, questions }) {
  const availablePatterns = patterns || defaultImagePatterns;
  const availablePatternIDs = availablePatterns.map(p => p.id);
  const BLANK_ID = 'blank';
  const selectablePatternIDs = availablePatternIDs.filter(id => id !== BLANK_ID);
  
  const defaultQuestions = [
    { pattern: ["circle", "_", "tvlines"], correct: ["dtriangle"] },
    { pattern: ["triangle", "_", "circle", "cross"], correct: ["tie"] },
    { pattern: ["horns", "rectangle", "_", "tick"], correct: ["tie"] },
    { pattern: ["circle", "tick", "tie", "_"], correct: ["sum"] },
    { pattern: ["triangle", "tie", "tvlines", "tie", "_", "dtriangle"], correct: ["cross"] },
  ];

  const qs = questions || defaultQuestions;

  const totalBlanks = qs.reduce((sum, q) => sum + q.correct.length, 0);
  const INITIAL_TIME = 120; // 2 minutes in seconds

  const [userAnswers, setUserAnswers] = useState(Array(totalBlanks).fill(BLANK_ID));
  const [checked, setChecked] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showDesignSheet, setShowDesignSheet] = useState(false);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME); // **NEW STATE: Timer**

  // Options size remains HUGE
  const OPTION_SIZE_CLASSES = 'w-24 h-24'; 

  const getPatternUrl = (id) => availablePatterns.find(p => p.id === id)?.url;

  // **NEW EFFECT: Timer Countdown**
  useEffect(() => {
    // Only start the timer if the game hasn't been submitted yet
    if (submitted) {
      return;
    }

    if (timeLeft <= 0) {
      handleSubmit(); // Auto-submit when time runs out
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    // Cleanup function to clear the interval when the component unmounts or re-renders
    return () => clearInterval(timerId);
  }, [timeLeft, submitted]); // Re-run effect when timeLeft or submitted state changes

  function cyclePattern(index) {
    // Disable interaction if the game is submitted or sheet is visible
    if (submitted || showDesignSheet) return; 

    setUserAnswers(prev => {
      const next = [...prev];
      let currentId = next[index];
      const selectableIDs = selectablePatternIDs;
      
      if (currentId === BLANK_ID) {
          next[index] = selectableIDs[0];
      } else {
          const currentIndex = selectableIDs.indexOf(currentId);
          const nextIndex = (currentIndex + 1);
          next[index] = nextIndex < selectableIDs.length ? selectableIDs[nextIndex] : BLANK_ID;
      }

      return next;
    });
    setChecked(false);
  }

  function handleSubmit() {
    // Prevent accidental double-submission
    if (submitted) return;
    
    setChecked(true);
    setSubmitted(true);
  }

  function resetGame() {
    setUserAnswers(Array(totalBlanks).fill(BLANK_ID));
    setChecked(false);
    setSubmitted(false);
    setTimeLeft(INITIAL_TIME); // Reset the timer
  }

  // compute correctness
  let flatIndex = 0;
  const correctnessMap = [];
  qs.forEach(q => {
    q.correct.forEach(() => {
      correctnessMap.push(userAnswers[flatIndex] === q.correct[flatIndex]);
      flatIndex++;
    });
  });

  const correctCount = correctnessMap.filter(Boolean).length;
  const allCorrect = correctCount === totalBlanks;

  // Helper to format time: 120 -> "2:00", 59 -> "0:59"
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Pattern Fill Minigame</h2>
        <div className={`text-3xl font-mono p-2 rounded ${timeLeft <= 30 && !submitted ? 'text-red-600 bg-red-100' : 'text-gray-800'}`}>
          ⏳ {formatTime(timeLeft)}
        </div>
      </div>

      {/* Button to toggle the design sheet */}
      <button
        onClick={() => setShowDesignSheet(prev => !prev)}
        disabled={submitted} // Disable viewing sheet after submission
        className={`px-4 py-2 mb-4 font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 ${
          showDesignSheet 
            ? 'bg-rose-500 text-white hover:bg-rose-600'
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
      >
        {showDesignSheet ? 'Hide Design Sheet & Play' : 'View Design Sheet'}
      </button>

      {/* Conditional Rendering and Grid Change */}
      <div className={`grid gap-6 ${showDesignSheet ? 'md:grid-cols-1' : 'md:grid-cols-3'}`}>
        
        {/* Left: Design Sheet (Toggled) */}
        {showDesignSheet ? (
          <motion.div
            key="design-sheet-visible"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="md:col-span-1 bg-white rounded-2xl shadow p-3"
          >
            <h3 className="font-semibold mb-2">Design Sheet</h3>
            <img
              src={designSheet || "https://res.cloudinary.com/dzntiuwyr/image/upload/v1759769093/mg_pattern_oflvqn.jpg"}
              alt="Design sheet"
              className="rounded-lg w-full object-contain"
            />
          </motion.div>
        ) : (
          /* Right: Questions Panel (Takes up constrained space) */
          <motion.div 
            key="questions-panel-visible"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="md:col-span-3 bg-white rounded-2xl shadow p-4 flex flex-col gap-5"
          >
            <h3 className="font-semibold text-lg">Question Panel</h3>
            
            {qs.map((q, qIndex) => {
              let blankCounter = 0;
              return (
                <div key={qIndex} className="p-3 border rounded-lg flex flex-wrap gap-4 items-center justify-center">
                  {q.pattern.map((symbolIdOrBlank, i) => {
                    if (symbolIdOrBlank === '_') {
                      const globalBlankIndex = qs
                        .slice(0, qIndex)
                        .reduce((sum, qq) => sum + qq.correct.length, 0) + blankCounter;
                      
                      const userValId = userAnswers[globalBlankIndex];
                      const userValUrl = getPatternUrl(userValId); 
                      
                      blankCounter++;

                      const isBlank = userValId === BLANK_ID;
                      const neutralStyle = isBlank ? 'border-gray-400 bg-white' : 'border-gray-300';

                      return (
                        <motion.button
                          key={`blank-${qIndex}-${i}`}
                          onClick={() => cyclePattern(globalBlankIndex)}
                          whileTap={{ scale: 0.9 }}
                          // Disable interaction if submitted or viewing sheet
                          disabled={submitted || showDesignSheet} 
                          className={`${OPTION_SIZE_CLASSES} p-1 rounded-lg border flex items-center justify-center transition-all duration-300 ${
                            submitted ? 'opacity-70 cursor-not-allowed' : ''
                          } ${
                            showDesignSheet ? 'opacity-50 cursor-not-allowed' : ''
                          } ${
                            `hover:bg-gray-100 ${neutralStyle}`
                          }`}
                        >
                          <AnimatePresence mode="wait">
                            {!isBlank && (
                              <motion.img
                                key={userValId}
                                src={userValUrl}
                                alt={`Pattern ${userValId}`}
                                className="w-full h-full object-contain"
                                initial={{ opacity: 0, rotateY: 90 }}
                                animate={{ opacity: 1, rotateY: 0 }}
                                exit={{ opacity: 0, rotateY: -90 }}
                                transition={{ duration: 0.25 }}
                              />
                            )}
                          </AnimatePresence>
                        </motion.button>
                      );
                    }
                    
                    // For fixed symbols (not blanks)
                    const fixedSymbolUrl = getPatternUrl(symbolIdOrBlank);
                    
                    return (
                      <div key={`sym-${qIndex}-${i}`} className={`${OPTION_SIZE_CLASSES} flex items-center justify-center`}>
                        <img
                            src={fixedSymbolUrl}
                            alt={`Symbol ${symbolIdOrBlank}`}
                            className="w-full h-full object-contain"
                        />
                      </div>
                    );
                  })}
                </div>
              );
            })}

            <div className="flex gap-3 mt-2">
              <button
                onClick={handleSubmit}
                // Disable if already submitted or viewing sheet
                disabled={submitted || showDesignSheet} 
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                Submit Answers
              </button>
              <button
                onClick={resetGame}
                // Disable if viewing sheet
                disabled={showDesignSheet} 
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                Reset
              </button>
            </div>
            
            {submitted && (
              <div className={`mt-4 p-3 rounded-lg font-bold text-lg ${allCorrect ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'}`}>
                {allCorrect ? 'All Correct.' : 'Incorrect. Keep trying.'}
                {timeLeft <= 0 && <span className="ml-2">(Time's up!)</span>}
              </div>
            )}

          </motion.div>
        )}
      </div>
    </div>
  );
}