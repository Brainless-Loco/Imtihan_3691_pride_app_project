import React from "react";

const PostCard = ({ post, currentUserId, onDelete }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      if (onDelete) {
        onDelete(post.id);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 mb-4">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          {post.profile_pic_etag ? (
            <img
              src={`${process.env.REACT_APP_API_BASE || "http://localhost:4000"}/api/profile/avatar/${post.user_id}`}
              alt={post.author_name || "User"}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
              {post.author_name ? post.author_name.charAt(0).toUpperCase() : "U"}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900 dark:text-white truncate">
              {post.author_name || "Anonymous User"}
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              · {formatDate(post.created_at)}
            </span>
            {currentUserId === post.user_id && (
              <button
                onClick={handleDelete}
                className="ml-auto text-gray-400 hover:text-red-500 transition"
                title="Delete post"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
          <p className="mt-2 text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
            {post.content}
          </p>
          {post.image_url && (
            <img
              src={`${process.env.REACT_APP_API_BASE || "http://localhost:4000"}${post.image_url}`}
              alt="Post attachment"
              className="mt-3 rounded-xl max-h-96 w-full object-cover"
            />
          )}
          <div className="flex items-center gap-6 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <button className="flex items-center gap-1 text-gray-500 hover:text-pink-500 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-sm">Like</span>
            </button>
            <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-sm">Comment</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
