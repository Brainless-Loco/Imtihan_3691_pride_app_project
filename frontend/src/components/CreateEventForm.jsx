import { useRef, useState, useEffect } from "react";

export default function CreateEventForm() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    links: "",
    tags: "",
  });
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postMessage, setPostMessage] = useState("");
  const [postError, setPostError] = useState("");

  useEffect(() => {
    if (!postMessage) return;
    const t = setTimeout(() => setPostMessage(""), 4000);
    return () => clearTimeout(t);
  }, [postMessage]);

  useEffect(() => {
    if (!postError) return;
    const t = setTimeout(() => setPostError(""), 5000);
    return () => clearTimeout(t);
  }, [postError]);

  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files || []);
    if (dropped.length) setFiles(prev => [...prev, ...dropped]);
  }

  function handleFileChange(e) {
    const selected = Array.from(e.target.files || []);
    if (selected.length) setFiles(prev => [...prev, ...selected]);
  }

  function removeFile(index) {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // 🔴 required field checks
    if (!form.title.trim()) {
      setPostError("Please add an event title.");
      return;
    }
    if (!form.date) {
      setPostError("Please choose a date for the event.");
      return;
    }
    if (!form.time) {
      setPostError("Please choose a time for the event.");
      return;
    }
    if (!form.location.trim()) {
      setPostError("Please add a location for the event.");
      return;
    }
    if (!form.description.trim()) {
      setPostError("Please add a brief description for the event.");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);
    setPostError("");
    setPostMessage("");

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("date", form.date);
    fd.append("time", form.time);
    fd.append("location", form.location);
    fd.append("description", form.description);
    fd.append("links", form.links);
    fd.append("tags", form.tags);
    fd.append("created_by", localStorage.getItem("userId"));

    files.forEach(file => fd.append("files", file));

    try {
        const res = await fetch("http://localhost:4000/api/events", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json().catch(() => ({}));
      console.log("Server response:", data);
      setPostMessage("Your event has been published successfully.");

      setFiles([]);
      setForm({
        title: "",
        date: "",
        time: "",
        location: "",
        description: "",
        links: "",
        tags: "",
      });
    } catch (err) {
      console.error("Upload failed:", err);
      setPostError("Failed to publish the event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-6xl bg-white rounded-2xl shadow p-8 space-y-6 min-h-[80vh]"
      >
        <h1 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-yellow-400 to-pink-500 bg-[length:200%_auto] animate-gradient">
          Create an Event!
        </h1>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Left: Drag & Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={[
              "relative flex flex-col items-center justify-center w-full border-2 border-dashed rounded-2xl p-8 transition h-[320px] md:h-[520px]",
              isDragging
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400",
            ].join(" ")}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
              aria-label="Upload files"
            />

            <div className="text-center pointer-events-none">
              <div className="text-sm font-medium">Drag & drop images/videos here</div>
              <div className="text-xs text-gray-500 mt-1">or click to browse</div>
            </div>
          </div>

          {/* Right: Text Inputs */}
          <div className="flex flex-col gap-4">
            {/* Event title */}
            <label className="block">
              <span className="text-sm font-medium">
                Event title <span className="text-red-500">*</span>
              </span>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Queer in STEM Networking Night"
                className="mt-1 w-full rounded-xl border border-pink-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </label>

            {/* Date + Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="block">
                <span className="text-sm font-medium">
                  Date <span className="text-red-500">*</span>
                </span>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-pink-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium">
                  Time <span className="text-red-500">*</span>
                </span>
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-pink-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </label>
            </div>

            {/* Location */}
            <label className="block">
              <span className="text-sm font-medium">
                Location <span className="text-red-500">*</span>
              </span>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Mona Campbell 1107 or Online (Zoom)"
                className="mt-1 w-full rounded-xl border border-pink-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </label>

            {/* Description */}
            <label className="block">
              <span className="text-sm font-medium">
                Description <span className="text-red-500">*</span>
              </span>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Brief description"
                className="mt-1 w-full rounded-xl border border-pink-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[180px] md:min-h-[260px]"
                required
              />
            </label>

            {/* Links */}
            <label className="block">
              <span className="text-sm font-medium">Links</span>
              <input
                type="text"
                name="links"
                value={form.links}
                onChange={handleChange}
                placeholder="Comma-separated URLs"
                className="mt-1 w-full rounded-xl border border-pink-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            {/* Tags */}
            <label className="block">
              <span className="text-sm font-medium">Tags</span>
              <input
                type="text"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="e.g. design, docs, images"
                className="mt-1 w-full rounded-xl border border-pink-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            {/* Mobile selected files */}
            {files.length > 0 && (
              <div className="md:hidden">
                <h2 className="text-sm font-medium mb-2">Selected Files</h2>
                <ul className="space-y-2">
                  {files.map((f, i) => (
                    <li
                      key={`${f.name}-${i}`}
                      className="flex items-center justify-between rounded-xl border p-3 text-sm"
                    >
                      <span className="truncate mr-3">
                        {f.name}{" "}
                        <span className="text-gray-400">
                          ({Math.round(f.size / 1024)} KB)
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="text-gray-500 hover:text-red-600 transition"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Desktop selected files */}
        {files.length > 0 && (
          <div className="hidden md:block">
            <h2 className="text-sm font-medium mb-2">Selected Files</h2>
            <ul className="space-y-2">
              {files.map((f, i) => (
                <li
                  key={`${f.name}-${i}`}
                  className="flex items-center justify-between rounded-xl border p-3 text-sm"
                >
                  <span className="truncate mr-3">
                    {f.name}{" "}
                    <span className="text-gray-400">
                      ({Math.round(f.size / 1024)} KB)
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="text-gray-500 hover:text-red-600 transition"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              setFiles([]);
              setForm({
                title: "",
                date: "",
                time: "",
                location: "",
                description: "",
                links: "",
                tags: "",
              });
            }}
            className="px-4 py-2 rounded-xl border hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 text-white font-bold rounded-xl bg-gradient-to-r from-pink-500 to-yellow-500 hover:shadow-lg disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Posting..." : "Post Event"}
          </button>
        </div>

        {(postMessage || postError) && (
          <p
            className={`text-sm mt-2 ${
              postMessage ? "text-green-600" : "text-red-600"
            }`}
          >
            {postMessage || postError}
          </p>
        )}
      </form>
    </div>
  );
}
