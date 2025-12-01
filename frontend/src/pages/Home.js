import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import NavTabs from "../components/NavTabs";
import SidebarLeft from "../components/SidebarLeft";
import SidebarRight from "../components/SidebarRight";
import WhatsHappening from "../components/WhatsHappening";
import PostCard from "../components/PostCard";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState("");

  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState("");

  // Get userId from localStorage (set during login)
  const userId = localStorage.getItem("userId");

  const fetchPosts = useCallback(async () => {
    try {
      setPostsLoading(true);
      const res = await fetch("http://localhost:4000/api/posts");
      if (!res.ok) throw new Error("Failed to load posts");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
      setPostsError(err.message || "Error loading posts");
    } finally {
      setPostsLoading(false);
    }
  }, []);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("http://localhost:4000/api/events");
        if (!res.ok) throw new Error("Failed to load events");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error(err);
        setEventsError(err.message || "Error loading events");
      } finally {
        setEventsLoading(false);
      }
    }
    fetchEvents();
    fetchPosts();
  }, [fetchPosts]);

  const handlePostCreated = () => {
    fetchPosts();
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

      fetchPosts();
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };


  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors">
      {/* TOP NAVBAR — optional */}
      <NavTabs />

      {/* ACTUAL TWITTER 3-COLUMN LAYOUT */}
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-4 px-4">

        {/* LEFT SIDEBAR (Twitter-style icons) */}
        <aside className="hidden md:block col-span-3 lg:col-span-2 sticky top-20 h-screen">
          <SidebarLeft />
        </aside>

        {/* MAIN FEED */}
        <main className="col-span-12 md:col-span-6 lg:col-span-6 border-x border-gray-200 dark:border-gray-800 min-h-screen px-4">
          <h2 className="text-xl font-bold py-4 sticky top-20 bg-white dark:bg-black z-10 border-b border-gray-200 dark:border-gray-800">
            Home
          </h2>
          <section className="py-4 border-b border-gray-200 dark:border-gray-800">
  <h3 className="text-lg font-semibold mb-2">Community Events</h3>

  {eventsLoading && <p className="text-sm text-gray-500">Loading events…</p>}
  {eventsError && <p className="text-sm text-red-600">Error: {eventsError}</p>}
  {!eventsLoading && !eventsError && events.length === 0 && (
    <p className="text-sm text-gray-500">No events yet. Be the first to post one!</p>
  )}

  <ul className="space-y-3">
    {events.map(ev => (
      <li key={ev.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-3">
        <div className="flex justify-between gap-3">
          {/* Clickable area -> details view */}
          <Link
            to={`/events/${ev.id}`}
            className="flex-1 block no-underline text-inherit"
          >
            <h4 className="font-medium">{ev.title}</h4>
            <p className="text-xs text-gray-500">
              {ev.date} • {ev.time}
              {ev.location && <> • {ev.location}</>}
            </p>
            {ev.description && (
              <p className="mt-1 text-sm line-clamp-3">{ev.description}</p>
            )}
            {ev.tags && (
              <p className="mt-1 text-xs text-gray-400">Tags: {ev.tags}</p>
            )}
          </Link>
        </div>
      </li>
    ))}
  </ul>
</section>

          {/* What's Happening Post Composer */}
          {userId && (
            <WhatsHappening userId={Number(userId)} onPostCreated={handlePostCreated} />
          )}

          {/* Posts Feed */}
          <section className="py-4">
            <h3 className="text-lg font-semibold mb-4">Posts</h3>

            {postsLoading && <p className="text-sm text-gray-500">Loading posts…</p>}
            {postsError && <p className="text-sm text-red-600">Error: {postsError}</p>}
            {!postsLoading && !postsError && posts.length === 0 && (
              <p className="text-sm text-gray-500">No posts yet. Be the first to share something!</p>
            )}

            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={userId ? Number(userId) : null}
                onDelete={handleDeletePost}
              />
            ))}
          </section>
        </main>

        {/* RIGHT SIDEBAR — Trending News */}
        <aside className="hidden lg:block col-span-4 sticky top-20 h-screen">
          <SidebarRight />
        </aside>

      </div>
    </div>
  );
};

export default Home;
