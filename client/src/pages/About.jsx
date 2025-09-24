import gangster from "../assets/gangster.jpeg";

function About() {
  return (
    <div className="px-6 md:px-16 lg:px-32 py-16">
      {/* WHAT IS ACUMEN */}
      <section className="text-center mt-24 mb-20">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">WHAT IS ACUMEN?</h2>
        <p className="text-lg leading-relaxed max-w-5xl mx-auto text-gray-700 text-justify">
          Techtatva 2025 Acumen — Where Strategy, Puzzles, and Possibilities Unite! 
          Step into Techtatva 2025's most exhilarating challenge: Acumen. 
          A clash of intellect and strategy, featuring two thrilling journeys- Tesseract and Hopeless Opus. 
          From mind-bending puzzles to choices that shape your destiny, Acumen is not just a test, it's an adventure 
          you won't forget. Try your hand at the prize pool of a whopping Rs. 24,000!
        </p>
      </section>

      {/* WHAT IS HOPELESS OPUS */}
      <section className="text-center mb-20">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">WHAT IS HOPELESS OPUS?</h2>
        <p className="text-lg leading-relaxed max-w-5xl mx-auto text-gray-700 text-justify">
          Hopeless Opus is back and more thrilling than ever! Step into an immersive online experience 
          where every decision shapes your story! In this interactive storytelling event, your choices 
          hold the power to unlock new paths and outcomes as you tackle mini-games at steps. 
          The fate of the narrative is in your hands—choose wisely, and watch as your unique journey unfolds 
          in real-time. Be ready for twists, turns, and unexpected revelations, where every choice you make matters! 
          <br /> <br />
          <span className="font-semibold">Event Dates:</span> 17th-18th October, 2024
        </p>
      </section>

      {/* MEET THE CORE TEAM */}
      <section>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Meet The Core Team</h2>

        {/* Grid team layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {[...Array(12)].map((_, i) => {
            // Row 1 (i < 4) gets red border, others get blue
            const borderColor = i < 4 ? "border-red-500" : "border-blue-500";
            return (
              <div key={i}>
                <img
                  src={gangster}
                  alt={`Member ${i + 1}`}
                  className={`w-40 h-40 mx-auto mb-4 rounded-full object-cover border-4 ${borderColor}`}
                />
                <h3 className="text-xl font-semibold">Member {i + 1}</h3>
                <p className="text-gray-600">Designation</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default About;
