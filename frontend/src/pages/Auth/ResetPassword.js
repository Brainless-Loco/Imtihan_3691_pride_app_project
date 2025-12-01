import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, CircularProgress, Tooltip } from "@mui/material";
import Swal from "sweetalert2";
import './Auth.css';
import '../../styles/ProfileSetup.css';
import '../../styles/prideProfile.css';

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      const token = new URLSearchParams(location.search).get('token');
      if (token) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Link',
          text: 'The password reset link is invalid or has expired',
          confirmButtonText: 'Go to Login'
        }).then(() => navigate('/login'));
        return;
      }
      try {
        // TODO: Implement API call to validate token
        setValidatingToken(false);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Link',
          text: 'The password reset link is invalid or has expired',
          confirmButtonText: 'Go to Login'
        }).then(() => navigate('/login'));
      }
    };
    validateToken();
  }, [navigate, location]);

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Passwords do not match' });
      return;
    }
    if (password.length < 6) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Password must be at least 6 characters long' });
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement API call to reset password
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Your password has been reset successfully',
        confirmButtonText: 'Go to Login'
      }).then(() => navigate('/login'));
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.message || 'Failed to reset password' });
    } finally {
      setLoading(false);
    }
  };

  if (validatingToken) {
    return (
      <Box className="min-h-screen flex items-center justify-center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="ps-page">
      <div className="ps-panel">

          <h2 className="forgot-pass-text">Reset Your Password</h2>

          <form className="w-10/12 mx-auto text-center" onSubmit={handleSubmit} noValidate>

            {/* Password */}
            <Box className="mb-4 relative">
              <Tooltip
                title={
                  <ul className="text-left list-disc pl-4">
                    <li>Must be 8 characters long</li>
                    <li>Must have an uppercase letter</li>
                    <li>Must have at least one symbol</li>
                  </ul>
                }
                arrow
                placement="top"
              >
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
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
            <Box className="mb-6 relative">
              <Tooltip
                title="Re-enter your password"
                arrow
                placement="top"
              >
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input"
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

            {/* Reset Password Button */}
            <button
              type="submit"
              disabled={loading}
              className="ps-btn"
            >
              {loading ? <CircularProgress size={20} sx={{ color: "white" }} /> : "Reset Password"}
            </button>
          </form>
      </div>
    </div>
  );
}