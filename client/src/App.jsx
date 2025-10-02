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
import PuzzleGame from "./Minigames/M7";
import M6 from "./Minigames/M6";
import M1 from "./Minigames/M1";
import M3 from "./Minigames/M3";

function App() {
  return(
    <M1/>
  )
}

export default App;
