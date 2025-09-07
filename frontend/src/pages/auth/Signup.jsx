import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";

// ✅ Eye toggle icon
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
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ Basic password strength check
  const isStrongPassword = (pwd) => {
    return pwd.length >= 6 && /[A-Z]/.test(pwd) && /\d/.test(pwd);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.countryCode === "+91" && form.phone.length !== 10) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (!isStrongPassword(form.password)) {
      setError("Password must be at least 6 chars, with 1 uppercase & 1 number.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("https://zipacres.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Registration failed");
      }

      // Save token
      localStorage.setItem("token", data.token);

      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Handle Google signup (placeholder)
const handleGoogleSignup = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    try {
      const userInfoRes = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }
      );

      const profile = await userInfoRes.json();

      const res = await fetch("https://zipacres.onrender.com/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tokenId: tokenResponse.credential, // or access_token
          email: profile.email,
          name: profile.name,
        }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("token", data.token);

        if (data.message === "Signup successful") {
          alert("Google signup successful!");
        } else if (data.message === "Login successful") {
          alert("User already exists. Logged in successfully!");
        }

        navigate("/properties");
      } else {
        setError(data.message || "Google signup/login failed");
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  },
  onError: () => setError("Google login failed"),
});




  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-gray-100 to-indigo-100 flex items-center justify-center p-4 py-8">
      <motion.div
        className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden p-8 sm:p-12"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-4">
          <a href="/" className="mb-2 flex flex-col items-center">
            <img src="/images/Zipacres Logo.png" alt="ZipAcres Logo" className="h-14 mb-1" />
          </a>
          <h1 className="text-3xl font-semibold text-gray-800">Create an Account</h1>
          <p className="text-gray-500 mt-1 text-sm">Join us to find your perfect home.</p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sign up as</label>
            <div className="grid grid-cols-2 gap-2 rounded-lg bg-gray-200 p-1">
              {["user", "admin"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`w-full rounded-md py-2 text-sm font-semibold transition-all ${role === r ? "bg-white text-gray-800 shadow" : "bg-transparent text-gray-500"
                    }`}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Full Name */}
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            placeholder="John Doe"
            required
          />

          {/* Email */}
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
            required
          />

          {/* Phone */}
          <div className="flex">
            <select
              value={form.countryCode}
              onChange={(e) => setForm({ ...form, countryCode: e.target.value })}
              className="rounded-l-lg border-r-0 border border-gray-300 bg-gray-50 px-2"
            >
              <option>+91</option>
              <option>+1</option>
              <option>+44</option>
            </select>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-r-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              placeholder="9876543210"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter strong password"
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

          {/* Admin Code (only for admin) */}
          <AnimatePresence>
            {role === "admin" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <input
                  type="password"
                  value={form.adminCode}
                  onChange={(e) => setForm({ ...form, adminCode: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter admin verification code"
                  required
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
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

        {/* Google Signup */}
        <button
          onClick={() => handleGoogleSignup()}
          className="mt-4 w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-3 text-sm font-medium hover:bg-gray-50"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google Icon"
            className="w-6 h-6 mr-2"
          />
          Sign up with Google
        </button>


        {/* Error */}
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
        </AnimatePresence>

        {/* Success */}
        <AnimatePresence>
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

        {/* Redirect */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-900 hover:text-blue-950 font-semibold">
            Sign In
          </a>
        </p>
      </motion.div>
    </div>
  );
}
