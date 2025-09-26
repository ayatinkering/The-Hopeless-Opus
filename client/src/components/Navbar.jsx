import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";

const Navbar = () => {
  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 fixed top-0 z-50 border-b border-white/30 backdrop-blur-xs">
      {/* Logo on the left */}
      <div className="flex items-center">
        <Link to="/">
          <img 
            src={logo} 
            alt="Hopeless Opus Logo" 
            className="h-12 w-auto object-contain"
          />
        </Link>
      </div>

      {/* Navigation Links */}
      <ul className="hidden md:flex space-x-24 text-white text-lg drop-shadow-2xl">
        {[
          { name: "Home", path: "/" },
          { name: "About Us", path: "/about" },
          { name: "Leaderboard", path: "/leaderboard" },
          { name: "Contact Us", path: "/contact" },
          { name: "Rules", path: "/rules" },
        ].map((item, index) => (
          <li key={index}>
            <Link
              to={item.path}
              className="relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 hover:after:w-full"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* Login Button */}
      <div>
        <Link
          to="/login"
          className="bg-[#9f1818] hover:bg-[#800b0b] text-white font-normal px-10 py-2 rounded-4xl transition text-base"
        >
          LOGIN
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
