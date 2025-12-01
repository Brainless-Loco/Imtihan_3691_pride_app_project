import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Auth.css';
import '../../styles/ProfileSetup.css';
import '../../styles/prideProfile.css';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { Box, CircularProgress, Tooltip } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link } from 'react-router-dom';

function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim().toLowerCase());
}

function isPhone(v) {
  return /^\+?[0-9\s\-()]{7,20}$/.test(v.trim());
}

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");

  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!isEmail(email)) e.email = "Enter a valid email.";
    if (!isPhone(phone)) e.phone = "Enter a valid phone number.";
    if (password.length < 8) e.password = "Use at least 8 characters.";
    if (password !== confirm) e.confirm = "Passwords do not match.";
    if (!securityQuestion.trim()) e.securityQuestion = "Security question is required.";
    if (!securityAnswer.trim()) e.securityAnswer = "Security answer is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    console.log("GOOD");
    setServerError("");
    console.log("GOOD2");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: email.trim(), 
          password, 
          phone_number: phone.trim(),
          security_question: securityQuestion.trim(),
          security_answer: securityAnswer.trim()
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Registration failed");
      }

      localStorage.setItem("userId", data.id);
      console.log(`Stored ID: ${localStorage.getItem("userId")}`)
      

      navigate("/profile-setup");
    } catch (err) {
      setServerError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ps-page">
      <div className="ps-panel">

        <h2 className="forgot-pass-text">Create your account</h2>

        {serverError && (
          <Box className="mb-4">
            <div className="text-red-500 font-medium">{serverError}</div>
          </Box>
        )}

        <form className="w-10/12 mx-auto" onSubmit={handleSubmit} noValidate>

          {/* Email */}
          <Box className="mb-4 relative">
            <Tooltip title={errors.email || "Enter a valid email address"} placement="top">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`input ${errors.email ? 'input-error' : ''}`}
              />
            </Tooltip>
          </Box>

          {/* Phone */}
          <Box className="mb-4 relative">
            <Tooltip title={errors.phone || "Include country code if outside Canada (e.g., +1)"} placement="top">
              <input
                type="tel"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`input ${errors.phone ? 'input-error' : ''}`}
              />
            </Tooltip>
          </Box>

          {/* Password */}
          <Box className="mb-4 relative">
            <Tooltip title={errors.password || "Min 8 chars. Use letters, numbers, symbols."} placement="top">
              <input
                type={showPw ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`input ${errors.password ? 'input-error' : ''}`}
              />
            </Tooltip>

            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium"
              onClick={() => setShowPw((s) => !s)}
            >
              {showPw ? "Hide" : "Show"}
            </button>
          </Box>

          {/* Confirm Password */}
          <Box className="mb-4 relative">
            <Tooltip title={errors.confirm || "Re-enter your password"} placement="top">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={`input ${errors.confirm ? 'input-error' : ''}`}
              />
            </Tooltip>

            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium"
              onClick={() => setShowConfirm((s) => !s)}
            >
              {showConfirm ? "Hide" : "Show"}
            </button>
          </Box>

          {/* Security Question */}
          <Box className="mb-4 relative">
            <Tooltip
              title={errors.securityQuestion || "Create a security question for account recovery"}
              placement="top"
            >
              <input
                type="text"
                placeholder="Security Question"
                value={securityQuestion}
                onChange={(e) => setSecurityQuestion(e.target.value)}
                className={`input ${errors.securityQuestion ? 'input-error' : ''}`}
              />
            </Tooltip>
          </Box>

          {/* Security Answer */}
          <Box className="mb-6 relative">
            <Tooltip
              title={errors.securityAnswer || "Answer to your security question"}
              placement="top"
            >
              <input
                type="text"
                placeholder="Security Answer"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                className={`input ${errors.securityAnswer ? 'input-error' : ''}`}
              />
            </Tooltip>
          </Box>

          {/* Submit */}
          <button type="submit" disabled={loading} className="ps-btn">
            {loading ? <CircularProgress size={20} sx={{ color: "white" }} /> : "Create Account"}
          </button>
        </form>

        <Box className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">Sign in</Link>
        </Box>

      </div>
    </div>
  );
}