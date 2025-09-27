import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { FiMenu, FiX } from "react-icons/fi"; // Hamburger & Close icons

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Leaderboard", path: "/leaderboard" },
    { name: "Contact Us", path: "/contact" },
    { name: "Rules", path: "/rules" },
  ];

  return (
    <nav className="w-full fixed top-0 z-50 backdrop-blur-sm border-b border-white/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center h-18">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link to="/">
            <img src={logo} alt="Hopeless Opus Logo" className="h-12 w-auto object-contain" />
          </Link>
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-18 text-white text-lg">
          {navItems.map((item, index) => (
            <li key={index} className="relative">
              <Link
                to={item.path}
                className="relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 hover:after:w-full"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Login Button (Desktop) */}
        <div className="hidden md:block">
          <Link
            to="/login"
            className="bg-[#9f1818] hover:bg-[#800b0b] text-white font-normal px-6 py-2 rounded-full transition text-base"
          >
            LOGIN
          </Link>
        </div>

        {/* Hamburger Menu Button (Mobile) */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
          >
            {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
{isOpen && (
  <div className="md:hidden backdrop-blur-sm  border-white/30">
    <ul className="flex flex-col items-center py-6 space-y-6 text-white text-lg">
      {navItems.map((item, index) => (
        <li key={index} className="relative">
          <Link
            to={item.path}
            onClick={() => setIsOpen(false)}
            className="relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 hover:after:w-full"
          >
            {item.name}
          </Link>
        </li>
      ))}
      <li>
        <Link
          to="/login"
          onClick={() => setIsOpen(false)}
          className="bg-[#9f1818] hover:bg-[#800b0b] text-white font-normal px-8 py-2 rounded-full transition text-base"
        >
          LOGIN
        </Link>
      </li>
    </ul>
  </div>
)}

    </nav>
  );
};

export default Navbar;
