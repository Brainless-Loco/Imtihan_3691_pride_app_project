import React, { useState } from "react";
import NavTabs from "../components/NavTabs";

const mockResults = [
  {
    id: 1,
    type: "user",
    name: "Alex Rivera",
    role: "STEM Student",
    description: "Active in Pride STEM networking events and AI workshops.",
    image:
      "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    type: "event",
    name: "AI Research Conference 2025",
    role: "Event",
    description: "Join us for talks on ethical AI and inclusivity in technology.",
    image:
      "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    type: "user",
    name: "Jamie Lin",
    role: "Researcher",
    description: "Focused on building inclusive and accessible AI systems.",
    image:
      "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 4,
    type: "event",
    name: "Pride STEM Mentorship Launch",
    role: "Event",
    description:
      "A networking event connecting mentors and mentees in STEM fields.",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
  },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(mockResults);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setQuery(value);
    setResults(
      mockResults.filter(
        (item) =>
          item.name.toLowerCase().includes(value) ||
          item.description.toLowerCase().includes(value)
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
      {/* Navbar */}
      <NavTabs />

      {/* Header */}
      <section className="bg-gradient-to-r from-indigo-600 to-pink-500 text-white py-14 px-6 text-center shadow-md">
        <h1 className="text-4xl font-bold mb-3 drop-shadow-lg">Search</h1>
        <p className="text-lg text-indigo-100">
          Find users, events, and connections in the Pride STEM community.
        </p>
      </section>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mt-10 px-4">
        <input
          type="text"
          placeholder="Search for users or events..."
          value={query}
          onChange={handleSearch}
          className="w-full p-4 rounded-2xl shadow-md border border-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto mt-10 px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
        {results.length > 0 ? (
          results.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl transition-transform duration-300 hover:-translate-y-2 overflow-hidden border border-gray-100 dark:border-gray-700"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {item.role}
                </p>
                <p className="text-gray-600 dark:text-gray-300 mt-3 text-sm">
                  {item.description}
                </p>
                <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition">
                  {item.type === "user" ? "View Profile" : "View Event"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-300 col-span-full">
            No results found for "{query}".
          </p>
        )}
      </div>
    </div>
  );
}
