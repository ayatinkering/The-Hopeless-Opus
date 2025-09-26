import React from "react";
import background from "../assets/background.jpg";
import "./LandingPage.css"; // keep your button styles here

const LandingPage = () => {
  return (
    <div
      className="h-screen w-full bg-cover bg-center flex items-center relative"
      style={{ backgroundImage: `url(${background})` }}
    >
      {/* Dark overlay over the entire background */}
      <div className="absolute inset-0 bg-black opacity-30"></div>

      {/* Content goes above overlay */}
      <div className="relative ml-34 mt-26 max-w-2xl text-white z-10">
        {/* Heading */}
        <h1 className="text-8xl font-bold mb-4 drop-shadow-lg leading-none">
          <span className="block">HOPELESS</span>
          <span className="block">OPUS</span>
        </h1>

        {/* Paragraph */}
        <p className=" text-base text-justify leading-relaxed mb-7 drop-shadow-xl">
          Descend into the depths of consciousness where ancient archetypes
          awaken in the shadows of your mind. Navigate the labyrinth of dreams
          and face the inevitable darkness that lies within. Explore the
          shadows that shape your psyche and confront the enigmatic mysteries
          hidden in the corners of your consciousness.
        </p>

        {/* PLAY Button */}
        <button className="uiverse-button">
          <span>PLAY</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 66 43">
            <polygon points="39.58,4.46 44.11,0 66,21.5 44.11,43 39.58,38.54 56.94,21.5"></polygon>
            <polygon points="19.79,4.46 24.32,0 46.21,21.5 24.32,43 19.79,38.54 37.15,21.5"></polygon>
            <polygon points="0,4.46 4.53,0 26.42,21.5 4.53,43 0,38.54 17.36,21.5"></polygon>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
