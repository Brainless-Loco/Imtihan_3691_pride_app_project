// Author: River
const express = require('express');
const app = express();
const PORT = 4000;


// Middleware to parse JSON
app.use(express.json());

// --- Dummy data ---

// Users
const users = [
  { id: 1, handle: 'alice', email: 'alice@example.com' },
  { id: 2, handle: 'bob', email: 'bob@example.com' },
  { id: 3, handle: 'charlie', email: 'charlie@example.com' }
];

// Posts (for Create a Post feature)
let posts = [
  { post_id: 1, user_id: 1, content: "Hello world!", created_at: new Date(), updated_at: new Date() }
];
let nextPostId = 2;

// --- Routes ---

// Health route
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// Users route
app.get('/api/users', (req, res) => {
  res.json(users);
});

// Get all posts
app.get('/api/posts', (req, res) => {
  res.json(posts);
});

// Create a new post
app.post('/api/posts', (req, res) => {
  const { user_id, content } = req.body;

  if (!user_id || !content) {
    return res.status(400).json({ error: 'user_id and content are required' });
  }

  const newPost = {
    post_id: nextPostId++,
    user_id,
    content,
    created_at: new Date(),
    updated_at: new Date()
  };

  posts.push(newPost);

  res.status(201).json({ message: 'Post created successfully', post: newPost });
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT} (DB not connected)`);
});
