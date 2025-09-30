import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Leaderboard from "./pages/Leaderboard";
import Contact from "./pages/Contact";
import Rules from "./pages/Rules";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Play from "./pages/Play";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import GameSlide from "./components/GameSlide";
function App() {
  // Top-level user state
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [token,setToken] = useState(localStorage.getItem("token"))

  return (
    <Router>
      {/* Navbar always visible */}
      <Navbar user={user} />

      {/* Page content */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/leaderboard"
          element={
            user ? (
              <Leaderboard currentUserId={user._id} token={token} />
            ) : (
              <Leaderboard />
            )
          }
        />
        <Route path="/contact" element={<Contact />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/play" element={<Play />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile setUser={setUser} />} />
      </Routes>
    </Router>
  );
}

export default App;
