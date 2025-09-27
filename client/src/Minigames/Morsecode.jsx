import React, { useState, useEffect, useRef } from "react";
import morseAudio from "../assets/morse.wav"; // your Morse audio file
import morseBg from "../assets/morse.png"; // background image

const Morsecode = () => {
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(90);
  const [gameOver, setGameOver] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  const audioRef = useRef(null);
  const objectUrlRef = useRef(null);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
    if (timeLeft === 0 && !gameOver) {
      setMessage("ACCESS DENIED");
      setGameOver(true);
      if (audioRef.current) audioRef.current.pause();
    }
  }, [timeLeft, gameOver]);

  // Submit logic
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!gameOver) {
      if (input.trim().toLowerCase() === "unlock") {
        setMessage("ACCESS GRANTED");
      } else {
        setMessage("ACCESS DENIED");
      }
      setGameOver(true);
      if (audioRef.current) audioRef.current.pause();
    }
  };

  // Toggle Play/Pause Morse audio
  const handleToggleMorse = async () => {
    if (!audioRef.current) {
      try {
        const resp = await fetch(morseAudio, { cache: "no-store" });
        const arrayBuffer = await resp.arrayBuffer();
        const blob = new Blob([arrayBuffer], { type: "audio/wav" });
        const url = URL.createObjectURL(blob);
        objectUrlRef.current = url;

        const audioEl = new Audio();
        audioEl.src = url;
        audioEl.loop = true;
        audioRef.current = audioEl;
      } catch (err) {
        console.error("Audio setup failed:", err);
        return;
      }
    }

    if (audioPlaying) {
      audioRef.current.pause();
      setAudioPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setAudioPlaying(true);
      } catch (err) {
        console.error("Audio playback failed:", err);
      }
    }
  };

  // Cleanup blob on unmount
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-black bg-cover bg-center"
      style={{ backgroundImage: `url(${morseBg})` }}
    >
      {/* Timer (top-right corner) */}
      <div className="absolute top-4 right-6 text-xl font-bold text-red-400">
        {timeLeft}s
      </div>

      {/* Input row with Play/Pause button, input, and submit */}
      <div className="absolute top-[50%] left-[47%] transform -translate-x-1/2 flex items-center gap-3">
        {/* Play/Pause button */}
        <button
          onClick={handleToggleMorse}
          disabled={gameOver}
          className={`px-4 py-2 rounded-md transition duration-300 ease-in-out shadow-md hover:scale-105 cursor-pointer
                      ${gameOver ? "bg-gray-600 text-gray-300 cursor-not-allowed" : "bg-gray-800 hover:bg-gray-700 text-white"}`}
        >
          {audioPlaying ? "❚❚" : "▶︎"}
        </button>

        {/* Input field */}
        <input
          type="text"
          placeholder="Enter the override code..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={gameOver}
          className="px-4 py-2 rounded-md bg-neutral-900 border border-gray-600 text-white 
                     placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
        />

        {/* Submit button */}
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={gameOver}
          className="px-6 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-white 
                     transition duration-300 ease-in-out shadow-md hover:scale-105 cursor-pointer"
        >
          Enter
        </button>
      </div>

      {/* Message below input */}
      <p
        className={`absolute top-[32%] left-[44%] transform -translate-x-1/2 text-xl font-bold ${
          message.includes("GRANTED") ? "text-[#2f6602]" : "text-[#731005]"
        }`}
      >
        {message}
      </p>
    </div>
  );
};

export default Morsecode;
