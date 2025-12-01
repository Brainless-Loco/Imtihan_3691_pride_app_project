import React from "react";

const SidebarRight = () => {
  return (
    <div className="p-4 space-y-6">

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search"
        className="w-full px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 outline-none"
      />

      {/* Trending Section */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
        <h3 className="text-xl font-bold mb-4">Today’s News</h3>

        <div className="space-y-4">
          <div>
            <p className="font-semibold">Nintendo Unveils Trailer</p>
            <p className="text-sm text-gray-500">91.2K posts</p>
          </div>

          <div>
            <p className="font-semibold">House Democrats Release Emails</p>
            <p className="text-sm text-gray-500">35.6K posts</p>
          </div>

          <div>
            <p className="font-semibold">H-1B Visa Discussion</p>
            <p className="text-sm text-gray-500">19.7K posts</p>
          </div>
        </div>
      </div>

      {/* What's happening */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
        <h3 className="text-xl font-bold mb-4">What’s happening</h3>
        <p className="text-gray-500">More events coming soon…</p>
      </div>

    </div>
  );
};

export default SidebarRight;
