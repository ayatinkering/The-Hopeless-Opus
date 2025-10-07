import React, { useState } from 'react';
import logo from '../assets/logo.png';
import pravar from "../assets/pravar.jpg";
import pranav from "../assets/pranav.jpg";
import prayatshu from "../assets/prayatshu.jpeg";
import ashwini from "../assets/ashwini.jpeg";
import abhinav from "../assets/abhinav.webp";
import sara from "../assets/sara.jpeg";
import ayati from "../assets/ayati.jpeg";
import aryadurga from "../assets/aryadurga.jpg";
import medhavi from "../assets/medhavi.jpeg";
import sumeet from "../assets/sumeet.jpg";
import arsh from "../assets/arsh.jpeg";
import advait from "../assets/advait.jpeg";
import naman from "../assets/naman.jpeg";
import reneethra from "../assets/reneethra.jpeg";
import shlok from "../assets/shlok.jpeg";
import bhuvi from "../assets/bhuvi.jpeg";
import sam from "../assets/sam.jpeg";
import arko from "../assets/arko.jpeg";
import nav from "../assets/nav.jpeg";
import yash from "../assets/yash.jpeg";
import sid from "../assets/sid.png";
import vanshika from "../assets/vanshika.jpeg";

const About = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const teamSections = {
    "Core Committee": [
      { name: "Abhinav Kumar", funnyFact: "silent but goated", img: abhinav },
      { name: "Pranav Kumar", funnyFact: "2 Senior devs", img: pranav },
      { name: "Arkadeep Ganguly", funnyFact: "I zoned out", img: arko },
      { name: "Sara Mishra", funnyFact: "What did I miss!?", img: sara },
      { name: "Navaneeth Suresh", funnyFact: "ab mai itna bhi kuch khaas nahi hu", img: nav },
    ],
    "Web Dev Team": [
      { name: "Advait Balachandar", funnyFact: "Error: C2H5OH found", img: advait },
      { name: "Ashwini Rao", funnyFact: "Seniorest Dev (Real)", img: ashwini },
      { name: "Ayati Rauthan", funnyFact: ".... still thinking", img: ayati },
      { name: "Mohammad Arsh", funnyFact: "Backend: 1, Me: 0", img: arsh },
      { name: "Pravar Singh", funnyFact: "DSA in JSON", img: pravar },
      { name: "Prayatshu Misra", funnyFact: "Works on either Caffeine or Localhost:3000", img: prayatshu },
      { name: "Sumeet", funnyFact: "Full Stack Tester", img: sumeet },
    ],
    "Story Team": [
      { name: "Shlok Kasargod", funnyFact: "Sono Pazzi Questi Romani", img: shlok },
      { name: "Medhavi Mehta", funnyFact: "MINIONS!! TODAY WE STEAL THE MOON !!!", img: medhavi },
      { name: "Naman Kaushik", funnyFact: "Can I still quit?", img: naman },
      { name: "Bhuvi Sanga", funnyFact: "I can finally sleep...", img: bhuvi },
    ],
    "Design Team": [
      { name: "Samyak Jain", funnyFact: "Art machine with a mouse.", img: sam },
      { name: "Aaryadurga Bhat", funnyFact: "Eat Sleep Repeat (minus eat)", img: aryadurga },
      { name: "Vanshika Agarwal", funnyFact: "Procrastinating Productively", img: vanshika },
      { name: "Siddharth Prabhu", funnyFact: "Driven by curiosity. Grounded in creation", img: sid },
      { name: "Yash Agarwal", funnyFact: "Bringing life to pixels", img: yash },
      { name: "P.V. Reneethra", funnyFact: "80% chill, 20% lowkey chaos", img: reneethra },
    ],
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent successfully!');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="bg-black pt-10 text-white min-h-screen w-full font-sans overflow-x-hidden">
      {/* Main Content Container with consistent spacing */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* What is ACUMEN Section - Responsive with consistent spacing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 py-16 lg:py-20 items-center">
          <div className="w-full">
            <h2 className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-bold mb-6 lg:mb-8 leading-tight">
              WHAT IS <span className="text-red-500">ACUMEN</span>?
            </h2>
            <div className="space-y-6 text-gray-300 text-sm sm:text-base leading-relaxed">
              <p>
                TechTatva 2025 presents Acumen - Where Strategy, Puzzles, and Possibilities Unite!
                Step into the most exhilarating challenge of TechTatva: Acumen, a battleground of 
                intellect and imagination featuring two thrilling journeys - Tesseract and Hopeless Opus.
              </p>
              <p>
                From mind-bending puzzles to choices that shape your destiny,
                Acumen is not just a test - it's an adventure you won't forget.
                Try your hand at the prize pool of a whopping Rs. 28,000!
              </p>
            </div>
          </div>
          <div className="w-full flex items-center justify-center">
            <div className="w-full h-48 sm:h-56 lg:h-64 xl:h-72 bg-gray-800 rounded-lg border border-gray-700"></div>
          </div>
        </div>

        {/* What is Hopeless Opus Section - Responsive with consistent spacing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 py-16 lg:py-20 items-center">
          <div className="w-full flex items-center justify-center">
            <div className="w-full h-48 sm:h-56 lg:h-64 xl:h-72 bg-gray-800 rounded-lg border border-gray-700"></div>
          </div>
          <div className="w-full">
            <h2 className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-bold mb-6 lg:mb-8 leading-tight">
              WHAT IS <span className="text-red-500">Hopeless Opus</span>?
            </h2>
            <div className="space-y-6 text-gray-300 text-sm sm:text-base leading-relaxed">
              <p>
                Hopeless Opus is an immersive online RPG and choice-based story game crafted 
                by Acumen for TechTatva. Set in a world where every decision shapes your fate,
                it challenges players to think, adapt, and uncover the truth behind a mysterious,
                collapsing realm. With interactive storylines, mind-bending mini-games, and 
                branching paths that test logic and emotion alike, Hopeless Opus turns every choice 
                into a consequence - and every player into the author of their own destiny.
              </p>
            </div>
          </div>
        </div>

        {/* Meet The Core Team - Responsive Grid with Team Sections */}
        <div className="py-16 lg:py-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 leading-tight">
            Meet The 
            <span className="text-red-500"> Team</span>
          </h2>
          <p className="text-gray-400 text-center mb-6 lg:mb-8 max-w-2xl mx-auto text-sm sm:text-base px-4">
            Our dedicated team works tirelessly to create unforgettable
            experiences and challenging adventures for all participants.
          </p>

          <div className="space-y-8">
            {Object.entries(teamSections).map(([sectionTitle, members]) => {
              const totalCols = 5; // keep 5 cards per row
              const rows = [];

              for (let i = 0; i < members.length; i += totalCols) {
                rows.push(members.slice(i, i + totalCols));
              }

              return (
                <div key={sectionTitle} className="py-6">
                  <h3 className="text-xl sm:text-2xl font-semibold text-center mb-4 text-red-500">
                    {sectionTitle}
                  </h3>

                  <div className="space-y-6">
                    {rows.map((row, rowIndex) => {
                      // calculate empty slots to center last row
                      const emptySlots = totalCols - row.length;

                      return (
                        <div
                          key={rowIndex}
                          className={`flex justify-center gap-6`}
                        >
                          {/* Add spacer divs at start to center last row if needed */}
                          {emptySlots > 0 && (
                            <div className={`flex-[0_0_${(emptySlots * 100) / totalCols}%]`}></div>
                          )}

                          {row.map((member, index) => (
                            <div
                              key={index}
                              className="bg-gray-900 border border-gray-700 rounded-lg p-3 sm:p-5 text-center hover:scale-105 transition-transform duration-300 group flex-1 max-w-[180px]"
                            >
                              <img
                                src={member.img}
                                alt={member.name}
                                className="w-26 h-26 sm:w-32 sm:h-32 rounded-full mx-auto mb-4 object-cover object-center border-2 border-black group-hover:border-white transition-all duration-300"
                              />
                              <div className="text-sm sm:text-base font-bold mb-1">{member.name}</div>
                              <div className="text-xs sm:text-sm text-gray-400 mb-3 font-medium">
                                {member.designation}
                              </div>
                              <div className="text-base text-gray-500">
                                "{member.funnyFact}"
                              </div>
                            </div>
                          ))}

                          {/* Add spacer at end to maintain spacing if needed */}
                          {emptySlots > 0 && (
                            <div className={`flex-[0_0_${(emptySlots * 100) / totalCols}%]`}></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Section - Responsive with consistent spacing */}
        <div className="py-16 lg:py-20">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 lg:mb-12 text-center">
            CONTACT <span className="text-red-500">US</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="w-full">
              <div className="bg-gray-900 rounded-lg h-64 sm:h-72 lg:h-80 xl:h-96 p-4 sm:p-6 lg:p-8 border border-gray-800 flex items-center justify-center">
                <span className="text-gray-500">Map/Image Placeholder</span>
              </div>
            </div>
            
            <div className="w-full">            
              <h3 className="text-lg sm:text-xl font-semibold mb-4 lg:mb-6 text-red-500">
                Get In Touch
              </h3>
              <p className="text-gray-400 mb-6 text-sm sm:text-base leading-relaxed">
                Have any questions or issues that you want to bring to our attention? Feel free to drop us a message here, and we'll get back to you as soon as possible!
              </p>
              
              <div className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors text-sm sm:text-base"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors text-sm sm:text-base"
                />
                <textarea
                  name="message"
                  placeholder="Message"
                  rows="4"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors resize-none text-sm sm:text-base"
                ></textarea>
                <button
                  onClick={handleSubmit}
                  className="w-full bg-red-600 text-white py-3 rounded font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 text-sm sm:text-base"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;