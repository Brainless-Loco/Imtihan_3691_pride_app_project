import express from "express";
import bcrypt from 'bcrypt';
import db,  { getUserByEmail, createUser, generatePasswordHash } from "../database/database.js";

const router = express.Router();

router.post("/login", async (req, res, next) => {
    const {email, password} = req.body;

    try{

        const user = await getUserByEmail(email);
        if(!user){
            return res.status(404).send("Invalid e-mail address")
        }
        
        const isValid = await bcrypt.compare(password, user.hashed_password)
        
        if(!isValid){
            return res.status(404).send("Invalid Password")
        }

        
        return res.status(201).json({
            message: "Login successful",
            id: user.id
        });

    } catch (err){
        next(err)
    }
});

router.post("/register", async (req, res, next) => {
  try {
    // update to handle security question and answer

    const result = await createUser(req.body.email, req.body.password, req.body.phone_number, req.body.security_question, req.body.security_answer);
    if (!result) {
      return res.status(400).send("Failed to insert into database");
    }
    return res.status(201).json({
        message: "Registration successful",
        id: result
    });
  } catch (err) {
    next(err);
  }
});

router.post("/forgot/verify", async (req, res, next) => {
  const { email } = req.body;

  try {
    const [rows] = await db.query(
      `
      SELECT id, email, security_question
      FROM users
      WHERE email = ?
      LIMIT 1
      `,
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Email not found" });
    }

    res.status(200).json({
      success: true,
      userId: rows[0].id,
      email: rows[0].email,
      security_question: rows[0].security_question
    });
  } catch (err) {
    next(err);
  }
});

router.post("/forgot/verify-answer", async (req, res, next) => {
  const { userId, security_answer } = req.body;

  try {
    const [rows] = await db.query(
      `
      SELECT id, security_answer
      FROM users
      WHERE id = ?
      LIMIT 1
      `,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare security answer (case-insensitive)
    if (rows[0].security_answer.toLowerCase() !== security_answer.toLowerCase()) {
      return res.status(401).json({ error: "Security answer is incorrect" });
    }

    res.status(200).json({
      success: true,
      message: "Security answer verified"
    });
  } catch (err) {
    next(err);
  }
});

router.post("/forgot/reset", async (req, res, next) => {
  const { userId, password } = req.body;

  const hashed_password = await generatePasswordHash(password);
  try {

    await db.query(
      `
      UPDATE users 
      SET hashed_password = ?
      WHERE id = ?
      `,
      [hashed_password, userId]
    );

    res.status(200).send("Password reset successful");
  } catch (err) {
    next(err);
  }
});

export default router;