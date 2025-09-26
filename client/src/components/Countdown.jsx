import React, { useState, useEffect } from "react";

const Countdown = ({ targetDateProp }) => {
  const [time, setTime] = useState(0);

  // Use prop if passed, else default to 8th Oct 2025 00:00
  const targetDate = targetDateProp || new Date("2025-10-08T00:00:00");

  useEffect(() => {
    const updateTimer = () => {
      const currentTime = new Date().getTime();
      const targetTime = targetDate.getTime();
      const timeDiff = targetTime - currentTime;
      setTime(Math.max(timeDiff, 0));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const formatTime = (time) => {
    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
  };

  const { days, hours, minutes, seconds } = formatTime(time);

  const colon = (
    <div className="text-white font-light text-4xl sm:text-6xl md:text-8xl lg:text-9xl mx-1 sm:mx-2 select-none">
      :
    </div>
  );

const unitBlock = (value, label) => (
  <div className="flex flex-col items-center bg-black/20 px-3 sm:px-4 md:px-5 py-3 rounded-lg shadow-lg">
    <div className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-sans text-white tracking-wider">
      {value.toString().padStart(2, "0")}
    </div>
    <div className="mt-2 text-sm sm:text-base md:text-lg lg:text-xl text-gray-300">
      {label}
    </div>
  </div>
);

  return (
    <div className="text-center m-3 sm:m-5 p-4 sm:p-5 rounded-2xl shadow-lg">
      <div className="flex justify-center items-center flex-wrap gap-2 sm:gap-4">
        {unitBlock(days, "Days")}
        {colon}
        {unitBlock(hours, "Hours")}
        {colon}
        {unitBlock(minutes, "Minutes")}
        {colon}
        {unitBlock(seconds, "Seconds")}
      </div>
    </div>
  );
};

export default Countdown;
