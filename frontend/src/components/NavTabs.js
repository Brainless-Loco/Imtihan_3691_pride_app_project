// src/components/NavTabs.js
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sun, Moon } from "lucide-react";


const NavTabs = () => {
  const location = useLocation();
  const userId = localStorage.getItem("userId");
  const defaultAvatar = "/public/default_avatar.png";
  const avatarUrl = `http://localhost:4000/api/profile/avatar/${userId}`;
  const [src, setSrc] = useState(avatarUrl);
  const [darkMode, setDarkMode] = useState(false);

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("theme");
    if (savedMode === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  // Toggle dark mode and persist setting
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return newMode;
    });
  };

  // Optional user info
  const user = JSON.parse(localStorage.getItem("userProfile"));

  const tabs = [
    { name: "Home", path: "/home" },
    { name: "Search", path: "/search" },
    { name: "Create Event", path: "/createevent" },
    /* Connections doesn't have route yet so added to /home for now. - J */
    // Changing to connections as it is interfering with my specific event code in home - Zain
    { name: "Connections", path: "/connections" },
  ];

  return (
    <nav className="bg-white/70 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-white/20 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-3">
        {/* Brand */}
        <Link to="/home" className="flex items-center">
          <img
            src="/p.png"
            alt="Pride STEM Logo"
            className="h-8 w-auto object-contain"
          />
        </Link>

        <ul className="flex items-center space-x-6">
          {tabs.map((tab) => (
            <li key={tab.path}>
              <Link
                to={tab.path}
                className={`text-sm font-medium ${
                  location.pathname === tab.path
                    ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 pb-1"
                    : "text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400"
                }`}
              >
                {tab.name}
              </Link>
            </li>
          ))}

          {/* Profile Circle */}
          <li>
            <Link to="/profile" className="block">
              <div
                className={`w-9 h-9 rounded-full border-2 ${
                  location.pathname === "/profile"
                    ? "border-indigo-600 dark:border-indigo-400"
                    : "border-gray-300 dark:border-gray-500"
                } overflow-hidden hover:scale-105 transition-transform duration-200`}
              >
                <img
                  src={src}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={() => {
                    setSrc(defaultAvatar);
                  }}
                />

                
              </div>
            </Link>
          </li>

          {/* 🌙 Dark Mode Toggle */}
          <li>
            <button
              onClick={toggleDarkMode}
              className="ml-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-yellow-400 hover:scale-110 transition-transform"
              title="Toggle dark mode"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavTabs;
