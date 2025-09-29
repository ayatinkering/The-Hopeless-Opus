import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Leaderboard from "./pages/Leaderboard";
import Contact from "./pages/Contact";
import Rules from "./pages/Rules";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage"

function App() {
  return (
    <Router>
      {/* Navbar is always visible */}
      <Navbar />

      {/* Page content */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
    </Router>
  );
}

export default App;
