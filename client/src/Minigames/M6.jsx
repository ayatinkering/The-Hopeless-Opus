
import React, { useState, useEffect } from "react";
import backgroundImage from "../assets/cipherimage.png";

export default function M6({ config, onComplete, session, sessionApi }) {
  const cipherText = "Zvuv Whgga Xbhzap Vvthup";
  const correctAnswer = "theseromansarecrazy";

  const [input, setInput] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);

  
  const handleSubmit = () => {
    if (gameEnded) return;

    setSubmitted(true);
    if (input.toLowerCase().replace(/\s+/g, "") === correctAnswer) {
      setIsCorrect(true);
      setGameEnded(true);
      if (onComplete) {
        setTimeout(() => onComplete(true), 1000);
      }
    } else {
      setIsCorrect(false);
      setWrongCount((prev) => prev + 1);
    }
  };

  // Session integration for expiry and tries decrement on wrong attempts
  // Do not call onComplete(false) here — loader finalizes.
  useEffect(() => {
    if (!session || session.completed) return;
    if (session.remainingSeconds === 0) {
      setGameEnded(true);
    }
    if (typeof session.triesLeft === "number" && session.triesLeft <= 0) {
      setGameEnded(true);
    }
  }, [session]);

  useEffect(() => {
    if (wrongCount > 0 && !isCorrect && sessionApi?.decrementTry) {
      sessionApi.decrementTry();
    }
  }, [wrongCount, isCorrect, sessionApi]);

  return (
    <div
      className="min-h-screen relative font-serif"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "'IM Fell English', serif",
      }}
    >
      <div className="absolute inset-0"></div>

      {/* --- Wrong Answer Counter --- */}
      <div
        className="absolute top-16 left-4 text-lg font-semibold p-2 rounded-lg"
        style={{
          backgroundColor: "rgba(255,255,255,0.7)",
          color: "#9b111e",
          border: "2px solid #5c0000",
        }}
      >
        Wrong Attempts: {wrongCount}
      </div>

      <input
        type="text"
        placeholder="Enter your answer"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={gameEnded}
        className="absolute top-[50%] left-[57%] p-3 rounded-lg w-[20%] border border-[#a07855] focus:outline-none focus:ring-2 focus:ring-[#a07855] focus:border-[#a07855] shadow-md"
        style={{ color: "#8B0000" }}
      />

      <button
        onClick={handleSubmit}
        disabled={gameEnded}
        className="absolute top-[60%] left-[63.5%] px-6 py-3 rounded-lg bg-[#551414ff] hover:bg-[#432c09ff] text-[#f5f0e1] font-semibold transition shadow-[0_10px_25px_rgba(85,20,20,0.7)]"
      >
        Write
      </button>

      {/* --- Messages --- */}
      {gameEnded && isCorrect && (
        <p
          className="absolute top-[70%] left-[54.5%] text-2xl font-bold animate-pulse"
          style={{
            color: "#551414ff",
            textShadow: "0 0 10px rgba(65, 35, 35, 0.8)",
          }}
        >
          Congratulations, the veil is lifted.
        </p>
      )}
      {!gameEnded && submitted && !isCorrect && (
        <p
          className="absolute top-[70%] left-[52.5%] text-lg"
          style={{
            color: "#3f1010ff",
          }}
        >
          The riddle remains sealed. Return with sharper eyes.
        </p>
      )}
    </div>
  );
}
