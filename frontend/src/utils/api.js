
// If you set REACT_APP_API_BASE in a .env file, it will be used.
// Otherwise, it will call relative URLs like /api/profile,
// which can go through the CRA "proxy" if you have one.
const API_BASE = process.env.REACT_APP_API_BASE || '';

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  // 204 No Content has no body
  if (res.status === 204) return null;
  return res.json();
}

export async function getProfile(userId) {
  const res = await fetch(`${API_BASE}/api/profile/${userId}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Accept': 'application/json'
    }
  });

  return handleResponse(res);
}

export async function saveProfile(profile, userId) {
  const res = await fetch(`${API_BASE}/api/profile/${userId}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(profile)
  });

  return handleResponse(res);
}

// Posts API functions

/**
 * Get all posts for the main feed
 */
export async function getAllPosts() {
  const res = await fetch(`${API_BASE}/api/posts`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Accept': 'application/json'
    }
  });

  return handleResponse(res);
}

/**
 * Get posts by a specific user
 */
export async function getUserPosts(userId) {
  const res = await fetch(`${API_BASE}/api/posts/user/${userId}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Accept': 'application/json'
    }
  });

  return handleResponse(res);
}

/**
 * Create a new post
 */
export async function createPost(userId, content, imageUrl = null) {
  const res = await fetch(`${API_BASE}/api/posts`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      user_id: userId,
      content,
      image_url: imageUrl
    })
  });

  return handleResponse(res);
}

/**
 * Delete a post
 */
export async function deletePost(postId, userId) {
  const res = await fetch(`${API_BASE}/api/posts/${postId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      user_id: userId
    })
  });

  return handleResponse(res);
}
