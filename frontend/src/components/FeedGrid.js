// src/components/FeedGrid.js
import React from "react";

const FeedGrid = ({ posts }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl transition-transform duration-300 hover:-translate-y-2 overflow-hidden border border-gray-100 dark:border-gray-700"
        >
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-5">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              {post.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              By {post.author}
            </p>
            <p className="text-gray-600 dark:text-gray-300 mt-3 text-sm">
              {post.description}
            </p>

            <div className="flex justify-between items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
              <button className="hover:text-pink-500 dark:hover:text-pink-400 transition">
                ❤️ Like
              </button>
              <button className="hover:text-indigo-500 dark:hover:text-indigo-400 transition">
                💬 Comment
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeedGrid;
