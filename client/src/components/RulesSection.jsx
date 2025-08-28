import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const rules = [
  {
    img: "/images/gemini-background.png",
    text: "Never wander alone in the dark...",
  },
  {
    img: "/images/gemini-generated2.png",
    text: "Beware the whispers you cannot see.",
  },
  {
    img: "/images/gemini-generated3.png",
    text: "Trust only the flicker of your lantern.",
  },
];

export default function RulesSection() {
  const sectionRef = useRef(null);
  const ruleRefs = useRef([]);
  const glitchRefs = useRef([]);
  const iconRef = useRef(null);

  useEffect(() => {
    // Animate rules on scroll (cascade)
    gsap.from(ruleRefs.current, {
      opacity: 0,
      y: 100,
      rotate: -5,
      duration: 1,
      stagger: 0.3,
      ease: "power4.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
      },
    });

    // Floating icon animation
    gsap.to(iconRef.current, {
      y: 25,
      rotate: 360,
      repeat: -1,
      yoyo: true,
      duration: 10,
      ease: "sine.inOut",
    });

    // Glitch effect (random flicker)
    glitchRefs.current.forEach((el) => {
      const glitch = () => {
        gsap.to(el, {
          x: () => Math.random() * 6 - 3,
          skewX: () => Math.random() * 8 - 4,
          color: () => (Math.random() > 0.5 ? "#f87171" : "#60a5fa"),
          duration: 0.08,
          yoyo: true,
          repeat: 3,
          onComplete: () => {
            setTimeout(glitch, 800 + Math.random() * 1200);
          },
        });
      };
      glitch();
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden px-4 py-16"
    >
      {/* Floating spooky icon */}
      <span
        ref={iconRef}
        className="absolute left-1/2 top-16 -translate-x-1/2 text-6xl md:text-7xl select-none pointer-events-none drop-shadow-[0_0_20px_#9333ea]"
        aria-hidden
      >
        👁️
      </span>

      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-10 md:gap-8 justify-center items-center z-10">
        {rules.map((rule, i) => (
          <div
            key={i}
            ref={(el) => (ruleRefs.current[i] = el)}
            className="group flex flex-col items-center bg-gray-900/70 border-2 border-transparent bg-clip-padding rounded-2xl shadow-xl p-8 backdrop-blur-md transition-all duration-500 hover:scale-105 hover:-rotate-1 relative overflow-hidden w-full md:w-1/3"
            style={{
              borderImage: "linear-gradient(45deg, #9333ea, #0ea5e9) 1",
            }}
          >
            <img
              src={rule.img}
              alt={`Rule ${i + 1}`}
              className="rule-image w-32 h-32 object-cover rounded-full border-4 border-purple-700 shadow-[0_0_40px_#9333ea99] mb-6 group-hover:scale-110 transition-transform duration-500 bg-black/60"
            />
            <div className="text-center">
              <span
                ref={(el) => (glitchRefs.current[i] = el)}
                className="text-2xl md:text-3xl font-bold text-purple-300 drop-shadow-[0_0_8px_#a78bfa] tracking-wide inline-block"
                style={{
                  fontFamily: "monospace",
                  letterSpacing: "0.05em",
                }}
              >
                {rule.text}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Atmospheric overlays */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/30 via-transparent to-black/90 z-0" />
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-10 z-0" />

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <span
          key={i}
          className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-70"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `float ${4 + Math.random() * 6}s infinite alternate`,
          }}
        ></span>
      ))}
    </section>
  );
}
