import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Helper Icons
const MenuIcon = (props) => (
  <svg {...props} width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const XIcon = (props) => (
  <svg {...props} width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

const ChevronDown = (props) => (
  <svg {...props} width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

// Phone Icon
const PhoneIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    // 1. Stroke width is slightly reduced for a more refined look
    strokeWidth={1.5}
    stroke="currentColor"
  >
    {/* 2. Added a subtle drop shadow for depth and clarity */}
    <defs>
      <filter id="shadow">
        <feDropShadow dx="0.5" dy="1" stdDeviation="0.5" floodOpacity="0.3" />
      </filter>
    </defs>
    <path
      // The shadow is applied here
      filter="url(#shadow)"
      strokeLinecap="round"
      strokeLinejoin="round"
      // 3. The vector path is slightly adjusted for better curves and balance
      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z"
    />
  </svg>
);


export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const { user, logout, isAdmin } = useAuth();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Properties", path: "/properties" },
  ];

  const moreLinks = [
    { name: "Contact", path: "/contact" },
    { name: "Blog", path: "/blog" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setMoreDropdownOpen(false);
      }
      if (!event.target.closest(".profile-dropdown-container")) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const CustomNavLink = ({ href, children }) => (
    <Link
      to={href}
      className="relative px-2 py-2 text-md text-gray-300 transition-colors duration-300 hover:text-white"
    >
      {children}
    </Link>
  );

  const DropdownLink = ({ href, children }) => (
    <Link
      to={href}
      className="block w-full px-2 py-2 text-left text-md text-gray-300 hover:bg-gray-700 hover:text-white"
    >
      {children}
    </Link>
  );

  const MobileNavLink = ({ href, children }) => (
    <Link
      to={href}
      onClick={() => setMobileMenuOpen(false)}
      className="block rounded-md px-2 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
    >
      {children}
    </Link>
  );

  const ProfileAvatar = ({ user, size = "w-10 h-10" }) => {
    if (user?.photoURL) {
      return (
        <img
          src={user.photoURL}
          alt={user.name}
          className={`${size} rounded-full object-cover`}
        />
      );
    }
    const firstLetter = user?.name?.charAt(0)?.toUpperCase() || "U";
    return (
      <div className={`${size} rounded-full bg-blue-600 flex items-center justify-center text-white font-medium`}>
        {firstLetter}
      </div>
    );
  };

  return (
    <nav className="bg-blue-950 shadow-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between">
          {/* Logo + Nav links */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <img
                src="/images/Zipacres Logo.png"
                alt="ZipAcres Logo"
                className="h-16 w-auto"
              />
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-2">
                {navLinks.map((link) => (
                  <CustomNavLink key={link.name} href={link.path}>
                    {link.name}
                  </CustomNavLink>
                ))}

                {/* More Dropdown */}
                <div className="relative dropdown-container">
                  <button
                    onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                    className="flex items-center rounded-md px-2 py-2 text-md text-gray-300 hover:text-white"
                  >
                    <span>More</span>
                    <ChevronDown
                      className={`ml-1 transition-transform ${moreDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence>
                    {moreDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 z-10 mt-2 w-48 text-white rounded-md bg-gray-800 py-1 shadow-lg ring-1 ring-blue-950 ring-opacity-5"
                      >
                        {moreLinks.map((link) => (
                          <DropdownLink key={link.name} href={link.path}>
                            {link.name}
                          </DropdownLink>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Admin */}
                {isAdmin && (
                  <CustomNavLink href="/admin/dashboard">Admin</CustomNavLink>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Auth + Phone */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Phone */}
            <div className="flex items-center space-x-2 text-gray-300">
              <a
                href="tel:+919990263263"
                className="flex items-center space-x-2 text-gray-300 transition-colors hover:text-white"
              >
                <PhoneIcon className="w-5 h-5 text-green-400" />
                <span className="text-sm font-medium">9990-263-263</span>
              </a>
            </div>

            {!user ? (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-blue-800 ${isActive ? "bg-blue-800" : ""
                    }`
                  }
                >
                  Log In
                </NavLink>
                <NavLink
                  to="/signup"
                  className={({ isActive }) =>
                    `rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-blue-800 ${isActive ? "bg-blue-800" : ""
                    }`
                  }
                >
                  Sign Up
                </NavLink>
              </>
            ) : (
              <div className="relative profile-dropdown-container ">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 rounded-full border-1 border-blue-900 hover:border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-800 transition-all"
                >
                  <ProfileAvatar user={user} />
                </button>
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-blue-900 z-10"
                    >
                      <div className="py-2 bg-blue-950 text-center justify-center">
                        <div className="py-2 text-white border-b mb-2">
                          <span className="text-sm font-medium text-semibold ">Hi, {user.name}</span>
                        </div>
                        <button
                          onClick={logout}
                          className="rounded-md bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
                        >
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-300 hover:text-white"
            >
              {mobileMenuOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden"
          >
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              {navLinks.map((link) => (
                <MobileNavLink key={link.name} href={link.path}>
                  {link.name}
                </MobileNavLink>
              ))}
              {moreLinks.map((link) => (
                <MobileNavLink key={link.name} href={link.path}>
                  {link.name}
                </MobileNavLink>
              ))}
              {isAdmin && (
                <MobileNavLink href="/admin/dashboard">Admin</MobileNavLink>
              )}
            </div>

            <div className="border-t-4 border-blue-900 pb-3 pt-4 px-2">
              {/* Mobile Phone */}
              <div className="flex items-center space-x-2 px-3 mb-2 text-gray-300">
                <a
                  href="tel:+919990263263"
                  className="flex items-center space-x-2 text-gray-300 transition-colors hover:text-white"
                >
                  <PhoneIcon className="w-5 h-5 text-green-400" />
                  <span className="text-sm font-medium">9990-263-263</span>
                </a>
              </div>

              <div className="flex flex-col space-y-2">
                {!user ? (
                  <>
                    <NavLink
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `block text-center rounded-md px-3 py-2 text-base font-medium text-white hover:bg-blue-900 ${isActive ? "bg-blue-800" : "bg-gray-700"
                        }`
                      }
                    >
                      Log In
                    </NavLink>
                    <NavLink
                      to="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `block text-center rounded-md px-3 py-2 text-base font-medium text-white hover:bg-blue-800 ${isActive ? "bg-blue-800" : "bg-gray-700"
                        }`
                      }
                    >
                      Sign Up
                    </NavLink>
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-3 px-3">
                      <ProfileAvatar user={user} size="w-8 h-8" />
                      <span className="text-sm font-medium text-white text-semibold">Hi, {user.name}</span>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="block text-center rounded-md bg-red-700 px-3 py-2 text-base font-medium text-white hover:bg-red-800"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
