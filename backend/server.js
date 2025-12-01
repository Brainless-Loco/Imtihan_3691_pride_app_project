import express from "express";
import cors from "cors";
import dotenv from "dotenv"; // Import dotenv for .env support
import profileRoutes from "./routes/profileRoutes.js";
import AuthRoutes from "./routes/AuthRoutes.js";
import { getUserById } from "./database/database.js";
import eventsRoutes from "./routes/eventsRoutes.js";
import SearchRoutes from "./routes/SearchRoutes.js";
import postRoutes from "./routes/postRoutes.js";
// import EventActions from "./routes/EventActions.js";




// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT || 4000; // Default to 4000 if not set in .env
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/search", SearchRoutes);
// app.use("/event", EventActions);

// Route mounting
app.use("/api/profile", profileRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/posts", postRoutes); 


app.get("/users/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err.stack);
  res.status(500).send("Internal Server Error");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Environment loaded: ${process.env.NODE_ENV || "development"}`);
  console.log(`📧 Email configured for: ${process.env.EMAIL_USER ? process.env.EMAIL_USER : "No email configured!"}`);
});
