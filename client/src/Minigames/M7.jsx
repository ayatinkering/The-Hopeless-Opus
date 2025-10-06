import React, { useState, useEffect, useRef, useCallback } from 'react';
import MinigameTimer from '../components/MinigameTimer';

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

// ---------------------------------------------------

// 🔑 Integrity Check Helper Functions 🔑
const generateChecksum = (value, version) => {
    const data = String(value) + String(version);
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
        const char = data.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
};

const M7 = ({ onComplete, session, sessionApi }) => {
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

    const timerRef = useRef(null);
    const isGameOver = useRef(false);
    const isTimeUp = !!(session && session.remainingSeconds === 0);

    useEffect(() => {
        if (!session || session.completed) return;
        if (session.remainingSeconds === 0) {
            onComplete && onComplete(false);
        }
    }, [session, onComplete]);

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
        const slotDiameter = 60; // Reduced from 80
        const slotRadius = slotDiameter / 2;

        const fromX = (parseFloat(fromSlot.left) / 100) * containerSize.width + slotRadius;
        const fromY = (parseFloat(fromSlot.top) / 100) * containerSize.height + slotRadius;
        const toX = (parseFloat(toSlot.left) / 100) * containerSize.width + slotRadius;
        const toY = (parseFloat(toSlot.top) / 100) * containerSize.height + slotRadius;

        return `M ${fromX} ${fromY} L ${toX} ${toY}`;
    };

    const totalPaths = initialPaths.length;
    const isWin = greenPathsCount === totalPaths && totalPaths > 0;

    useEffect(() => {
        if (isWin) {
            clearInterval(timerRef.current);
            isGameOver.current = true;
        }
    }, [isWin]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-100 p-2 sm:p-4 font-sans relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-950 z-0"></div>

            {(isWin || (session && session.remainingSeconds === 0)) && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-80 rounded-lg shadow-lg backdrop-blur-sm">
                    <div className="text-center p-4 sm:p-8 bg-gray-900 rounded-xl shadow-2xl transform scale-105 transition-transform duration-500 border-4 max-w-sm"
                        style={{ borderColor: isWin ? '#10B981' : '#EF4444' }}>
                        {isWin ? (
                            <>
                                <h2 className="text-3xl sm:text-5xl font-extrabold text-green-400 mb-2 sm:mb-4 animate-pulse">You Won! 🎉</h2>
                                <p className="text-base sm:text-xl font-medium">All paths are green. Congratulations!</p>
                            </>
                        ) : (
                            <>
                                <h2 className="text-3xl sm:text-5xl font-extrabold text-red-400 mb-2 sm:mb-4 animate-bounce">Time Up! ⏳</h2>
                                <p className="text-base sm:text-xl font-medium">Better luck next time.</p>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Token Bar */}
            <div
                className="relative flex flex-wrap justify-center p-2 bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl border border-gray-700 w-full max-w-3xl z-10"
                onDragOver={handleDragOver}
                onDrop={handleDropOnTokenBar}
            >
                {tokens.length === 0 ? (
                    <p className="text-sm sm:text-xl text-gray-400 font-medium p-2 sm:p-4">No tokens left!</p>
                ) : (
                    tokens.map(token => (
                        <div
                            key={token.id}
                            className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-gray-700 m-1 cursor-grab transform transition-transform duration-200 hover:scale-110 active:scale-95 shadow-md border-2 border-gray-600"
                            draggable={!isTimeUp && !isWin}
                            onDragStart={(e) => handleDragStart(e, token)}
                        >
                            <TokenDisplay imageName={token.image} />
                        </div>
                    ))
                )}

                <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2">
                    <MinigameTimer remainingSeconds={session?.remainingSeconds ?? null} />
                </div>
            </div>

            <div className="mt-2 text-sm sm:text-lg font-semibold text-gray-300 z-10">
                Green Paths: <span className="text-green-400">{greenPathsCount}</span> / <span className="text-yellow-400">{totalPaths}</span>
            </div>

            {/* Game Board */}
            <div
                ref={gameBoardRef}
                className="relative w-full max-w-4xl h-[50vh] sm:h-[55vh] mt-2 z-10"
            >
                <svg className="absolute inset-0 w-full h-full z-0">
                    {initialPaths.map((path, index) => {
                        const pathKey = `${path.from}-${path.to}`;
                        const color = pathColors[pathKey] || 'gray';
                        const strokeColor = color === 'green' ? '#10B981' : color === 'red' ? '#EF4444' : '#6B7280';
                        const coloredStrokeWidth = color === 'green' || color === 'red' ? '8' : '4';
                        const borderStrokeWidth = '12';

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
                        className={`absolute z-10 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border-2 sm:border-4 border-dashed border-gray-500 bg-gray-800 hover:bg-gray-700 transition-colors duration-200 transform ${!isTimeUp && !isWin ? 'hover:scale-105' : ''}`}
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

export default M7;