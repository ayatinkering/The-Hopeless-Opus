import express from 'express';
import {
  initializeMinigames,
  getAllMinigames,
  getMinigameState,
  decrementTries,
  resetTimer,
  startMinigame,
} from '../controllers/minigameController.js';

const router = express.Router();

// Create or ensure minigames
router.post('/init', initializeMinigames);

// Read operations
router.get('/', getAllMinigames);
router.get('/state', getMinigameState);

// Start a minigame (sets startedAt and initializes tries)
router.post('/start', startMinigame);

// Mutations (decrement tries and reset timer)
router.post('/decrement-tries', decrementTries);
router.post('/reset-timer', resetTimer);

export default router;
