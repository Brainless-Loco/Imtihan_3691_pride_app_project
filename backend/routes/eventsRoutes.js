import express from "express";
import multer from "multer";
import db from "../database/database.js";

const router = express.Router();

// store uploads under /uploads for now
const upload = multer({ dest: "uploads/" });

// GET /api/events  - list all events
router.get("/", async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `
      SELECT 
        id,
        title,
        date,
        time,
        location,
        description,
        link,
        tags,
        created_by,
        created_at
      FROM events
      ORDER BY date ASC, time ASC
      `
    );

    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
});
router.get("/:id", async (req, res, next) => {
  try {
    const eventId = req.params.id;

    const [rows] = await db.execute(
      "SELECT id, title, date, time, location, description, link, tags, created_at FROM events WHERE id = ? LIMIT 1",
      [eventId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// POST /api/events  - create event
router.post("/", upload.array("files"), async (req, res, next) => {
  try {
    const {
      title,
      date,
      time,
      location,
      description,
      links,   // 👈 comes from your frontend FormData
      tags,
      created_by,
    } = req.body;

    if (!title || !date || !time || !location || !description || !created_by) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // map frontend "links" to DB column "link"
    const linkValue = links || "";

    const [result] = await db.query(
      `
      INSERT INTO events
        (title, date, time, location, description, link, tags, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        title,
        date,
        time,
        location,
        description,
        linkValue,
        tags || "",
        created_by,
      ]
    );

    res.status(201).json({
      success: true,
      eventId: result.insertId,
      message: "Event created successfully",
    });
  } catch (err) {
    next(err);
  }
});

export default router;
