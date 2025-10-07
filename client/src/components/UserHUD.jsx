import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ITEM_ICON = {
  script: '📜',
  journal: '📓',
  kumbh: '🏺',
  sword: '🗡️',
  pickaxe: '⛏️',
  axe: '🪓',
};

const UserHUD = ({ userState, activeMinigame }) => {
  const [openInstructions, setOpenInstructions] = useState(false);
  const instrRef = useRef(null);

  const INSTRUCTIONS = {
    M1: [
      'Your goal is to arrange all tiles in their correct positions as marked on each tile.',
      'Use the nodes at the intersections to rotate the surrounding tiles.',
      'Complete the puzzle before time runs out!'
    ],
    M2: [
      'The owner is confused about the pricing of each pastry. Help him get the right order.',
      'You have been given 7 pastries, out of which pricing of 2 pastries is known.',
      'Figure out the pricing for remaining pastries. Pricing is based on flavour; each flavour has distinct prices ranging from Rs0 to Rs40.',
      'Drag the pastry to its correct plate. The pricing of top 2 pastries is correct.'
    ],
    M3: [
      'The goal is to connect each chip with its neighbouring chips having specific no. of connections denoted on the chip.',
      'Connections have to be made either horizontally or vertically with each side having a maximum of 2 connections.',
      'No connection can be overlapped.',
      'Select the 2 chips to make a connection and click on the connection to remove it.',
      'The connections already given are correct, complete the remaining.'
    ],
    M4: [
      'There are two concentric circles, each divided into 8 sections. Your goal is to color all 16 sections using the token.',
      'You can perform two actions: Move the token 3 steps clockwise. Switch between the inner and outer circle.',
      'Each time the token lands on a section, its color toggles (colored ↔ uncolored).',
      'You can use the Reset button if needed — but it will cost you points.'
    ],
    M5: [
      'Listen to the audio file and crack the code!'
    ],
    M6: [
      'You have been given an encoded message, understand the cipher and decode it!'
    ],
    M7: [
      'To open the vault, place the token such that no neighbouring tokens share any symbols.',
      'Three tokens shown are correctly placed, place the remaining ones correctly!'
    ]
    ,
    M8: [
      'You have been given pieces of a letter. Figure out the code of the lock from the letter.',
      'Drag the letter a place on the box, it snaps into background if it is placed correctly.',
      'Decode the message. Few words have already been decoded, use the same logic to decode the others.',
      'Find the code to unlock the door.'
    ],
    M9A: [
      'A number crossword lies before you.',
      'Drag and drop the number tiles into their correct spots on the grid.',
      'Once every piece falls into place, read the marked cells carefully to uncover the hidden code.'
    ],
    M9B: [
      'Before you lies an audio mixer with 7 ports and 3 connections.',
      'Two speakers stand on either side, each whispering a set of instructions.',
      'Follow their cues carefully and connect the wires before time runs out — or the sound fades into silence.'
    ],
    M10: [
      'To escape the Hivemind, you must ascend through five levels.',
      'Balance the weight of each platform to rise higher.',
      'You have 30 seconds per level — stabilize the platform before time runs out!',
      'Drag and drop the blocks to shift the weight and restore balance.'
    ],
    M11: [
      'Your destination is Room 343. Use the map to navigate through the research facility’s maze-like halls.',
      'At each crossroad, every path will lead you to the next crossroad — but only the right sequence will take you closer to your goal.',
      'Choose wisely, for a wrong route will send you back to the start.',
      'Find the correct path and reach Room 343.'
    ],
    M12: [
      'A control panel flickers before you.',
      'Watch the four blinking lights carefully as they flash before you.',
      'Decode the sequence and enter the correct number for each panel to move forward.',
      'Pay close attention — the lights reveal more than they seem.'
    ],
    M13: [
      'A box lies trapped beneath a tangle of wooden planks.',
      'Slide the planks around to clear the green-highlighted center space.',
      'Free the path and uncover what’s hidden beneath.'
    ],
    M14: [
      'Your goal is to direct the light beam toward the symbol below.',
      'Use all the glass pieces to guide the light.',
      'Each piece can be placed in four orientations — vertical, horizontal, or diagonal.',
      'Diagonal pieces reflect the light left or right, while vertical and horizontal pieces either block or allow it to pass, depending on the light’s direction.',
      'Align them wisely — the symbol reveals itself only when illuminated.'
    ],
    M15: [
      'To activate the elevator, you must repair the control panel.',
      'Each square can be red or green — tap to toggle its color.',
      'Next to every row and column, you’ll see numbers showing the lengths of consecutive green lights in that line.',
      'For example, if it says 2 5, there are two green lights together and five green lights together, separated by at least one red light.',
      'Complete the pattern to restore the system.'
    ]
  };

  const points = userState?.points ?? 0;

  // Close instructions on outside click
  useEffect(() => {
    function onDocClick(e) {
      if (!openInstructions) return;
      if (instrRef.current && !instrRef.current.contains(e.target)) setOpenInstructions(false);
    }
    window.addEventListener('mousedown', onDocClick);
    return () => window.removeEventListener('mousedown', onDocClick);
  }, [openInstructions]);

  const navigate = useNavigate();

  // Exit button handler: clear token/user and go home
  const handleExit = () => {
    navigate('/');
  };

  // Axios interceptor to catch 401 (token expired) and force logout
  // Token expiry handling is centralized in App.jsx via a global axios interceptor

  return (
    <div className="absolute top-4 left-4 z-50 flex items-center space-x-3 select-none">
      <div className="px-3 py-2 bg-black/60 text-white rounded-md shadow flex items-center gap-3 border border-white/5">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-yellow-300" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a2 2 0 0 0-2 2v1H7a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-8a3 3 0 0 0-3-3h-3V4a2 2 0 0 0-2-2z" />
          </svg>
          <div className="text-sm leading-tight">
            <div className="text-xs text-gray-300">Points</div>
            <div className="font-semibold">{points}</div>
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Instructions button (minigame-specific) */}
        {activeMinigame && (
          <button
            onClick={() => setOpenInstructions(s => !s)}
            title="Show instructions"
            aria-expanded={openInstructions}
            className="px-3 py-2 bg-black/60 text-white rounded-md shadow hover:bg-black/80 transition"
          >
            ℹ️
          </button>
        )}

        {/* Instructions panel */}
        {activeMinigame && (
          <div
            ref={instrRef}
            style={{ transform: openInstructions ? 'translateY(0)' : 'translateY(-6px)', opacity: openInstructions ? 1 : 0, pointerEvents: openInstructions ? 'auto' : 'none' }}
            className={`absolute left-20 top-0 mt-12 w-80 bg-white text-black rounded-lg shadow-2xl p-3 z-60 transition-all duration-200 ease-out origin-top`}
            aria-hidden={!openInstructions}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-sm">Instructions ({activeMinigame})</div>
              <div className="flex items-center gap-2">
                <button onClick={() => setOpenInstructions(false)} className="text-sm text-gray-500 hover:text-gray-700">Close</button>
              </div>
            </div>

            <div className="text-sm text-gray-700 space-y-2">
              {(INSTRUCTIONS[activeMinigame] || ['No instructions available.']).map((line, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className="text-xs text-gray-500 mt-1">•</div>
                  <div className="text-xs leading-snug" dangerouslySetInnerHTML={{ __html: line }} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div>
        <button onClick={handleExit} className="text-sm text-red-600 hover:text-red-800">Exit</button>
      </div>
    </div>
  );
};

export default UserHUD;
