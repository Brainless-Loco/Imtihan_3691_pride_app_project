import React, { useState, useRef } from "react";

const WhatsHappening = ({ userId, onPostCreated }) => {
  const [content, setContent] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        setError("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }

      setImageFile(file);
      setError("");

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError("Please write something to post");
      return;
    }

    if (!userId) {
      setError("You must be logged in to post");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:4000";
      
      // Use FormData to handle file upload
      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("content", content.trim());
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await fetch(`${API_BASE}/api/posts`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create post");
      }

      setContent("");
      setImagePreview(null);
      setImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 my-4">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
              {userId ? "U" : "?"}
            </div>
          </div>
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening?"
              className="w-full bg-transparent border-none outline-none resize-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-lg"
              rows={3}
              maxLength={500}
            />

            {/* Image Preview */}
            {imagePreview && (
              <div className="relative mt-3">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-64 rounded-xl object-cover w-full"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white rounded-full p-1 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            
            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-800">
              <div className="flex gap-4 items-center">
                {/* Image upload button */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-gray-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition"
                  title="Add image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
                <span className="text-sm text-gray-500">
                  {content.length}/500
                </span>
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !content.trim()}
                className="px-4 py-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-semibold rounded-full hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default WhatsHappening;
