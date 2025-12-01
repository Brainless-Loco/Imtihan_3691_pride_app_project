import React from "react";
import SidebarLeft from "../components/SidebarLeft";
import SidebarRight from "../components/SidebarRight";
import ChatWindow from "../components/ChatWindow";

const DirectMessaging = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-4 px-4 pt-4">

        {/* Left Sidebar */}
        <aside className="hidden md:block col-span-3 lg:col-span-2 sticky top-4 h-screen">
          <SidebarLeft />
        </aside>

        {/* Main Area Split */}
        <main className="col-span-12 md:col-span-7 lg:col-span-8 flex gap-4">

      {/* Left panel of main area (Conversation Sections) */}
<div className="w-1/3 border-r border-gray-200 dark:border-gray-800 flex flex-col h-[80vh]">

  {/* Header */}
  <div className="p-4 font-bold text-xl border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
    Inbox
  </div>

  {/* Scrollable sections */}
  <div className="flex-1 overflow-y-auto">
    <div
      className="cursor-pointer px-4 py-6 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 transition"
    >
      Section 1
    </div>
    <div
      className="cursor-pointer px-4 py-6 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 transition"
    >
      Section 2
    </div>
    <div
      className="cursor-pointer px-4 py-6 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 transition"
    >
      Section 3
    </div>
    <div
      className="cursor-pointer px-4 py-6 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 transition"
    >
      Section 4
    </div>
    {/* Add more sections dynamically when connected to real data */}
     </div>

    </div>

          {/* Right panel (Chat) */}
          <div className="w-2/3 flex flex-col border-l border-gray-200 dark:border-gray-800">

            {/* Direct Messaging Header */}
            <h2 className="text-xl font-bold py-4 border-b border-gray-200 dark:border-gray-800 px-4">
              ~name~
            </h2>

            {/* Search Bar */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <input
                type="text"
                placeholder="Search for people and groups"
                className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* ChatWindow */}
            <div className="flex-1 overflow-y-auto">
              <ChatWindow />
            </div>

          </div>

        </main>

        {/* Right Sidebar (small) */}
        <aside className="hidden lg:block col-span-2 sticky top-4 h-screen">
          <SidebarRight />
        </aside>

      </div>
    </div>
  );
};

export default DirectMessaging;