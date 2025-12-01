import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import {
  createPost,
  getAllPosts,
  getPostsByUserId,
  getPostById,
  deletePost,
} from "../database/database.js";

const router = express.Router();

// Setup for ES modules __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "..", "uploads", "posts");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed."));
    }
  },
});

// GET /api/posts - Get all posts (for main feed)
router.get("/", async (req, res, next) => {
  try {
    const posts = await getAllPosts();
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
});

// GET /api/posts/user/:userId - Get posts by a specific user
router.get("/user/:userId", async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const posts = await getPostsByUserId(userId);
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
});

// GET /api/posts/:id - Get a single post by ID
router.get("/:id", async (req, res, next) => {
  try {
    const postId = Number(req.params.id);
    
    if (!postId || isNaN(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const post = await getPostById(postId);
    
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
});

// POST /api/posts - Create a new post
router.post("/", upload.single("image"), async (req, res, next) => {
  try {
    const { user_id, content } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    if (!content || content.trim() === "") {
      return res.status(400).json({ error: "Post content is required" });
    }

    // Build image URL if file was uploaded
    let imageUrl = null;
    if (req.file) {
      imageUrl = `/api/posts/image/${req.file.filename}`;
    }

    const postId = await createPost(user_id, content.trim(), imageUrl);

    res.status(201).json({
      success: true,
      postId,
      message: "Post created successfully",
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/posts/image/:filename - Serve post images
router.get("/image/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadsDir, filename);
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: "Image not found" });
  }
});

// DELETE /api/posts/:id - Delete a post
router.delete("/:id", async (req, res, next) => {
  try {
    const postId = Number(req.params.id);
    const { user_id } = req.body;

    if (!postId || isNaN(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    if (!user_id) {
      return res.status(400).json({ error: "User ID is required for authorization" });
    }

    const affectedRows = await deletePost(postId, user_id);

    if (affectedRows === 0) {
      return res.status(404).json({ error: "Post not found or not authorized to delete" });
    }

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (err) {
    next(err);
  }
});

export default router;
