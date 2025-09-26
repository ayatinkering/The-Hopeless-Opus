import React from "react";
import Navbar from "../components/Navbar";
import LandingPage from "./Homepage/LandingPage";
import Countdown from "../components/Countdown";
import background from "../assets/background.jpg";
import CardSlider from "../components/CardSlider";
import FAQ from "../components/FAQ";

function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Background image */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${background})` }}
      ></div>

      {/* Dark overlay */}
      <div className="fixed inset-0 bg-black opacity-30"></div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <LandingPage />
        <Countdown targetDateProp={new Date("2025-10-08T00:00:00")} />
        <CardSlider/>
        <FAQ/>
      </div>
    </div>
  );
}

export default Home;
