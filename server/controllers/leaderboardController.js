// ---------------- Leaderboard Controller ---------------
import User from "../models/user.js";

// Get Leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    let users = await User.find().select("-password");

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Calculate total mini-games played from minicounter
    users = users.map((user) => {
      const totalGames = user.minicounter.reduce((a, b) => a + b, 0);
      return {
        ...user.toObject(),
        totalGames,
      };
    });

    // Sort by points DESC, then money DESC, then totalGames ASC
    users.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.money !== a.money) return b.money - a.money;
      return a.totalGames - b.totalGames;
    });

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};