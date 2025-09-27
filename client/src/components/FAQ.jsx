import React from "react";
import { FiChevronDown } from "react-icons/fi";

const FAQ = () => {
  const faqData = [
    {
      question: "How does the game work?",
      answer:
        "The game is designed as a 1-2 player interactive experience where each player's choices directly influence how the story unfolds. Both players will share the same screen, collaborating and competing to shape the narrative.",
    },
    {
      question: "How do choices affect the game?",
      answer:
        "Choices can lead to different outcomes, alter character relationships, and influence the overall narrative direction, creating a unique experience for each player.",
    },
    {
      question: "Is the game purely focused on making decisions?",
      answer:
        "The game includes several mini-games that allow players to score points and perform specific tasks. These mini-games help players pass obstacles and progress further in the game.",
    },
    {
      question: "What if I get stuck on a puzzle/minigame or decision?",
      answer:
        "Depending on the game or choices you get a few tries and on some games there's just one chance. So play wisely!",
    },
    {
      question: "What platforms can I play this game on?",
      answer:
        "The game is compatible on PC. We suggest players to screencast while playing to get a better experience.",
    },
    {
      question: "How will the Winner be decided or what are the constraints?",
      answer:
        "The game features several constraints that will ultimately determine how players are judged, including time, money, health, and points. Players have a total of three lives, and their choices and performance in mini-games contributes to their overall score.",
    },
    {
      question: "The game froze. What should I do?",
      answer:
        "If the game freezes, refreshing the page or restarting the app usually helps. If issues persist, check your internet connection or clear your browser cache.",
    },
    {
      question: "How do I track my progress in the story?",
      answer:
        "Progress is tracked through a menu, where players can see completed tasks, current challenges, and any unlocked mini-games or story elements.",
    },
  ];

  return (
    <div className="flex justify-center py-20 px-4 min-h-screen">
      <div className="w-full max-w-3xl bg-white/10 backdrop-blur-md rounded-md p-8 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-white">
          Frequently Asked Questions
        </h1>

        {faqData.map((faq, index) => (
          <details
            key={index}
            className="mb-3 bg-white/10 backdrop-blur-sm rounded-md group cursor-pointer"
          >
            <summary className="flex justify-between items-center px-4 py-4 text-white text-lg sm:text-xl font-semibold list-none">
              {faq.question}
              <FiChevronDown className="text-2xl transition-transform duration-300 group-open:rotate-180" />
            </summary>

            <div className="px-4 pb-4 text-white/90 text-base sm:text-lg overflow-hidden animate-slideDown">
              {faq.answer}
            </div>
          </details>
        ))}

       
      </div>

      <style>
        {`
          details summary::-webkit-details-marker {
            display: none;
          }

          @keyframes slideDown {
            from { opacity: 0; max-height: 0; }
            to { opacity: 1; max-height: 1000px; }
          }

          details[open] .animate-slideDown {
            animation: slideDown 0.4s ease-in-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default FAQ;
