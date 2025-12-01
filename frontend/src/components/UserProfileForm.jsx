import React, { useState, useEffect } from 'react';
import { Tooltip } from '@mui/material';
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import './ProfilePage.css';

export default function UserProfileForm() {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [src, setSrc] = useState(`http://localhost:4000/api/profile/avatar/${userId}`);
 
  const [formData, setFormData] = useState({
    name: "",
    pronouns: "",
    accountType: "",
    role: "",
    company: "",
    experience: "",
    age: "",
    location: "",
    interests: [],
    tags: [],
    newTag: "",
    profilePic: null,
    profilePicPreview: null,
    bio: "",
  });

  const STEM_OPTIONS = [
    "Engineering",
    "Computer Science",
    "Mathematics",
    "Biology",
    "Physics",
    "Chemistry",
    "Technology",
  ];

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("userProfile"));
    if (savedData) setFormData(savedData);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (e) => {
    const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setFormData((prev) => ({ ...prev, interests: selected }));
  };

  const handleTagAdd = () => {
    if (formData.newTag.trim() && !formData.tags.includes(formData.newTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: "",
      }));
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleProfilePicUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profilePic: file,
        profilePicPreview: URL.createObjectURL(file),
      }));
      setFile(file);
      setSrc(URL.createObjectURL(file));
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();

    try {
    
      await uploadFormData();   // sends all the text-based fields

      localStorage.setItem("userProfile", JSON.stringify(formData));

      alert("Profile saved successfully!");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Failed to save profile.");
    }
  }

  async function uploadFormData() {
    const fd = new FormData();

    // Text fields
    fd.append("name", formData.name);
    fd.append("pronouns", formData.pronouns)
    fd.append("accountType", formData.accountType);
    fd.append("role", formData.role);
    fd.append("company", formData.company);
    fd.append("experience", formData.experience);
    fd.append("age", formData.age);
    fd.append("location", formData.location);
    fd.append("bio", formData.bio);

    // Arrays → JSON strings
    fd.append("interests", JSON.stringify(formData.interests));
    fd.append("tags", JSON.stringify(formData.tags));

    // Profile picture (optional)
    if (formData.profilePic) {
      fd.append("profilePic", formData.profilePic); 
    }

    const res = await fetch(`http://localhost:4000/api/profile/${userId}`, {
      method: "POST",
      body: fd, // multipart/form-data automatically handled
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    console.log("Profile form + picture uploaded in one request!");
  }

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const inputClass = "w-full mb-4 p-3 rounded-xl bg-pink-50 border focus:outline-none focus:ring-2 focus:ring-pink-400 transition";

  return (
    <motion.div
      className="ps-page"
    >
      <div className="ps-panel">

          <h2 className="forgot-pass-text text-center mb-4">Edit Your Profile</h2>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div>
                <Tooltip title="Your full name" arrow>
                  <input
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </Tooltip>

                <label className="block mb-2 font-medium">Account Type</label>
                <select
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="">-- Choose --</option>
                  <option value="student">Student</option>
                  <option value="professional">Professional</option>
                </select>

                {formData.accountType === "professional" && (
                  <div className="mt-4 space-y-3">
                    <Tooltip title="Your current role" arrow>
                      <input
                        name="role"
                        placeholder="Current Role"
                        value={formData.role}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </Tooltip>
                    <Tooltip title="Company you work at" arrow>
                      <input
                        name="company"
                        placeholder="Company"
                        value={formData.company}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </Tooltip>
                    <Tooltip title="Years of experience" arrow>
                      <input
                        name="experience"
                        type="number"
                        placeholder="Years of Experience"
                        value={formData.experience}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </Tooltip>
                  </div>
                )}

                <div className="flex justify-end mt-4">
                  <button type="button" className="ps-btn" onClick={nextStep}>
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Demographics */}
            {step === 2 && (
              <div>
                <Tooltip title="Your age in years" arrow>
                  <input
                    name="age"
                    type="number"
                    placeholder="Age"
                    value={formData.age}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </Tooltip>

                <Tooltip title="City, Country" arrow>
                  <input
                    name="location"
                    placeholder="Location"
                    value={formData.location}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </Tooltip>

                <div className="flex justify-between mt-4">
                  <button type="button" className="ps-btn ps-btn-ghost" onClick={prevStep}>
                    ← Back
                  </button>
                  <button type="button" className="ps-btn" onClick={nextStep}>
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Interests */}
            {step === 3 && (
              <div>
                <label className="block mb-2 font-medium">STEM Interests:</label>
                <select
                  multiple
                  onChange={handleMultiSelect}
                  className={inputClass + " h-32"}
                >
                  {STEM_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>

                <div className="mt-4">
                  <label className="block mb-2 font-medium">Custom Tags:</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      name="newTag"
                      placeholder="Add a tag (e.g., WomenInSTEM)"
                      value={formData.newTag}
                      onChange={handleChange}
                      className={inputClass + " flex-grow"}
                    />
                    <button type="button" className="ps-btn" onClick={handleTagAdd}>
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleTagRemove(tag)}
                          className="ml-2 text-red-500"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between mt-4">
                  <button type="button" className="ps-btn ps-btn-ghost" onClick={prevStep}>
                    ← Back
                  </button>
                  <button type="button" className="ps-btn" onClick={nextStep}>
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Picture + Bio */}
            {step === 4 && (
              <div>
                <label className="block mb-2 font-medium">Upload Profile Picture:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicUpload}
                  className="mb-4"
                />
                {formData.profilePicPreview && (
                  <img
                    src={src}
                    alt="Preview"
                    onError={() => setSrc("/public/default_avatar.png")}
                    className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
                  />
                )}

                <Tooltip title="Write a short bio about yourself" arrow>
                  <textarea
                    name="bio"
                    placeholder="Short bio..."
                    value={formData.bio}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </Tooltip>

                <div className="flex justify-between mt-4">
                  <button type="button" className="ps-btn ps-btn-ghost" onClick={prevStep}>
                    ← Back
                  </button>
                  <button type="submit" className="ps-btn">
                    Save Profile
                  </button>
                </div>
              </div>
            )}

          </form>
        </div>
    </motion.div>
  );
}