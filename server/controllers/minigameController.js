import Minigame from '../models/minigameSchema.js';

// Centralized helper: check all minigames for expired timers and decrement tries for M4-M6 when expired
export const checkAndExpireTimers = async () => {
  try {
    const now = Date.now();
    const minigames = await Minigame.find({});
    const changed = [];
    for (const mg of minigames) {
      // if a startedAt exists and timer is set, evaluate expiry
      if (mg.startedAt && mg.timer) {
        const elapsed = Math.floor((now - mg.startedAt) / 1000); // seconds elapsed
        if (elapsed >= mg.timer) {
          // Timer expired
          if (["M4", "M5", "M6"].includes(mg.minigameId)) {
            if (typeof mg.tries === 'number' && mg.tries > 0) {
              mg.tries -= 1;
            }
          }
          // clear startedAt so we don't repeatedly decrement
          delete mg.startedAt;
          changed.push(mg);
        }
      }
    }
    if (changed.length) {
      for (const m of changed) await m.save();
    }
    return changed.length;
  } catch (err) {
    console.error('checkAndExpireTimers error:', err);
    throw err;
  }
};

// Combined endpoints using schema values
export const initializeMinigames = async (req, res) => {
  try {
    const minigameIds = ["M1", "M2", "M3", "M4", "M5", "M6", "M7"];
    const created = [];
    for (const id of minigameIds) {
      let minigame = await Minigame.findOne({ minigameId: id });
      if (!minigame) {
        minigame = new Minigame({ minigameId: id });
        await minigame.save();
        created.push(minigame);
      }
    }
    return res.json({ message: "Minigames initialized", minigames: created });
  } catch (err) {
    console.error("Initialize minigames error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getAllMinigames = async (req, res) => {
  try {
    // run expiry check before returning state
    await checkAndExpireTimers();
    const minigames = await Minigame.find({});
    return res.json({ minigames });
  } catch (err) {
    console.error("Get all minigames error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getMinigameState = async (req, res) => {
  try {
    await checkAndExpireTimers();
    const { minigameId } = req.query;
    const mg = await Minigame.findOne({ minigameId });
    if (!mg) return res.status(404).json({ message: 'Minigame not found' });
    return res.json({ minigameId: mg.minigameId, timer: mg.timer, tries: mg.tries });
  } catch (err) {
    console.error('Get minigame state error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const decrementTries = async (req, res) => {
  try {
    const { minigameId } = req.body;
    if (!["M4", "M5", "M6"].includes(minigameId)) return res.status(400).json({ message: "Only M4, M5, M6 have tries" });
    const mg = await Minigame.findOne({ minigameId });
    if (!mg) return res.status(404).json({ message: 'Minigame not found' });
    if (typeof mg.tries !== 'number') return res.status(400).json({ message: 'Minigame does not use tries' });
    if (mg.tries <= 0) return res.status(400).json({ message: 'No tries left' });
    mg.tries -= 1;
    await mg.save();
    return res.json({ message: 'Tries decremented', minigameId, tries: mg.tries });
  } catch (err) {
    console.error('Decrement tries error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const resetTimer = async (req, res) => {
  try {
    const { minigameId } = req.body;
    const mg = await Minigame.findOne({ minigameId });
    if (!mg) return res.status(404).json({ message: 'Minigame not found' });
    mg.timer = 300;
    delete mg.startedAt;
    await mg.save();
    return res.json({ message: 'Timer reset', minigameId, timer: mg.timer });
  } catch (err) {
    console.error('Reset timer error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Start a minigame: set startedAt and ensure timer/tries are initialized
export const startMinigame = async (req, res) => {
  try {
    const { minigameId } = req.body;
    if (!minigameId) return res.status(400).json({ message: 'minigameId required' });
    const mg = await Minigame.findOne({ minigameId });
    if (!mg) return res.status(404).json({ message: 'Minigame not found' });

    // initialize tries for M4-M6 if absent
    if (["M4", "M5", "M6"].includes(minigameId) && (mg.tries === null || mg.tries === undefined)) {
      mg.tries = 3;
    }

    // set startedAt to now
    mg.startedAt = new Date();
    await mg.save();
    return res.json({ message: 'Minigame started', minigameId: mg.minigameId, timer: mg.timer, tries: mg.tries, startedAt: mg.startedAt });
  } catch (err) {
    console.error('Start minigame error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};
