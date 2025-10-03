import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- Helper Component for the Token Image Display ---
// Import all images from assets
import BlueSilver from "../assets/BlueSilver.png";
import RedPurple from "../assets/RedPurple.png";
import CageGreen from "../assets/CageGreen.png";
import RedBlue from "../assets/RedBlue.png";
import PurpleSilver from "../assets/PurpleSilver.png";
import BlueGreen from "../assets/BlueGreen.png";
import CageRed from "../assets/CageRed.png";
import PurpleGreen from "../assets/PurpleGreen.png";

const images = {
    BlueSilver,
    RedPurple,
    CageGreen,
    RedBlue,
    PurpleSilver,
    BlueGreen,
    CageRed,
    PurpleGreen,
};

const TokenDisplay = ({ imageName }) => {
    const imageUrl = images[imageName];
    return (
        <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-full">
            <img
                src={imageUrl}
                alt={imageName}
                className="object-cover w-full h-full"
            />
        </div>
    );
};

// ---------------------------------------------------

// 🚨 CONFIGURATION 🚨
const GAME_VERSION = 8;
const TIMER_DURATION_MINUTES = 2; // Customisable time: 2 minutes

// ---------------------------------------------------

// 🔑 Integrity Check Helper Functions 🔑
// A simple, obfuscated hashing function for client-side integrity check.
const generateChecksum = (value, version) => {
    // Convert to string and mix with a secret 'salt' (the version number)
    const data = String(value) + String(version);
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
        const char = data.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
};

