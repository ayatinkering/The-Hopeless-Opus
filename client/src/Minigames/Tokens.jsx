import React, { useState, useEffect, useRef } from 'react';

// The PuzzleGame component is self-contained and ready to be imported.
const PuzzleGame = () => {
  // Hardcoded token data as provided by the user
  const initialTokens = [
    { id: 1, symbols: ['⚔️', '🐟'] },
    { id: 2, symbols: ['⚔️', '🐟'] },
    { id: 3, symbols: ['🍇', '🛡️'] },
    { id: 4, symbols: ['🐄', '🌿'] },
    { id: 5, symbols: ['🛡️', '🐟'] },
    { id: 6, symbols: ['🐟', '🛡️'] },
    { id: 7, symbols: ['🍇', '⚔️'] },
    { id: 8, symbols: ['🐟', '🌿'] },
    { id: 9, symbols: ['⚔️', '🍇'] },
    { id: 10, symbols: ['🐄', '🛡️'] },
    { id: 11, symbols: ['🍇', '🌿'] },
    { id: 12, symbols: ['⚔️', '🍇'] },
  ];

  // Define paths between slots (assuming user meant slot numbers for the paths)
  const initialPaths = [
    { from: 1, to: 3 },
    { from: 1, to: 4 },
    { from: 2, to: 3 },
    { from: 2, to: 4 },
    { from: 3, to: 4 },
    { from: 4, to: 5 },
    { from: 5, to: 9 },
    { from: 4, to: 6 },
    { from: 4, to: 9 },
    { from: 8, to: 10 },
    { from: 9, to: 10 },
    { from: 6, to: 11 },
    { from: 10, to: 11 },
    { from: 10, to: 12 },
    { from: 8, to: 12 },
    { from: 5, to: 7 },
    { from: 7, to: 6 },
    { from: 7, to: 8 },
  ];

  // Define the position of each slot for visual layout (adjusted to be under 85% top and more uniform)
  const slotPositions = {
    1: { top: '5%', left: '10%' },
    2: { top: '1%', left: '90%' },
    3: { top: '25%', left: '30%' },
    4: { top: '50%', left: '30%' },
    5: { top: '50%', left: '5%' },
    6: { top: '50%', left: '95%' },
    7: { top: '70%', left: '40%' },
    8: { top: '75%', left: '85%' },
    9: { top: '85%', left: '30%' }, 
    10: { top: '85%', left: '70%' }, 
    11: { top: '1%', left: '50%' }, 
    12: { top: '40%', left: '50%' }, 
  };

  // State variables for the game
  const [tokens, setTokens] = useState(initialTokens);
  const [slots, setSlots] = useState(
    Array.from({ length: 12 }, (_, i) => ({ id: i + 1, placedToken: null }))
  );
  const [draggedToken, setDraggedToken] = useState(null);
  const [draggedFromSlotId, setDraggedFromSlotId] = useState(null);
  const [pathColors, setPathColors] = useState({});
  const [greenPathsCount, setGreenPathsCount] = useState(0);

  // Ref to get the game board container's dimensions
  const gameBoardRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Update container size on mount and window resize
  useEffect(() => {
    const updateContainerSize = () => {
      if (gameBoardRef.current) {
        setContainerSize({
          width: gameBoardRef.current.offsetWidth,
          height: gameBoardRef.current.offsetHeight,
        });
      }
    };
    window.addEventListener('resize', updateContainerSize);
    updateContainerSize(); 

    return () => window.removeEventListener('resize', updateContainerSize);
  }, []);

  // Check win condition whenever slots or paths change
  useEffect(() => {
    const newPathColors = {};
    let newGreenPathsCount = 0;
    
    initialPaths.forEach(path => {
      const slotA = slots.find(s => s.id === path.from);
      const slotB = slots.find(s => s.id === path.to);

      const tokenA = slotA.placedToken;
      const tokenB = slotB.placedToken;
      
      let color = 'gray';
      
      if (tokenA && tokenB) {
        const hasMatch = tokenA.symbols.some(symbolA =>
          tokenB.symbols.includes(symbolA)
        );
        
        if (hasMatch) {
          color = 'red';
        } else {
          color = 'green';
          newGreenPathsCount++;
        }
      }
      newPathColors[`${path.from}-${path.to}`] = color;
    });

    setPathColors(newPathColors);
    setGreenPathsCount(newGreenPathsCount);
  }, [slots]);

  // Handle drag start event on a token
  const handleDragStart = (e, token, fromSlotId = null) => {
    setDraggedToken(token);
    setDraggedFromSlotId(fromSlotId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', token.id);
  };

  // Handle drop event on a slot
  const handleDrop = (e, slotId) => {
    e.preventDefault();
    if (!draggedToken) return;

    const targetSlotIndex = slots.findIndex(s => s.id === slotId);
    if (targetSlotIndex === -1) return;

    const newSlots = [...slots];
    const targetSlot = newSlots[targetSlotIndex];
    const oldTokenInSlot = targetSlot.placedToken;
    
    let updatedTokens = [...tokens];
    
    if (!draggedFromSlotId) {
        updatedTokens = updatedTokens.filter(t => t.id !== draggedToken.id);
    }
    
    if (oldTokenInSlot) {
        updatedTokens = [...updatedTokens, oldTokenInSlot].sort((a, b) => a.id - b.id);
    }

    if (!draggedFromSlotId || oldTokenInSlot) {
        setTokens(updatedTokens);
    }
    
    if (draggedFromSlotId) {
      const sourceSlot = newSlots.find(s => s.id === draggedFromSlotId);
      if (sourceSlot) {
        sourceSlot.placedToken = null;
      }
    }
    
    targetSlot.placedToken = draggedToken;

    setSlots(newSlots);
    setDraggedToken(null);
    setDraggedFromSlotId(null);
  };

  const handleDropOnTokenBar = (e) => {
    e.preventDefault();
    if (!draggedToken || !draggedFromSlotId) return;

    const newSlots = slots.map(slot =>
      slot.id === draggedFromSlotId ? { ...slot, placedToken: null } : slot
    );

    const newTokens = [...tokens, draggedToken].sort((a, b) => a.id - b.id);
    
    setSlots(newSlots);
    setTokens(newTokens);
    setDraggedToken(null);
    setDraggedFromSlotId(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const getPathData = (path) => {
    const fromSlot = slotPositions[path.from];
    const toSlot = slotPositions[path.to];
    
    const slotDiameter = 80; 
    const slotRadius = slotDiameter / 2;

    const fromX = (parseFloat(fromSlot.left) / 100) * containerSize.width + slotRadius;
    const fromY = (parseFloat(fromSlot.top) / 100) * containerSize.height + slotRadius;
    const toX = (parseFloat(toSlot.left) / 100) * containerSize.width + slotRadius;
    const toY = (parseFloat(toSlot.top) / 100) * containerSize.height + slotRadius;

    return `M ${fromX} ${fromY} L ${toX} ${toY}`;
  };

  const totalPaths = initialPaths.length;
  const isWin = greenPathsCount === totalPaths && totalPaths > 0;

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-900 text-gray-100 p-4 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-950 z-0"></div>
      
      {isWin && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-green-500 bg-opacity-80 rounded-lg shadow-lg backdrop-blur-sm">
          <div className="text-center p-8 bg-gray-900 rounded-xl shadow-2xl transform scale-105 transition-transform duration-500">
            <h2 className="text-5xl font-extrabold text-green-400 mb-4 animate-pulse">You Won!</h2>
            <p className="text-xl font-medium">All paths are green. Congratulations!</p>
          </div>
        </div>
      )}

      {/* Token Bar */}
      <div
        className="flex flex-wrap justify-center p-2 bg-gray-800 rounded-2xl shadow-xl border border-gray-700 w-full max-w-4xl z-10"
        onDragOver={handleDragOver}
        onDrop={handleDropOnTokenBar}
      >
        {tokens.length === 0 ? (
          <p className="text-xl text-gray-400 font-medium">No tokens left!</p>
        ) : (
          tokens.map(token => (
            <div
              key={token.id}
              className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-gray-700 m-1 sm:m-2 cursor-grab transform transition-transform duration-200 hover:scale-110 active:scale-95 shadow-md border-2 border-gray-600"
              draggable
              onDragStart={(e) => handleDragStart(e, token)}
            >
              <div className="text-2xl sm:text-3xl">
                {token.symbols[0]} {token.symbols[1]}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 text-lg font-semibold text-gray-300 z-10">
        Green Paths: <span className="text-green-400">{greenPathsCount}</span> / <span className="text-yellow-400">{totalPaths}</span>
      </div>

      {/* Game Board (slots and paths) */}
      <div
        ref={gameBoardRef}
        className="relative w-full max-w-5xl h-[70vh] mt-4 z-10"
        style={{ height: '70vh' }}
      >
        {/* SVG for paths */}
        <svg className="absolute inset-0 w-full h-full z-0">
          {initialPaths.map((path, index) => {
            const pathKey = `${path.from}-${path.to}`;
            const color = pathColors[pathKey] || 'gray';
            const strokeColor = color === 'green' ? '#10B981' : color === 'red' ? '#EF4444' : '#6B7280';
            const coloredStrokeWidth = color === 'green' || color === 'red' ? '12' : '6';
            const borderStrokeWidth = '16'; 
            
            return (
              <React.Fragment key={index}>
                <path
                  d={getPathData(path)}
                  stroke="#000000" 
                  strokeWidth={borderStrokeWidth}
                  fill="none"
                  className="transition-all duration-500"
                />
                <path
                  d={getPathData(path)}
                  stroke={strokeColor}
                  strokeWidth={coloredStrokeWidth}
                  fill="none"
                  className="transition-all duration-500"
                />
              </React.Fragment>
            );
          })}
        </svg>

        {/* Slots */}
        {slots.map(slot => (
          <div
            key={slot.id}
            className="absolute z-10 w-20 h-20 rounded-full flex items-center justify-center border-4 border-dashed border-gray-500 bg-gray-800 hover:bg-gray-700 transition-colors duration-200 transform hover:scale-105"
            style={slotPositions[slot.id]}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, slot.id)}
          >
            {slot.placedToken ? (
              <div
                className="w-full h-full flex flex-col items-center justify-center bg-gray-700 rounded-full shadow-lg cursor-move"
                draggable
                onDragStart={(e) => handleDragStart(e, slot.placedToken, slot.id)}
              >
                 <div className="text-3xl">
                  {slot.placedToken.symbols[0]}
                </div>
                <div className="text-3xl -mt-2">
                  {slot.placedToken.symbols[1]}
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PuzzleGame;
