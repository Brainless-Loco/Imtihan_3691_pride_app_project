import express from "express";
import multer from "multer";
import crypto from "crypto";
import sharp from "sharp";
import { getProfileInfo, saveProfile } from "../database/profile.js";
import db from "../database/database.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// GET /api/profile  -> return profile for current user
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const profile = await getProfileInfo(id);

    if (!profile) {
      // No profile yet -> 204 No Content, which api.js handles
      return res.status(400).send();
    }

    res.json(profile);
  } catch (err) {
    console.error("Error getting profile:", err);
    res.status(500).json({ error: "Failed to load profile" });
  }
});



router.get("/avatar/:userId", async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);

    const [rows] = await db.execute(
      "SELECT profile_pic, profile_pic_mime FROM user_profiles WHERE user_id = ?",
      [userId]
    );

    if (!rows.length || !rows[0].profile_pic) {
      // No profile or no picture saved
      return res.status(404).end();
    }

    const { profile_pic, profile_pic_mime } = rows[0];

    res.setHeader("Content-Type", profile_pic_mime || "image/png");
    res.setHeader("Content-Length", profile_pic.length);
    return res.end(profile_pic);
  } catch (err) {
    console.error("Error getting avatar:", err);
    next(err);
  }
});

router.post("/:id", upload.single("profilePic"), async (req, res, next) => {
  const userId = Number(req.params.id);

  try {
    
    const {
      name,
      pronouns,
      accountType,
      role,
      company,
      experience,
      age,
      location,
      bio,
      interests,
      tags,
    } = req.body;

    
    let interestsArr = [];
    let tagsArr = [];

    try {
      if (interests) interestsArr = JSON.parse(interests);
      if (tags) tagsArr = JSON.parse(tags);
    } catch (e) {
      console.warn("Failed to parse interests/tags JSON:", e);
    }

    
    const experienceInt = experience ? Number(experience) : null;
    const ageInt = age ? Number(age) : null;

    
    let profilePicBuffer = null;
    let profilePicMime = null;
    let profilePicEtag = null;

    if (req.file) {
      
      const allowed = ["image/jpeg", "image/png", "image/webp"];
      if (!allowed.includes(req.file.mimetype)) {
        return res.status(400).json({ error: "Unsupported image type" });
      }

      
      profilePicBuffer = await sharp(req.file.buffer)
        .rotate()
        .resize(250, 250, { fit: "cover" })
        .webp({ quality: 85 })
        .toBuffer();

      profilePicMime = "image/webp";
      profilePicEtag = crypto
        .createHash("sha1")
        .update(profilePicBuffer)
        .digest("hex");
    }

    if (profilePicBuffer) {
      const sql = `
        INSERT INTO user_profiles
          (user_id, name, pronouns, account_type, role, company, experience, age, location,
           interests, tags, bio,
           profile_pic, profile_pic_mime, profile_pic_etag, profile_pic_updated)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          pronouns = VALUES(pronouns),
          account_type = VALUES(account_type),
          role = VALUES(role),
          company = VALUES(company),
          experience = VALUES(experience),
          age = VALUES(age),
          location = VALUES(location),
          interests = VALUES(interests),
          tags = VALUES(tags),
          bio = VALUES(bio),
          profile_pic = VALUES(profile_pic),
          profile_pic_mime = VALUES(profile_pic_mime),
          profile_pic_etag = VALUES(profile_pic_etag),
          profile_pic_updated = VALUES(profile_pic_updated)
      `;

      const params = [
        userId,
        name || null,
        pronouns || null,
        accountType || null,
        role || null,
        company || null,
        experienceInt,
        ageInt,
        location || null,
        JSON.stringify(interestsArr),
        JSON.stringify(tagsArr),
        bio || null,
        profilePicBuffer,
        profilePicMime,
        profilePicEtag,
      ];

      await db.execute(sql, params);
    } else {
      
      const sql = `
        INSERT INTO user_profiles
          (user_id, name, pronouns, account_type, role, company, experience, age, location,
           interests, tags, bio)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          account_type = VALUES(account_type),
          role = VALUES(role),
          company = VALUES(company),
          experience = VALUES(experience),
          age = VALUES(age),
          location = VALUES(location),
          interests = VALUES(interests),
          tags = VALUES(tags),
          bio = VALUES(bio)
      `;

      const params = [
        userId,
        name || null,
        pronouns || null,
        accountType || null,
        role || null,
        company || null,
        experienceInt,
        ageInt,
        location || null,
        JSON.stringify(interestsArr),
        JSON.stringify(tagsArr),
        bio || null,
      ];

      await db.execute(sql, params);
    }

    return res.status(200).json({ ok: true, message: "Profile saved" });
  } catch (err) {
    console.error("Error saving profile:", err);
    next(err);
  }
});


export default router;