const PuzzleGame = () => {
    const initialTokens = [
        { id: 1, image: 'BlueSilver', symbols: ['symbol1', 'symbol2'] },
        { id: 2, image: 'BlueSilver', symbols: ['symbol1', 'symbol2'] },
        { id: 3, image: 'RedPurple', symbols: ['symbol3', 'symbol4'] },
        { id: 4, image: 'CageGreen', symbols: ['symbol5', 'symbol6'] },
        { id: 5, image: 'RedBlue', symbols: ['symbol4', 'symbol2'] },
        { id: 6, image: 'RedBlue', symbols: ['symbol2', 'symbol4'] },
        { id: 7, image: 'PurpleSilver', symbols: ['symbol3', 'symbol1'] },
        { id: 8, image: 'BlueGreen', symbols: ['symbol2', 'symbol6'] },
        { id: 9, image: 'PurpleSilver', symbols: ['symbol1', 'symbol3'] },
        { id: 10, image: 'CageRed', symbols: ['symbol5', 'symbol4'] },
        { id: 11, image: 'PurpleGreen', symbols: ['symbol3', 'symbol6'] },
        { id: 12, image: 'PurpleSilver', symbols: ['symbol1', 'symbol3'] },
    ];

    const initialPaths = [
        { from: 1, to: 3 }, { from: 1, to: 4 }, { from: 2, to: 3 }, { from: 2, to: 4 },
        { from: 3, to: 4 }, { from: 4, to: 5 }, { from: 5, to: 9 }, { from: 4, to: 6 },
        { from: 4, to: 9 }, { from: 8, to: 10 }, { from: 9, to: 10 }, { from: 6, to: 11 },
        { from: 10, to: 11 }, { from: 10, to: 12 }, { from: 8, to: 12 }, { from: 5, to: 7 },
        { from: 7, to: 6 }, { from: 7, to: 8 },
    ];

    const slotPositions = {
        1: { top: '5%', left: '10%' }, 2: { top: '1%', left: '90%' }, 3: { top: '25%', left: '30%' },
        4: { top: '50%', left: '30%' }, 5: { top: '50%', left: '5%' }, 6: { top: '50%', left: '95%' },
        7: { top: '70%', left: '40%' }, 8: { top: '75%', left: '85%' }, 9: { top: '85%', left: '30%' },
        10: { top: '85%', left: '70%' }, 11: { top: '1%', left: '50%' }, 12: { top: '40%', left: '50%' },
    };

    const [tokens, setTokens] = useState(initialTokens);
    const [slots, setSlots] = useState(
        Array.from({ length: 12 }, (_, i) => ({ id: i + 1, placedToken: null }))
    );
    const [draggedToken, setDraggedToken] = useState(null);
    const [draggedFromSlotId, setDraggedFromSlotId] = useState(null);
    const [pathColors, setPathColors] = useState({});
    const [greenPathsCount, setGreenPathsCount] = useState(0);

    // --- ⏲️ TIMER STATE & LOGIC ADDITION ⏲️ ---
    const totalTimeMs = TIMER_DURATION_MINUTES * 60 * 1000;
    const [timeRemainingMs, setTimeRemainingMs] = useState(totalTimeMs);
    const [isTimeUp, setIsTimeUp] = useState(false);
    const timerRef = useRef(null);
    
    // 🚨 NEW: Combined state for game end condition (either time or tampering) 🚨
    const isGameOver = useRef(false);

    // Function to handle the game ending due to time or tampering
    const endGame = useCallback(() => {
        if (isGameOver.current) return;
        
        clearInterval(timerRef.current);
        setTimeRemainingMs(0);
        setIsTimeUp(true);
        isGameOver.current = true;
    }, []);


    // Function to initialize the timer based on localStorage and version
    const initializeTimer = useCallback(() => {
        const storedVersion = localStorage.getItem('puzzleGameVersion');
        const storedStartTime = localStorage.getItem('puzzleGameStartTime');
        const storedChecksum = localStorage.getItem('puzzleGameChecksum');
        const currentTime = Date.now();

        if (storedVersion !== String(GAME_VERSION) || !storedStartTime) {
            // New game version or no timer started, so start a fresh timer
            const newStartTime = currentTime;
            const newChecksum = generateChecksum(newStartTime, GAME_VERSION);
            
            localStorage.setItem('puzzleGameVersion', String(GAME_VERSION));
            localStorage.setItem('puzzleGameStartTime', newStartTime);
            localStorage.setItem('puzzleGameChecksum', newChecksum);

            setTimeRemainingMs(totalTimeMs);
            setIsTimeUp(false);
            isGameOver.current = false;
            return totalTimeMs;
        } else {
            const startTime = Number(storedStartTime);

            // 🚨 INTEGRITY CHECK ON LOAD 🚨
            const expectedChecksum = generateChecksum(startTime, GAME_VERSION);
            if (Number(storedChecksum) !== expectedChecksum) {
                 // Tampering detected! Treat as time running out.
                endGame();
                return 0; 
            }

            const elapsedTime = currentTime - startTime;
            const remaining = totalTimeMs - elapsedTime;

            if (remaining <= 0) {
                endGame();
                return 0;
            } else {
                setTimeRemainingMs(remaining);
                setIsTimeUp(false);
                isGameOver.current = false;
                return remaining;
            }
        }
    }, [totalTimeMs, endGame]);

    // Initial timer setup and version check on mount
    useEffect(() => {
        const initialRemainingTime = initializeTimer();

        if (initialRemainingTime > 0) {
            timerRef.current = setInterval(() => {
                const storedStartTime = Number(localStorage.getItem('puzzleGameStartTime'));
                const storedChecksum = localStorage.getItem('puzzleGameChecksum');

                // 🚨 INTEGRITY CHECK ON INTERVAL 🚨
                const expectedChecksum = generateChecksum(storedStartTime, GAME_VERSION);
                if (Number(storedChecksum) !== expectedChecksum) {
                    // Tampering detected! Treat as time running out.
                    endGame();
                    return;
                }

                const elapsedTime = Date.now() - storedStartTime;
                const remaining = totalTimeMs - elapsedTime;

                if (remaining <= 0) {
                    endGame();
                } else {
                    setTimeRemainingMs(remaining);
                }
            }, 1000);
        }

        return () => clearInterval(timerRef.current);
    }, [initializeTimer, totalTimeMs, endGame]);

    // Format time remaining for display
    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };
    // ---------------------------------------------------

    const gameBoardRef = useRef(null);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

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
    }, [slots, initialPaths]);

    const handleDragStart = (e, token, fromSlotId = null) => {
        // Prevent drag and drop if game is over (win or time up/tampering)
        if (isTimeUp || isWin) {
            e.preventDefault();
            return;
        }
        setDraggedToken(token);
        setDraggedFromSlotId(fromSlotId);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', token.id);
    };

    const handleDrop = (e, slotId) => {
        e.preventDefault();
        // Prevent drop if game is over
        if (!draggedToken || isTimeUp || isWin) return; 

        if (draggedFromSlotId === slotId) {
            setDraggedToken(null);
            setDraggedFromSlotId(null);
            return;
        }

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
        // Prevent drop if game is over
        if (!draggedToken || !draggedFromSlotId || isTimeUp || isWin) return; 

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

    // Stop the timer if the game is won
    useEffect(() => {
        if (isWin) {
            clearInterval(timerRef.current);
            isGameOver.current = true;
        }
    }, [isWin]);


    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-gray-900 text-gray-100 p-4 font-sans relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-950 z-0"></div>

            {(isWin || isTimeUp) && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-80 rounded-lg shadow-lg backdrop-blur-sm">
                    <div className="text-center p-8 bg-gray-900 rounded-xl shadow-2xl transform scale-105 transition-transform duration-500 border-4"
                        style={{ borderColor: isWin ? '#10B981' : '#EF4444' }}>
                        {isWin ? (
                            <>
                                <h2 className="text-5xl font-extrabold text-green-400 mb-4 animate-pulse">You Won! 🎉</h2>
                                <p className="text-xl font-medium">All paths are green. Congratulations!</p>
                            </>
                        ) : (
                            <>
                                <h2 className="text-5xl font-extrabold text-red-400 mb-4 animate-bounce">Time Up! ⏳</h2>
                                <p className="text-xl font-medium">Better luck next time. Refresh the page to start over.</p>
                            </>
                        )}
                    </div>
                </div>
            )}

            
            {/* Token Bar */}
