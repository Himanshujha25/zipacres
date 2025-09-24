import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google"; // ✅ Google Login
import { useAuth } from "../../context/AuthContext";

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

export default function Signin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  // ✅ Handle Email/Password Signin
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please fill all fields.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("https://zipacres.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      setUser({ ...data.user, token: data.token });
      localStorage.setItem("token", data.token);


      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/properties");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Handle Google Signin
  const handleGoogleSuccess = async (credentialResponse) => {
  try {
    const tokenId = credentialResponse.credential; // Google ID token

    const res = await fetch("https://zipacres.onrender.com/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tokenId }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Google login failed");

    // ✅ Save user + token in context + storage
    setUser({ ...data.user, token: data.token });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    // Redirect based on role
    if (data.user.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/properties");
    }
  } catch (err) {
    setError(err.message);
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
          <a href="/" className="flex flex-col items-center">
            <img
              src="/images/Zipacres Logo.png"
              alt="ZipAcres Logo"
              className="h-14 mb-1"
            />
          </a>
          <h1 className="text-3xl font-semibold tracking-tighter text-gray-800">
            Sign In
          </h1>
          <p className="text-gray-500 mt-1 tracking-tighter text-sm">
            Please login to your account.
          </p>
        </div>

        {/* Email/Password Login */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
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
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-[#0A2540] text-white font-bold py-3 rounded-lg transition-all hover:bg-gray-800 disabled:bg-gray-400 mt-2"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="flex items-center justify-center my-6">
          <div className="w-full border-t border-gray-300"></div>
          <span className="px-2 text-gray-500 text-sm">OR</span>
          <div className="w-full border-t border-gray-300"></div>
        </div>

        {/* ✅ Google Signin */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google login failed")}
          />
        </div>

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

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-blue-900 hover:text-blue-950 font-semibold"
          >
            Sign Up
          </a>
        </p>
      </motion.div>
    </div>
  );
}
