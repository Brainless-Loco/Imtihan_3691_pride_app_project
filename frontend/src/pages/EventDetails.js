import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import NavTabs from "../components/NavTabs";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isInterested, setIsInterested] = useState(false);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`http://localhost:4000/api/events/${id}`);
        if (!res.ok) throw new Error("Failed to load event");
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error loading event");
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [id]);

  const handleToggleInterest = () => {
    setIsInterested((prev) => !prev);
    // later you can POST this to the backend if needed
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100">
        <NavTabs />
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-gray-500">Loading event…</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100">
        <NavTabs />
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-2">
            <p className="text-red-600 text-sm">
              {error || "Event not found."}
            </p>
            <Link
              to="/"
              className="text-sm text-blue-600 underline"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-sky-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-gray-900 dark:text-gray-100">
      {/* Same header as Home */}
      <NavTabs />

      <div className="max-w-4xl mx-auto px-4 pb-16">
        {/* Back link */}
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 text-sm"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Event card */}
        <div className="mt-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-xl overflow-hidden">
          {/* Colorful header bar */}
          <div className="h-24 bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-400" />

          <div className="p-6 sm:p-8">
            {/* Title + basic meta */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{event.title}</h1>

              <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <p>
                  <span className="mr-1">📅</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {event.date}
                  </span>
                </p>
                <p>
                  <span className="mr-1">⏰</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {event.time}
                  </span>
                </p>
                {event.location && (
                  <p>
                    <span className="mr-1">📍</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {event.location}
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* Divider */}
            <hr className="border-gray-200 dark:border-gray-700 my-6" />

            {/* Description */}
            {event.description && (
              <section className="mb-8">
                <h2 className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                  About this event
                </h2>
                <p className="leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-line">
                  {event.description}
                </p>
              </section>
            )}

            {/* Tags */}
            {event.tags && (
              <section className="mb-8">
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.split(",").map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs bg-pink-100 dark:bg-pink-600/20 text-pink-700 dark:text-pink-200 rounded-full"
                    >
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 items-center mt-4">
              {event.link && (
                <a
                  href={event.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-yellow-500 text-white text-sm font-semibold hover:shadow-lg transition"
                >
                  Visit Event Page ↗
                </a>
              )}

              <button
                type="button"
                onClick={handleToggleInterest}
                className={`inline-flex items-center px-4 py-2.5 rounded-xl border text-sm font-medium transition ${
                  isInterested
                    ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-900/40 dark:text-green-200"
                    : "border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {isInterested ? "★ Marked as Interested" : "☆ I’m interested"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
