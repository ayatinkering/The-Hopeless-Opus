import React, { useState, useEffect, useCallback, useMemo } from 'react';

// --- CONFIGURATION AND INITIAL GRID SETUP ---

// Row lengths for the 7 rows: 8, 9, 8, 9, 8, 9, 8
const ROW_LENGTHS = [8, 9, 8, 9, 8, 9, 8];

// Hardcoded grid values provided by the user ('x' for mine, number for count)
const HARDCODED_GRID_VALUES = [
    ['0', '1', '2', 'x', '3', 'x', '1', '0'],
    ['1', '2', 'x', '4', 'x', '4', '2', '1', '1'],
    ['x', '3', '2', 'x', 'x', 'x', '2', 'x'],
    ['2', 'x', '2', '3', '3', '2', '1', '1', '1'],
    ['2', '2', 'x', 'x', '2', '1', '0', '1'],
    ['x', '3', '3', 'x', '4', 'x', '2', '1', 'x'],
    ['x', 'x', '3', 'x', '3', 'x', '1', '1'],
];

// New constant for starter tiles (0-based indices)
const STARTER_TILES_COORDS = [
    { r: 0, c: 0 }, { r: 0, c: 4 }, { r: 0, c: 7 }, // Row 1: 1, 5, 8
    { r: 1, c: 5 }, // Row 2: 6
    { r: 2, c: 1 }, // Row 3: 2
    { r: 3, c: 3 }, // Row 4: 4
    { r: 6, c: 4 }, // Row 7: 5
];

// Utility function to determine the 6 hexagonal neighbors (used for cascade reveal)
const getNeighbors = (r, c, grid) => {
    const neighbors = [];
    const isEvenRow = r % 2 === 0;

    let offsets;
    if (isEvenRow) {
        // Neighbors for even rows (r=0, 2, 4, 6 - 8 tiles)
        offsets = [
            [0, -1], [0, 1],    // Left, Right (Same row)
            [-1, -1], [-1, 0],  // Upper Left, Upper Right (Moving to 9-tile row above)
            [1, 0], [1, 1],     // Lower Left, Lower Right (Moving to 9-tile row below - FIXED)
        ];
    } else {
        // Neighbors for odd rows (r=1, 3, 5 - 9 tiles)
        offsets = [
            [0, -1], [0, 1],    // Left, Right (Same row)
            [-1, 0], [-1, 1],   // Upper Left, Upper Right (Moving to 8-tile row above)
            [1, 0], [1, 1],     // Lower Left, Lower Right (Moving to 8-tile row below)
        ];
    }

    for (const [dr, dc] of offsets) {
        const nr = r + dr;
        const nc = c + dc;

        // Check if neighbor coordinates are within the grid bounds
        if (
            nr >= 0 && nr < grid.length &&
            nc >= 0 && nc < grid[nr].length
        ) {
            neighbors.push(grid[nr][nc]);
        }
    }
    return neighbors;
};

// Function to create the grid using the hardcoded values
const createInitialGrid = () => {
    const grid = [];
    let safeTilesCount = 0;
    let totalMines = 0;

    // Create a Set for fast lookup of starter tiles
    const starterSet = new Set(STARTER_TILES_COORDS.map(coord => `${coord.r},${coord.c}`));

    for (let r = 0; r < ROW_LENGTHS.length; r++) {
        const row = [];
        const length = ROW_LENGTHS[r];
        for (let c = 0; c < length; c++) {
            const value = HARDCODED_GRID_VALUES[r][c];
            const isMine = value === 'x';
            
            const mineCount = isMine ? 0 : parseInt(value, 10);
            const isStarter = starterSet.has(`${r},${c}`); // Check if it's a starter tile

            if (!isMine) {
                safeTilesCount++;
            } else {
                totalMines++;
            }
            
            row.push({
                r,
                c,
                isMine: isMine,
                mineCount: mineCount,
                isRevealed: false,
                isFlagged: false,
                isStarter: isStarter, // Added starter flag
            });
        }
        grid.push(row);
    }
    
    return { grid, totalSafeTiles: safeTilesCount, totalMines }; 
};

// --- REACT COMPONENT ---

