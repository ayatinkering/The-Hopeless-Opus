import React, { useState, useEffect } from "react";
import valImg from "../assets/TilesWall.jpg";
import MinigameTimer from "../components/MinigameTimer";

export default function M4({
  tileSize = 106.25,
  imageSrc = valImg,
  onComplete,
  showNumbers = true,
  session,
  sessionApi,
}) {
  const cols = 4;
  const rows = 5; // hardcoded 5 rows (20 tiles)
  const totalTiles = cols * rows; // 20
  const imageTiles = 16; // top 4x4 only

  const [tiles, setTiles] = useState([]);
  const [won, setWon] = useState(false);

  const sizePx = tileSize * cols; // width and height of 4x4 image portion

<<<<<<< HEAD
=======
  const largeArc = endAngle - startAngle <= Math.PI ? "0" : "1";

  return `M ${x1} ${y1} A ${r2} ${r2} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${r1} ${r1} 0 ${largeArc} 0 ${x4} ${y4} Z`;
}

export default function ConcentricToggleGame({ onComplete, session, sessionApi }) {
    // Outer: sectors 1, 4, and 6 colored
    const [outer, setOuter] = useState(() => {
        const arr = Array(SEGMENTS).fill(false);
        arr[1] = true;
        arr[4] = true;
        arr[6] = true;
        return arr;
    });

    // Inner: sectors 1 and 6 colored
    const [inner, setInner] = useState(() => {
        const arr = Array(SEGMENTS).fill(false);
        arr[1] = true;
        arr[6] = true;
        return arr;
    });

    // Token starts at outer ring, index 4
    const [token, setToken] = useState({ ring: "outer", idx: 4 });

  function toggleSegment(ring, idx) {
    if (ring === "outer") {
      setOuter((prev) => prev.map((val, i) => (i === idx ? !val : val)));
    } else {
      setInner((prev) => prev.map((val, i) => (i === idx ? !val : val)));
    }
  }

    function autoMove() {
  let current = { ...token };
  for (let step = 0; step < 3; step++) {
    current.idx = (current.idx + 1) % SEGMENTS;
  }
  setToken(current);
  toggleSegment(current.ring, current.idx);

  setTimeout(() => {
    if (checkWin(outer, inner)) setWinner(true);
  }, 0);
}

    function doSwitch() {
        const idx = token.idx;
        if (token.ring === "outer") {
            setInner((prev) => {
                const newInner = prev.map((val, i) => (i === idx ? !val : val));
                if (checkWin(outer, newInner)) setWinner(true);
                return newInner;
            });
            setToken({ ring: "inner", idx });
        } else {
            setOuter((prev) => {
                const newOuter = prev.map((val, i) => (i === idx ? !val : val));
                if (checkWin(newOuter, inner)) setWinner(true);
                return newOuter;
            });
            setToken({ ring: "outer", idx });
        }
    }

  function autoMove() {
    let current = { ...token };
    for (let step = 0; step < 3; step++) {
      // simple rule: move clockwise in same ring (outer only)
      current.idx = (current.idx + 1) % SEGMENTS;
    }
    setToken(current);
    toggleSegment(current.ring, current.idx);
  }

  const size = 400;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = 180;
  const innerR = 80;
  const [winner, setWinner] = useState(false);

    function checkWin(outer, inner) {
        return outer.every(Boolean) && inner.every(Boolean);
    }
  const sectors = Array.from({ length: SEGMENTS }, (_, i) => {
    const startAngle = (i * TAU) / SEGMENTS - Math.PI / 2;
    const endAngle = ((i + 1) * TAU) / SEGMENTS - Math.PI / 2;
    return {
      pathOuter: sectorPath(cx, cy, innerR, outerR, startAngle, endAngle),
      pathInner: sectorPath(cx, cy, 0, innerR, startAngle, endAngle),
      startAngle,
      endAngle,
    };
  });

    function tokenCoords(ring, idx) {
        const sector = sectors[idx];
        const angle = (sector.startAngle + sector.endAngle) / 2;

        let r;
        if (ring === "outer") {
            r = (innerR + outerR) / 2; // middle of outer ring
        } else {
            r = innerR / 2; // middle of inner ring
        }

        return polarToCartesian(cx, cy, r, angle);
    }

    async function resetGame() {
        // Decrement a try on reset if we still have tries and session API available
        if (session?.triesLeft > 0 && sessionApi?.decrementTry) {
          try {
            await sessionApi.decrementTry();
          } catch (e) {
            // Non-fatal; log only
            // console.warn('Failed to decrement try on reset', e);
          }
        }
        // Reset outer ring: sectors 1, 4, and 6 colored
        setOuter(() => {
            const arr = Array(SEGMENTS).fill(false);
            arr[1] = true;
            arr[4] = true;
            arr[6] = true;
            return arr;
        });

        // Reset inner ring: sectors 1 and 6 colored
        setInner(() => {
            const arr = Array(SEGMENTS).fill(false);
            arr[1] = true;
            arr[6] = true;
            return arr;
        });

        // Reset token to outer ring, index 4
        setToken({ ring: "outer", idx: 4 });

        // Reset winner flag
        setWinner(false);
    }

  const failedRef = useRef(false);
  // Fail on expiry or triesLeft depletion (triesLeft from session for M4)
>>>>>>> 94aa2144d30339657073f740381b84b1863f11fb
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
    if (won && onComplete) {
      setTimeout(() => onComplete(true), 2000);
    }
  }, [won, onComplete]);

  // Fail when timer expires (handled locally instead of loader)
  useEffect(() => {
    if (!session || session.completed) return;
    if (session.remainingSeconds === 0) {
      onComplete(false);
    }
  }, [session, onComplete]);

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
        <MinigameTimer
          remainingSeconds={session?.remainingSeconds ?? null}
          triesLeft={undefined}
        />
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
                  cursor: "pointer",
                }}
              />
            );
          })
        )}
      </div>

      <div style={{ marginTop: 16, color: "#bbb", fontSize: 13 }}>
        Click any knob to rotate the 2×2 block clockwise.
      </div>
    </div>
  );
}