<div
    className="relative flex flex-wrap justify-center p-2 bg-gray-800 rounded-2xl shadow-xl border border-gray-700 w-full max-w-4xl z-10 mt-4"
    onDragOver={handleDragOver}
    onDrop={handleDropOnTokenBar}
>
    {tokens.length === 0 ? (
        <p className="text-xl text-gray-400 font-medium p-4">No tokens left!</p>
    ) : (
        tokens.map(token => (
            <div
                key={token.id}
                className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-700 m-1 sm:m-2 cursor-grab transform transition-transform duration-200 hover:scale-110 active:scale-95 shadow-md border-2 border-gray-600"
                draggable={!isTimeUp && !isWin}
                onDragStart={(e) => handleDragStart(e, token)}
            >
                <TokenDisplay imageName={token.image} />
            </div>
        ))
    )}

    {/* Timer Display inside token bar, bottom-right */}
    <div className="absolute bottom-2 right-2 text-2xl font-bold p-2 rounded-lg"
        style={{
            backgroundColor: 'rgba(55, 65, 81, 0.8)',
            color: isTimeUp ? '#EF4444' : timeRemainingMs <= 10000 ? '#FBBF24' : '#34D399',
            border: `2px solid ${isTimeUp ? '#EF4444' : '#34D399'}`,
        }}
    >
        {formatTime(timeRemainingMs)}
    </div>
</div>


            <div className="mt-4 text-lg font-semibold text-gray-300 z-10">
                Green Paths: <span className="text-green-400">{greenPathsCount}</span> / <span className="text-yellow-400">{totalPaths}</span>
            </div>

            {/* Game Board */}
            <div
                ref={gameBoardRef}
                className="relative w-full max-w-5xl h-[70vh] mt-4 z-10"
                style={{ height: '70vh' }}
            >
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

                {slots.map(slot => (
                    <div
                        key={slot.id}
                        className={`absolute z-10 w-20 h-20 rounded-full flex items-center justify-center border-4 border-dashed border-gray-500 bg-gray-800 hover:bg-gray-700 transition-colors duration-200 transform ${!isTimeUp && !isWin ? 'hover:scale-105' : ''}`}
                        style={slotPositions[slot.id]}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, slot.id)}
                    >
                        {slot.placedToken ? (
                            <div
                                className="w-full h-full flex items-center justify-center bg-gray-700 rounded-full shadow-lg cursor-move"
                                draggable={!isTimeUp && !isWin}
                                onDragStart={(e) => handleDragStart(e, slot.placedToken, slot.id)}
                            >
                                <TokenDisplay imageName={slot.placedToken.image} />
                            </div>
                        ) : null}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PuzzleGame;