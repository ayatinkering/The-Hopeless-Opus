import React, { useState } from "react";
import backgroundImage from "../assets/cipherimage.jpg"; // Your historical background

export default function Cipher() {
  const cipherText = "Zvuv Whgga Xbhzap Vvthup"; // +7 Caesar cipher of "Sono Pazzi Questi Romani"
  const correctAnswer = "theseromansarecrazy";
  const [input, setInput] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    if (input.toLowerCase().replace(/\s+/g, "") === correctAnswer) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

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
      {/* Background overlay */}
      <div className="absolute inset-0"></div>

      {/* Input */}
      <input
  type="text"
  placeholder="Enter your answer"
  value={input}
  onChange={(e) => setInput(e.target.value)}
  className="absolute top-[50%] left-[57%] p-3 rounded-lg w-[20%] border border-[#a07855] focus:outline-none focus:ring-2 focus:ring-[#a07855] focus:border-[#a07855] shadow-md"
  style={{ color: "#8B0000" }} // blood red text
/>

      {/* Button */}
      <button
        onClick={handleSubmit}
        className="absolute top-[60%] left-[63.5%] px-6 py-3 rounded-lg bg-[#551414ff] hover:bg-[#432c09ff] text-[#f5f0e1] font-semibold transition shadow-[0_10px_25px_rgba(85,20,20,0.7)"
      >
        Write
      </button>

      {/* Output messages */}
      {submitted && isCorrect && (
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
      {submitted && !isCorrect && (
        <p className="absolute top-[70%] left-[52.5%] text-lg text-[#e07a5f]"
        style={{
          color: "#3f1010ff",
        }}>
          The riddle remains sealed. Return with sharper eyes.
        </p>
      )}
    </div>
  );
}
