import db from "./database/database.js";

export async function createEvent({ title, date, time, location, description, link, tags }) {
  const [result] = await db.query(
    `INSERT INTO events (title, date, time, location, description, link, tags)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [title, date, time, location, description, link, tags]
  );

  const [rows] = await db.query(`SELECT * FROM events WHERE id = ?`, [result.insertId]);
  return rows[0];
}

export async function getAllEvents() {
  const [rows] = await db.query(
    `SELECT * FROM events ORDER BY date ASC, time ASC, created_at DESC`
  );
  return rows;
}

export async function getEventById(id) {
  const [rows] = await db.query(`SELECT * FROM events WHERE id = ?`, [id]);
  return rows[0] || null;
}
