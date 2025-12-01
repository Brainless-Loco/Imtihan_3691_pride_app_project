import express from "express";
import db from "../database/database.js";

/* TODO FOR NEXT TEAM:
    Replace mockResults with:
    1. Query users table
    2. Query events table
    3. Combine results into one array
    4. Return to frontend

    Example:
    const [users] = await db.query("SELECT ... FROM users WHERE name LIKE ?", [`%${query}%`]);
    const [events] = await db.query("SELECT ... FROM events WHERE title LIKE ?", [`%${query}%`]);
    return res.json([...users, ...events]);
*/

const router = express.Router();

// GET /search?query=abc
router.get("/", async (req, res, next) => {
  const query = req.query.query?.toLowerCase() || "";

  try {
    // TODO: Replace mock results with real MySQL queries
    // This is placeholder logic for the next team
    const mockResults = [
      {
        id: 1,
        type: "user",
        name: "Sample User",
        role: "Student",
        description: "User from backend mock data",
        image: "",
      },
      {
        id: 2,
        type: "event",
        name: "Sample Event",
        role: "Event",
        description: "Event from backend mock data",
        image: "",
      },
    ];

    const filtered = mockResults.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
    );

    res.json(filtered);
  } catch (err) {
    next(err);
  }
});

export default router;
