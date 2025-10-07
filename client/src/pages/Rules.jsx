import React from 'react';
import background from "../assets/background.jpg";
import React from 'react';
import background from "../assets/background.jpg";

function Rules() {
  return (
    <div className="relative min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
      {/* Background Image */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${background})` }}
      ></div>

      {/* Translucent Overlay with Responsive Styling */}
      <div className="relative z-10 bg-white/10 bg-opacity-70 backdrop-blur-md rounded-lg max-w-4xl mx-auto p-6 sm:p-8 lg:p-10 shadow-xl">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-900">
          Community Rules
        </h1>
        <ol className="list-decimal pl-5 space-y-3 text-base sm:text-lg text-black leading-relaxed">
          <li>Respect all players – no harassment, hate speech, or discrimination.</li>
          <li>No cheating or exploiting – avoid hacks, bots, or unfair advantages.</li>
          <li>Play fair – follow the intended game mechanics.</li>
          <li>Keep content appropriate – no offensive usernames, avatars, or messages.</li>
          <li>Respect moderators and admins – their decisions help keep the community safe.</li>
          <li>One account per person – no multiple or fake accounts.</li>
          <li>Do not share your login – protect your account and progress.</li>
          <li>Report suspicious activity – help prevent scams and abuse.</li>
          <li>Be polite in chat/forums – avoid spamming, trolling, or flooding.</li>
          <li>Stay on topic – no unrelated advertising or self-promotion.</li>
          <li>Constructive criticism only – respect developers and other players’ efforts.</li>
          <li>Follow game-specific rules – each game may have its own guidelines.</li>
          <li>No griefing – don’t intentionally ruin the experience for others.</li>
          <li>Respect team play – cooperate in multiplayer modes.</li>
        </ol>
      </div>
    </div>
  );
}

export default Rules;