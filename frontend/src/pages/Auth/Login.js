import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import LoginIcon from '@mui/icons-material/Login';
import InputAdornment from '@mui/material/InputAdornment';
import './Auth.css';
import '../../styles/ProfileSetup.css';
import '../../styles/prideProfile.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!email) e.email = "Email is required";
    if (!password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setServerError("");
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Login failed");
      }

      const data = await res.json();
      localStorage.setItem("userId", data.id);
      console.log("Saved user id:", localStorage.getItem("userId"));

      // --- NAVIGATION LOGIC AFTER SUCCESSFUL LOGIN ---
      // If backend mode enabled, send user to profile-setup and let ProfileSetup call GET /api/profile. Edited to navigate to "Edit Profile" page! - J
      if (process.env.REACT_APP_USE_BACKEND === 'true') {
        navigate('/edit-profile');
      } else {
        // Frontend-only: check localStorage flag
        const profileComplete = localStorage.getItem('ps_profileComplete');
        if (profileComplete !== '1') {
          // not completed — force profile setup flow
          navigate('/edit-profile');
          console.log("SETUP")
        } else{
          // on success, navigate home (or dashboard)
          navigate("/home");
        }
      }
     


      
    } catch (err) {
      setServerError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ps-page">
      <div className="ps-panel">

          <h2 className="forgot-pass-text text-center">Sign in to your account</h2>

          {serverError && (
            <Box className="mb-4">
              <Alert severity="error">{serverError}</Alert>
            </Box>
          )}

          <form className="w-10/12 mx-auto" onSubmit={handleSubmit} noValidate>

            {/* Email Field */}
            <Tooltip
              title={errors.email || "Enter your email"}
              arrow
              placement="top"
            >
              <Box className="mb-4 relative">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                />
              </Box>
            </Tooltip>

            {/* Password Field */}
            <Tooltip
              title={errors.password || "Enter your password"}
              arrow
              placement="top"
            >
              <Box className="mb-4 relative">
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium"
                  onClick={() => setShowPw((s) => !s)}
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </Box>
            </Tooltip>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="ps-btn"
            >
              {loading ? <CircularProgress size={20} sx={{ color: "white" }} /> : "Sign in"}
            </button>

            {/* Footer */}
            <Box className="text-center mt-4 text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">Sign up</Link>
            </Box>

            <Box className="text-center mt-2 text-sm text-gray-600">
              <Link to="/forgot-password" className="text-blue-600 hover:underline">Forgot Password?</Link>
            </Box>

          </form>
        </div>
    </div>
  );
}