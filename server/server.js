// server.js
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.config.js";
import storyRoutes from "./routes/storyRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors())
// Routes
app.use("/api/story", storyRoutes); // Story routes
app.use("/api/users", userRoutes);  // User routes

// Root route
app.get("/", (req, res) => {
  res.send("Server running");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});