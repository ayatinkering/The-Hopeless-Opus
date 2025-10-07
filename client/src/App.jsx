import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';

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
import Visual from "./Minigames/Visual.jsx";
import M4 from "./Minigames/M4.jsx";
import { HexMinesweeperGame } from "./Minigames/Mines.jsx";
import M3 from "./Minigames/M3.jsx";
import M5 from "./Minigames/M5.jsx";
import M6 from "./Minigames/M6.jsx";
import ConcentricToggleGame from "./Minigames/M4.jsx";
import PuzzleGame from "./Minigames/M7.jsx";

function App() {
  return(
    <PuzzleGame/>
  )
}

export default App;