export function HexMinesweeperGame() {
    // Memoize the initial grid creation
    const { grid: initialGrid, totalSafeTiles, totalMines: initialTotalMines } = useMemo(createInitialGrid, []);

    const [grid, setGrid] = useState(initialGrid);
    const [gameState, setGameState] = useState('playing'); // 'playing', 'won', 'lost'
    const [revealedCount, setRevealedCount] = useState(0);

    // Check for win condition whenever the revealedCount changes
    useEffect(() => {
        if (gameState === 'playing' && revealedCount === totalSafeTiles) {
            setGameState('won');
        }
    }, [revealedCount, totalSafeTiles, gameState]);

    // Recursive function to reveal adjacent zero-count tiles (the Minesweeper "flood fill")
    const revealTileAndNeighbors = useCallback((r, c, currentGrid) => {
        const queue = [{ r, c }];
        // Deep copy the grid for immutable updates
        const newGrid = currentGrid.map(row => row.map(tile => ({ ...tile })));
        let newRevealedCount = 0;

        const processTile = (tile) => {
            if (!tile || tile.isRevealed || tile.isFlagged || tile.isMine) return;

            if (!newGrid[tile.r][tile.c].isRevealed) {
                newGrid[tile.r][tile.c].isRevealed = true;
                newRevealedCount++;
            }

            // If the tile is 0, add its unflagged neighbors to the queue
            if (tile.mineCount === 0) {
                const neighbors = getNeighbors(tile.r, tile.c, newGrid);
                neighbors.forEach(neighbor => {
                    if (!neighbor.isRevealed && !neighbor.isFlagged) {
                        queue.push(neighbor);
                    }
                });
            }
        };

        // BFS traversal
        const visited = new Set();

        while (queue.length > 0) {
            const tile = queue.shift();
            const key = `${tile.r},${tile.c}`;

            if (visited.has(key)) continue;
            visited.add(key);

            // Re-fetch the current tile from the new grid copy
            const currentTileInNewGrid = newGrid[tile.r][tile.c];
            processTile(currentTileInNewGrid);
        }

        return { newGrid, newRevealedCount };
    }, []);

    // Handle left-click on a tile
    const handleTileClick = useCallback((r, c) => {
        if (gameState !== 'playing') return;

        const tile = grid[r][c];
        if (tile.isRevealed || tile.isFlagged) return;

        if (tile.isMine) {
            // Game Over: Reveal all mines
            const newGrid = grid.map(row => row.map(t => ({ ...t, isRevealed: t.isMine ? true : t.isRevealed })));
            setGrid(newGrid);
            setGameState('lost');
            return;
        }

        if (tile.mineCount === 0) {
            // Trigger flood fill reveal
            const { newGrid, newRevealedCount } = revealTileAndNeighbors(r, c, grid);
            setGrid(newGrid);
            setRevealedCount(prev => prev + newRevealedCount);
        } else {
            // Single reveal
            const newGrid = grid.map(row => row.map(t => (t.r === r && t.c === c ? { ...t, isRevealed: true } : t)));
            setGrid(newGrid);
            setRevealedCount(prev => prev + 1);
        }

    }, [grid, gameState, revealTileAndNeighbors]);

    // Handle right-click (flagging)
    const handleFlag = useCallback((e, r, c) => {
        e.preventDefault();
        if (gameState !== 'playing') return;

        const tile = grid[r][c];
        if (tile.isRevealed) return;

        const newGrid = grid.map(row =>
            row.map(t => (t.r === r && t.c === c ? { ...t, isFlagged: !t.isFlagged } : t))
        );
        setGrid(newGrid);
    }, [grid, gameState]);

    const handleRestart = () => {
        const { grid: newGrid, totalSafeTiles: newTotalSafeTiles, totalMines: newTotalMines } = createInitialGrid();
        setGrid(newGrid);
        setRevealedCount(0);
        setGameState('playing');
    };

    const getTileContent = (tile) => {
        if (tile.isFlagged && !tile.isRevealed) {
            return '🚩';
        }
        if (tile.isRevealed) {
            if (tile.isMine) {
                return '💣';
            }
            if (tile.mineCount > 0) {
                return tile.mineCount;
            }
            return ''; // 0 count is empty
        }

        // Display star on unrevealed, unflagged starter tiles (using a Unicode star)
        if (tile.isStarter && !tile.isRevealed && !tile.isFlagged) {
            return '★'; 
        }
        
        return '';
    };

    // Tailwind colors for mine counts (Using dark standard colors for contrast on light background)
    const MINE_COUNT_COLORS = {
        1: 'text-blue-800', 
        2: 'text-green-800', 
        3: 'text-red-800', 
        4: 'text-purple-800', 
        5: 'text-black',
        6: 'text-black',
        7: 'text-black',
        8: 'text-black',
    };

    // --- Custom Hex Codes ---
    const UNREVEALED_COLOR = '#e4b547';
    const REVEALED_COLOR = '#ffe9b2';
    const BOMB_COLOR = '#e46947';


    // Component for a single Hexagon Tile
    const HexagonTile = ({ tile }) => {
        const content = getTileContent(tile);
        const mineColorClass = MINE_COUNT_COLORS[tile.mineCount] || 'text-gray-900'; 

        let visualClass = 'hexagon m-0.5 flex items-center justify-center cursor-pointer text-xl font-inter';
        let customStyle = {};

        if (tile.isRevealed) {
            if (tile.isMine) {
                // Bomb Tile: #e46947 (Red)
                customStyle.backgroundColor = BOMB_COLOR;
                visualClass += ' text-white shadow-inner'; 
            } else {
                // Revealed Tile: #ffe9b2 (Cream/Off-white)
                customStyle.backgroundColor = REVEALED_COLOR;
                visualClass += ' shadow-inner'; 
            }
        } else {
            // Unrevealed Tile: #e4b547 (Light Ochre)
            customStyle.backgroundColor = UNREVEALED_COLOR;
            visualClass += ' shadow-lg';
        }

        // Standard Hexagon geometry styles (Combined into customStyle)
        customStyle.width = '4rem'; 
        customStyle.height = '3.46rem';
        customStyle.clipPath = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';
        customStyle.transition = 'all 0.15s ease';

        return (
            <div
                // Unrevealed tiles use dark brown text (text-amber-950) for contrast.
                // Revealed tiles use the colored number text (mineColorClass).
                className={`${visualClass} ${tile.isRevealed ? mineColorClass : 'text-amber-950'}`}
                style={customStyle}
                onClick={() => handleTileClick(tile.r, tile.c)}
                onContextMenu={(e) => handleFlag(e, tile.r, tile.c)}
            >
                {content}
            </div>
        );
    };

    // Map the grid rows to JSX elements
    const gridDisplay = grid.map((row, r) => {
        // The staggering effect is achieved by shifting odd-length rows (r=1, 3, 5)
        const isOddRow = r % 2 !== 0;

        return (
            <div
                key={r}
                className={`flex justify-center -mt-[17px] ${isOddRow ? 'ml-0' : 'ml-[32px]'}`} // -mt for vertical overlap, ml for horizontal stagger
            >
                {row.map((tile, c) => (
                    <HexagonTile key={`${r}-${c}`} tile={tile} />
                ))}
            </div>
        );
    });

    return (
        // Page background set to a very light ochre/pale yellow
        <div className="flex flex-col items-center p-6 min-h-screen bg-amber-50 font-inter">
            <style>
                {`
                    /* Define Inter font globally if not already available */
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
                    body { font-family: 'Inter', sans-serif; }
                `}
            </style>
            
            {/* Header text in deep brown/umber */}
            <h1 className="text-4xl font-extrabold text-amber-950 mb-2 mt-4 tracking-tight">Hexagonal Mine Hunt</h1>
            {/* Paragraph text in a slightly lighter brown */}
            <p className="text-lg text-amber-900 mb-6">Mines: {initialTotalMines} | Safe Tiles Remaining: {totalSafeTiles - revealedCount}</p>

            <div className="mb-8 p-3 rounded-2xl shadow-2xl bg-white border border-gray-200">
                <div className="flex flex-col items-start min-w-[500px]">
                    {gridDisplay}
                </div>
            </div>

            <div className="flex flex-col items-center">
                {gameState !== 'playing' && (
                    <div className={`p-4 mb-4 rounded-xl font-bold text-2xl w-full text-center ${gameState === 'won' ? 'bg-green-100 text-green-700' : 'bg-white-100 text-red-700'}`}>
                        {gameState === 'won' ? 'YOU WON! All mines avoided.' : 'Game Over !  You hit a mine.'}
                    </div>
                )}
                <button
                    onClick={handleRestart}
                    // Button color set to deep brown
                    className="px-6 py-3 bg-amber-900 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-amber-950 transition duration-150 transform hover:scale-105"
                >
                    {gameState === 'playing' ? 'Restart Game' : 'Play Again'}
                </button>
                {/* Instructions text in a medium brown */}
                <div className="mt-4 text-sm text-amber-900 text-center">
                    <p>Left-Click to reveal. Right-Click to flag (or long-press on touch).</p>
                </div>
            </div>
        </div>
    );
}
