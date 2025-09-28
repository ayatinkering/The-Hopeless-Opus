import React from "react";
import "./LandingPage.css"; // keep your button styles here

const LandingPage = () => {
  return (
<div className="h-screen w-full flex items-center relative">
  {/* Content goes above overlay */}
  <div
    className="
      relative 
      ml-6 mt-10       /* small screens */
      md:ml-16 md:mt-16 /* tablets */
      lg:ml-34 lg:mt-20 /* laptops/desktops */
      w-[85%] md:w-[70%] lg:w-[55%] 
      text-white z-10
    "
  >
    {/* Heading */}
    <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-6 drop-shadow-lg leading-none">
      <span className="block">HOPELESS</span>
      <span className="block">OPUS</span>
    </h1>

    {/* Paragraph */}
    <p className="text-base md:text-base lg:text-lg text-justify leading-relaxed mb-6 drop-shadow-2xl">
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
