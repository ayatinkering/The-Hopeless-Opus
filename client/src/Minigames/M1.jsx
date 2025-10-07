import React, { useState, useEffect, useRef } from "react";
import MinigameTimer from "../components/MinigameTimer";

export default function M1({
  tileSize = 106.25,
  imageSrc = valImg,
  onComplete,
  showNumbers = true,
  session,
  sessionApi,
  config,
}) {
  const cols = 4;
  const rows = 5; // hardcoded 5 rows (20 tiles)
  const totalTiles = cols * rows; // 20
  const imageTiles = 16; // top 4x4 only

  const [tiles, setTiles] = useState([]);
  const [won, setWon] = useState(false);
  const [levelend, setLevelend] = useState(false);

  const sizePx = tileSize * cols; // width and height of 4x4 image portion

  useEffect(() => {
    // initial ordering 0..19
    const initial = Array.from({ length: totalTiles }, (_, i) => i);

    // scramble with random knob rotations
    let scrambled = [...initial];
    const scrambleMoves = Math.max(30, totalTiles * 6);
    for (let m = 0; m < scrambleMoves; m++) {
      const r = Math.floor(Math.random() * (rows - 1));
      const c = Math.floor(Math.random() * (cols - 1));
      scrambled = rotate2x2(scrambled, r, c, cols);
    }

    setTiles(scrambled);
    setWon(false);
  }, [tileSize, imageSrc]);

  useEffect(() => {
    if (won && onComplete && !levelend) {
      setLevelend(true);
      setTimeout(() => onComplete(true), 2000);
    }
  }, [won, onComplete, levelend]);

  // Fail when timer expires (handled locally instead of loader)
  useEffect(() => {
    if (!session || session.completed || levelend) return;
    if (session.remainingSeconds === 0) {
      setLevelend(true);
    }
    if (typeof session.triesLeft === 'number' && session.triesLeft <= 0) {
      setLevelend(true);
    }
  }, [session, levelend]);

  function rotate2x2(board, row, col, N) {
    const newBoard = board.slice();
    const idx = (r, c) => r * N + c;

    const a = idx(row, col);
    const b = idx(row, col + 1);
    const cIdx = idx(row + 1, col);
    const d = idx(row + 1, col + 1);

    const tmp = newBoard[a];
    newBoard[a] = newBoard[cIdx];
    newBoard[cIdx] = newBoard[d];
    newBoard[d] = newBoard[b];
    newBoard[b] = tmp;

    return newBoard;
  }

  function isSolved(board) {
    // first 16 must be in exact order
    for (let i = 0; i < imageTiles; i++) {
      if (board[i] !== i) return false;
    }
    // last 4 just need to be {16,17,18,19} in any order
    const lastFour = board.slice(16, 20);
    return (
      new Set(lastFour).size === 4 &&
      lastFour.every((x) => [16, 17, 18, 19].includes(x))
    );
  }

  function handleKnobClick(row, col) {
    if (won) return;
    const newTiles = rotate2x2(tiles, row, col, cols);
    setTiles(newTiles);
    if (isSolved(newTiles)) setWon(true);
  }

  return (
    <div
      style={{
        background: "#0D1A2F",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        padding: 20,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
        <h1 style={{ margin: 0 }}>Knob Rotation Puzzle</h1>
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-slate-800/60 rounded-full px-2 py-1 inline-block">
            <MinigameTimer
              remainingSeconds={session?.remainingSeconds ?? null}
              triesLeft={session?.triesLeft ?? null}
            />
          </div>
        </div>
      </div>

      {won && (
        <div
          style={{
            marginBottom: 12,
            padding: "8px 16px",
            borderRadius: 8,
            background: "rgba(196,164,132,0.12)",
            color: "#c4a484",
            boxShadow: "0 0 18px rgba(196,164,132,0.25)",
            fontWeight: "700",
          }}
        >
          🎉 Congratulations — the image is restored! 🎉
        </div>
      )}

      <div
        style={{
          position: "relative",
          width: `${cols * tileSize}px`,
          height: `${rows * tileSize}px`,
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, ${tileSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${tileSize}px)`,
          background: "#111",
        }}
      >
        {tiles.map((tileIndex, i) => {
          const isBottomRow = tileIndex >= imageTiles; // last 4
          const imgRow = Math.floor(tileIndex / cols);
          const imgCol = tileIndex % cols;

          return (
            <div
              key={i}
              style={{
                width: `${tileSize}px`,
                height: `${tileSize}px`,
                background: isBottomRow
                  ? "black"
                  : `url(${imageSrc})`,
                backgroundSize: `${sizePx}px ${sizePx}px`,
                backgroundPosition: isBottomRow
                  ? "center"
                  : `-${imgCol * tileSize}px -${imgRow * tileSize}px`,
                border: "1px solid rgba(255,255,255,0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                color: isBottomRow ? "white" : "red",
              }}
            >
              {showNumbers && tileIndex + 1}
            </div>
          );
        })}

        {Array.from({ length: rows - 1 }).map((_, r) =>
          Array.from({ length: cols - 1 }).map((_, c) => {
            const leftPct = ((c + 1) / cols) * 100;
            const topPct = ((r + 1) / rows) * 100;
            return (
              <button
                key={`knob-${r}-${c}`}
                onClick={() => handleKnobClick(r, c)}
                disabled={levelend}
                style={{
                  position: "absolute",
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                  transform: "translate(-50%, -50%)",
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  border: "2px solid black",
                  background:
                    "radial-gradient(circle at 35% 30%, white, rgba(200,200,200,0.8))",
                  cursor: levelend ? "not-allowed" : "pointer",
                }}
              />
            );
          })
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center mb-1 sm:mb-2">
        <button
          className="px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm md:text-base bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={autoMove}
        >
          Move (3 steps)
        </button>
        <button
          className="px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm md:text-base bg-green-500 text-white rounded hover:bg-green-600 transition"
          onClick={doSwitch}
        >
          Switch
        </button>
        <button
          className="px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm md:text-base bg-red-500 text-white rounded hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={resetGame}
          disabled={session?.triesLeft !== null && session?.triesLeft <= 0}
        >
          {session?.triesLeft !== null && session?.triesLeft <= 0
            ? "No Tries"
            : "Reset"}
        </button>
      </div>

      {/* Win Message */}
      {winner && (
        <div className="mt-1 sm:mt-2 text-lg sm:text-xl md:text-2xl font-bold text-white">
           You Won! 
        </div>
      )}
    </div>
  );
}