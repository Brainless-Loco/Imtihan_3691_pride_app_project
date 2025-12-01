import React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Search,
  Bell,
  Mail,
  Users,
  Bookmark,
  User,
  Settings,
  MoreHorizontal,
} from "lucide-react";

const SidebarLeft = () => {
  const menuItems = [
    { name: "Home", icon: <Home />, to: "/home" },
    { name: "Search", icon: <Search />, to: "/search" },
    { name: "Notifications", icon: <Bell />, to: "/notifications" },
    { name: "Messages", icon: <Mail />, to: "/messages" },
    { name: "Connections", icon: <Users />, to: "/connections" },
    { name: "Bookmarks", icon: <Bookmark />, to: "/bookmarks" },
    { name: "Profile", icon: <User />, to: "/profile" },
    { name: "More", icon: <MoreHorizontal />, to: "#" },
  ];

  return (
    <div className="flex flex-col space-y-3 pl-4 mt-4">
      {menuItems.map((item) => (
        <Link
          key={item.name}
          to={item.to}
          className="flex items-center space-x-4 p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <span className="text-2xl">{item.icon}</span>
          <span className="text-lg font-medium">{item.name}</span>
        </Link>
      ))}

      <Link
        to="/createevent"
        className="bg-indigo-600 text-white text-center py-3 rounded-full font-semibold hover:bg-indigo-700 transition w-40 mt-4"
      >
        Create Event
      </Link>
    </div>
  );
};

export default SidebarLeft;
