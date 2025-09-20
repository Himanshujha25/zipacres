import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";

// 👁️ Eye toggle icon
const EyeIcon = ({ isVisible }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {isVisible ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22" />
      </>
    )}
  </svg>
);

export default function Signup() {
  const [role, setRole] = useState("user");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    countryCode: "+91",
    adminCode: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // OTP state
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const navigate = useNavigate();

  // Password must have ≥6 chars, one uppercase, one number
  const isStrongPassword = (pwd) =>
    pwd.length >= 6 && /[A-Z]/.test(pwd) && /\d/.test(pwd);

  // ---- OTP ----
  const handleSendOtp = async () => {
    if (!/^\d{10}$/.test(form.phone)) {
      setError("Enter a valid 10-digit mobile number first.");
      return;
    }
    try {
      await fetch("https://zipacres.onrender.com/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: form.countryCode + form.phone }),
      });
      setIsOtpSent(true);
      setError("");
      setSuccess("OTP sent to your phone.");
    } catch {
      setError("Failed to send OTP.");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await fetch("https://zipacres.onrender.com/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: form.countryCode + form.phone,
          otp,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsVerified(true);
        setSuccess("Phone verified.");
      } else {
        setError("Invalid OTP.");
      }
    } catch {
      setError("Verification failed.");
    }
  };

  // ---- submit ----
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!/^\d{10}$/.test(form.phone)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!isStrongPassword(form.password)) {
      setError(
        "Password must be at least 6 chars, with 1 uppercase & 1 number."
      );
      return;
    }
    if (form.password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (role === "admin" && form.adminCode.trim() === "") {
      setError("Admin code is required for admin signup.");
      return;
    }
    // if (!isVerified) {
    //   setError("Verify your phone number first.");
    //   return;
    // }

    setIsLoading(true);
    try {
      const res = await fetch(
        "https://zipacres.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
            role,
            phone: form.countryCode + form.phone,
            adminCode: form.adminCode,
          }),
        }
      );

      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Registration failed");

      // after your registration success
if (!data.success) throw new Error(data.message || "Registration failed");

localStorage.setItem("token", data.token);
setSuccess("Registration successful! Redirecting to login...");

// then redirect
setTimeout(() => navigate("/login"), 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-gray-100 to-indigo-100 flex items-center justify-center p-4 py-8">
      <motion.div
        className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden p-8 sm:p-12"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-4">
          <a href="/" className="mb-2 flex flex-col items-center">
            <img
              src="/images/Zipacres Logo.png"
              alt="ZipAcres Logo"
              className="h-14 mb-1"
            />
          </a>
          <h1 className="text-3xl font-semibold text-gray-800">
            Create an Account
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Join us to find your perfect home.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sign up as
            </label>
            <div className="grid grid-cols-2 gap-2 rounded-lg bg-gray-200 p-1">
              {["user", "admin"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`w-full rounded-md py-2 text-sm font-semibold transition-all ${
                    role === r
                      ? "bg-white text-gray-800 shadow"
                      : "bg-transparent text-gray-500"
                  }`}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* name */}
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="John Doe"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            required
          />
          {/* email */}
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* phone + send otp */}
         {/* phone + send otp */}
<div className="flex">
  <select
    value={form.countryCode}
    onChange={(e) => setForm({ ...form, countryCode: e.target.value })}
    className="rounded-l-lg border-r-0 border border-gray-300 bg-gray-50 px-2"
    disabled={isOtpSent} 
  >
    <option>+91</option>
    <option>+1</option>
    <option>+44</option>
  </select>
  <input
    type="tel"
    value={form.phone}
    onChange={(e) => {
      setForm({ ...form, phone: e.target.value });
      setIsVerified(false);
    }}
    placeholder="9876543210"
    className="w-full px-4 py-3 rounded-r-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
    required
    disabled={isOtpSent} // disable after sending OTP
  />
  <button
    type="button"
    onClick={handleSendOtp}
    className="ml-2 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm"
  >
    {isOtpSent ? "Resend OTP" : "Send OTP"}
  </button>
</div>

  {/* otp input */}
 {isOtpSent && (
  <div className="mt-3 bg-white/40 backdrop-blur-md p-4 rounded-xl shadow-lg">
    <label
      htmlFor="otp"
      className="block text-gray-700 text-sm mb-2"
    >
      Enter the 6-digit code we sent
    </label>

    <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
      <input
        id="otp"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={6}
        value={otp}
        onChange={(e) => {
          const v = e.target.value.replace(/\D/g, '');
          setOtp(v);
        }}
        placeholder="0 0 0 0 0 0"
        className="
          w-full sm:flex-1
          px-6 py-4 
          rounded-lg 
          border border-gray-300 
          focus:outline-none focus:ring-2 focus:ring-blue-500
          tracking-[1em]
          text-center text-lg font-mono
        "
      />

      <button
        type="button"
        onClick={handleVerifyOtp}
        disabled={otp.length !== 6}
        className={`w-full sm:w-auto px-4 py-3 rounded-lg text-white text-sm transition-colors 
          ${
            otp.length === 6
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
      >
        Verify
      </button>
    </div>
  </div>
)}

{isVerified && (
  <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
    Phone verified
  </p>
)}

          {/* password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Enter strong password"
              className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <EyeIcon isVisible={showPassword} />
            </button>
          </div>

          {/* confirm password */}
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            required
          />

          {role === "admin" && (
            <input
              type="password"
              value={form.adminCode}
              onChange={(e) =>
                setForm({ ...form, adminCode: e.target.value })
              }
              placeholder="Enter admin verification code"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              required
            />
          )}

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-[#0A2540] text-white font-bold py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 mt-2 flex items-center justify-center"
          >
            {isLoading ? (
              <span className="loader w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Create Account"
            )}
          </motion.button>
        </form>


        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-red-600 text-sm text-center bg-red-100 p-3 rounded-lg mt-4"
            >
              {error}
            </motion.p>
          )}
          {success && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-green-600 text-sm text-center bg-green-100 p-3 rounded-lg mt-4"
            >
              {success}
            </motion.p>
          )}
        </AnimatePresence>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-900 hover:text-blue-950 font-semibold"
          >
            Sign In
          </a>
        </p>
      </motion.div>
    </div>
  );
}
