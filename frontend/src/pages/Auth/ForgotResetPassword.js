import { useState, useEffect } from "react";
import { Box, CircularProgress, Tooltip } from "@mui/material";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import './Auth.css';
import '../../styles/ProfileSetup.css';
import '../../styles/prideProfile.css';

export default function ForgotResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  // Step control: "email" → first screen, "question" → second screen, "reset" → third screen
  const [step, setStep] = useState("email");

  // Step 1 states
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 2 states
  const [userId, setUserId] = useState(null);
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");

  // Step 3 states
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validatingToken, setValidatingToken] = useState(false);

  // -----------------------------
  // STEP 1 → SUBMIT EMAIL
  // -----------------------------

  const handleVerify = async () => {
    if (!email) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter your email address",
      });
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:4000/api/auth/forgot/verify", {
        email
      });

      setUserId(res.data.userId);
      setSecurityQuestion(res.data.security_question);
      setStep("question");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.error || "Email not found",
      });
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // STEP 2 → SUBMIT SECURITY ANSWER
  // -----------------------------

  const handleVerifyAnswer = async () => {
    if (!securityAnswer.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please answer the security question",
      });
      return;
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:4000/api/auth/forgot/verify-answer", {
        userId,
        security_answer: securityAnswer
      });

      setStep("reset");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.error || "Security answer is incorrect",
      });
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // STEP 2 → SUBMIT NEW PASSWORD
  // -----------------------------
  const handleReset = async () => {
    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Passwords do not match",
      });
      return;
    }
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Password does not meet the criteria",
      });
      return;
    }
    if (!/[0-9]/.test(password)) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Password must contain at least one number",
      });
      return;
    }

    try {
      setValidatingToken(true);
      setLoading(true);

      await axios.post("http://localhost:4000/api/auth/forgot/reset", {
        userId,
        password
      });
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Password has been reset successfully",
      });
      window.location.href = "/login";
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to reset password. Please try again.",
      });
      window.location.reload();
    } finally {
      setLoading(false);
      setValidatingToken(false);
    }
  };

  // ---------------------------------------
  // STEP 1 — EMAIL
  // ---------------------------------------
  if (step === "email") {
  return (
    <div className="ps-page">
      <div className="ps-panel">

        <h2 className="forgot-pass-text">Forgetting me so soon?</h2>

        <div className="w-10/12 mx-auto text-center">

          <Box className="mb-4 px-2 text-left">

            <Tooltip
              title="Enter the email associated with your account"
              arrow
              placement="top"
            >
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
              />
            </Tooltip>
          </Box>

          <button onClick={handleVerify} disabled={loading} className="ps-btn">
            {loading ? <CircularProgress size={20} /> : "Reset Password"}
          </button>
        </div>

      </div>
    </div>
  );
}

  // ---------------------------------------
  // STEP 2 — SECURITY QUESTION
  // ---------------------------------------
  if (step === "question") {
    return (
      <div className="ps-page">
        <div className="ps-panel">

          <h2 className="forgot-pass-text">Security Question</h2>

          <div className="w-10/12 mx-auto text-center">
            <Box className="mb-6 text-left">
              <label className="input-label-text block mb-2">
                {securityQuestion}
              </label>

              <input
                type="text"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                placeholder="Enter your answer"
                className="input"
              />
            </Box>

            <button onClick={handleVerifyAnswer} disabled={loading} className="ps-btn">
              {loading ? <CircularProgress size={20} sx={{ color: "white" }} /> : "Verify Answer"}
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ---------------------------------------
  // STEP 3 — RESET PASSWORD
  // ---------------------------------------
  return (
    <div className="ps-page">
      <div className="ps-panel">

        <h2 className="forgot-pass-text">Reset Your Password</h2>

        <div className="w-10/12 mx-auto text-center">

          <Box className="flex flex-col md:flex-row-reverse md:justify-center md:items-center">

            <Box className="w-full md:w-1/2 flex justify-center">
              <Box className="w-3/4 bg-red-50 p-4 flex flex-wrap text-left border border-[#FFD8D8] rounded-[10%]">
                <ul className="p-4 list-disc">
                  <li className="text-left text-sm mb-2">must be 8 characters long</li>
                  <li className="text-left text-sm mb-2">must have an upper-case letter</li>
                  <li className="text-left text-sm mb-2">must have at least one symbol</li>
                </ul>
              </Box>
            </Box>

            <Box className="w-full md:w-1/2 mb-4 flex flex-col gap-5">

              <Box className="mb-4 text-left relative">
                <Tooltip
                  title="Enter your new password"
                  arrow
                  placement="top"
                >
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New Password"
                    className="input"
                  />
                </Tooltip>
              </Box>

              <Box className="mb-4 text-left relative">
                <Tooltip
                  title="Confirm your password"
                  arrow
                  placement="top"
                >
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    className="input"
                  />
                </Tooltip>
              </Box>

            </Box>
          </Box>

          <button onClick={handleReset} disabled={loading} className="ps-btn">
            {loading ? <CircularProgress size={20} sx={{ color: "white" }} /> : "Reset"}
          </button>

        </div>
      </div>
    </div>
  );
}