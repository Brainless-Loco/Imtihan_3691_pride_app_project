import React, { useEffect, useState, useCallback } from "react";
import WhatsHappening from "../components/WhatsHappening";
import PostCard from "../components/PostCard";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState("");

  // Get userId from localStorage (set during login)
  const userId = localStorage.getItem("userId");

  const fetchUserPosts = useCallback(async () => {
    if (!userId) return;
    
    try {
      setPostsLoading(true);
      const res = await fetch(`http://localhost:4000/api/posts/user/${userId}`);
      if (!res.ok) throw new Error("Failed to load posts");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
      setPostsError(err.message || "Error loading posts");
    } finally {
      setPostsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    async function fetchProfile() {
      if (!userId) return;
      
      try {
        const res = await fetch(`http://localhost:4000/api/profile/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    }

    fetchProfile();
    fetchUserPosts();
  }, [userId, fetchUserPosts]);

  const handlePostCreated = () => {
    fetchUserPosts();
  };

  const handleDeletePost = async (postId) => {
    try {
      const res = await fetch(`http://localhost:4000/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: Number(userId) }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete post");
      }

      fetchUserPosts();
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Banner */}
      <div className="relative">
        <div className="h-48 bg-blue-600"></div>
        {/* Profile Picture */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-12">
          {profile?.profile_pic_etag ? (
            <img
              src={`http://localhost:4000/api/profile/avatar/${userId}`}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : "U"}
            </div>
          )}
        </div>
      </div>

      {/* User Info */}
      <div className="mt-16 text-center">
        <h1 className="text-2xl font-bold text-gray-800">
          {profile?.name || "Your Name"}
        </h1>
        <p className="text-gray-600">
          {profile?.role || "Role"} {profile?.company ? `| ${profile.company}` : ""} | Pride STEM Network
        </p>
        <div className="mt-4 flex justify-center space-x-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Connect
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">
            Message
          </button>
        </div>
      </div>

      {/* Bio / Description */}
      <div className="max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-2">About Me</h2>
        <p className="text-gray-700">
          {profile?.bio || "Tell us about yourself by updating your profile."}
        </p>
      </div>

      {/* What's Happening Post Composer */}
      <div className="max-w-2xl mx-auto mt-6">
        {userId && (
          <WhatsHappening userId={Number(userId)} onPostCreated={handlePostCreated} />
        )}
      </div>

      {/* User's Posts */}
      <div className="max-w-2xl mx-auto mt-6 space-y-4 pb-8">
        <h2 className="text-xl font-semibold mb-2">My Posts</h2>
        
        {postsLoading && <p className="text-sm text-gray-500">Loading posts…</p>}
        {postsError && <p className="text-sm text-red-600">Error: {postsError}</p>}
        {!postsLoading && !postsError && posts.length === 0 && (
          <p className="text-sm text-gray-500">You haven't posted anything yet. Share your thoughts above!</p>
        )}

        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            currentUserId={userId ? Number(userId) : null}
            onDelete={handleDeletePost}
          />
        ))}
      </div>
    </div>
  );
}

export default Profile;

