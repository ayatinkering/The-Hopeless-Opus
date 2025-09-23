import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import GsapShowcase from './components/GsapShowcase.jsx'
import Profile from './pages/Profile.jsx'
import './index.css'
import CakeMatchingGame from './Minigames/CakeMatchingGame.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App /> <CakeMatchingGame />
      </BrowserRouter>
  </React.StrictMode>,
)
