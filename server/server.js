import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.config.js";
import storyRoutes from "./routes/storyRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js"
import cors from "cors"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cors())

// Routes
app.use("/api/story", storyRoutes);
app.use("/api/users", userRoutes);  
app.use("/api/leaderboard", leaderboardRoutes);  
app.use("/api/forgotpwd", forgotpwdRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Server running");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

