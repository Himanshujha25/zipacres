import React, { useState } from "react";
import { motion } from "framer-motion";

// ---- ICON COMPONENTS ----
const SocialIcon = ({ href, children, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-110 transform"
    aria-label={label}
  >
    {children}
  </a>
);

const FacebookIcon = () => (
  <svg className="w-10 h-8 text-zinc-400" fill="currentColor" viewBox="0 0 24 24">
    <path
      fillRule="evenodd"
      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
      clipRule="evenodd"
    />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-10 h-8 text-zinc-400" fill="currentColor" viewBox="0 0 24 24">
    <path
      fillRule="evenodd"
      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.08 2.525c.636-.247 1.363-.416 2.427-.465C9.53 2.013 9.884 2 12.315 2zM12 8.118a3.882 3.882 0 100 7.764 3.882 3.882 0 000-7.764zM12 14.25a2.25 2.25 0 110-4.5 2.25 2.25 0 010 4.5zM16.882 8.25a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z"
      clipRule="evenodd"
    />
  </svg>
);

const YouTubeIcon = () => (
  <svg className="w-10 h-8 text-zinc-400" fill="currentColor" viewBox="0 0 24 24">
    <path
      fillRule="evenodd"
      d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
      clipRule="evenodd"
    />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const MailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const LocationIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

// ---- ANIMATIONS ----
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// ---- MAIN FOOTER COMPONENT ----
export default function Footer() {
  const [showTerms, setShowTerms] = useState(false);

  return (
    <footer className="bg-gradient-to-br from-gray-950 to-blue-950 text-zinc-300 relative overflow-hidden border-t-2">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        {/* ---- FOOTER CONTENT ---- */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div variants={fadeInUp}>
            <h2 className="text-3xl font-semibold mb-2 bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">ZipAcres</h2>
            <p className="text-gray-400 mb-6">
              Your trusted partner in finding the perfect property. We specialize in premium real estate across India's top cities, offering personalized service and expert guidance.
            </p>
            <div className="space-y-3 mb-4">
              <div className="flex items-start text-gray-400">
                <LocationIcon className="w-6 h-6 flex-shrink-0" />
                <span className="ml-3">Tower 211A, Near Universal Hospital, Bypass Road, Badarpur Border, New Delhi 110044</span>
              </div>
              <div className="flex items-center text-gray-400">
                <PhoneIcon />
                <span className="ml-3">+91 9990263263</span>
              </div>
              <div className="flex items-center text-gray-400">
                <MailIcon />
                <span className="ml-3">Om.mehtatso@gmail.com</span>
              </div>
            </div>
            <div className="flex space-x-4">
              <SocialIcon href="https://www.facebook.com/share/16t29TXRzJ/?mibextid=wwXIfr" label="Facebook"><FacebookIcon /></SocialIcon>
              <SocialIcon href="https://www.instagram.com/zipacres.in?igsh=b2tyc29wc21vY2c5&utm_source=qr" label="Instagram"><InstagramIcon /></SocialIcon>
              <SocialIcon href="https://www.youtube.com/@zipacres" label="YouTube"><YouTubeIcon /></SocialIcon>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={fadeInUp}>
            <h3 className="font-semibold text-2xl mb-2 bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: "Home", path: "/" },
                { name: "Properties", path: "/properties" },
                { name: "Contact", path: "/contact" },
                { name: "Blog", path: "/blog" },
              ].map((link, idx) => (
                <li key={idx}>
                  <a href={link.path} className="text-gray-300 hover:text-blue-400 flex items-center group">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Property Types */}
          <motion.div variants={fadeInUp}>
            <h3 className="font-semibold text-xl mb-2 bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">Property Types</h3>
            <ul className="space-y-2">
              {[
                "Apartments",
                "Villas",
                "Penthouses",
                "Independent Houses",
                "Builder Floors",
                "Commercial Properties",
                "Plots & Land",
                "Farmhouses",
              ].map((type, idx) => (
                <li key={idx}>
                  <a href="/properties" className="text-gray-400 hover:text-blue-400 flex items-center group">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {type}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div variants={fadeInUp}>
            <h4 className="font-semibold text-lg mb-2 bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">Our Services</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {[
                "Property Sales & Marketing",
                "Land & Plot Transactions",
                "Site Visits & Property Showings",
                "Verified Property Listings",
                "Real Estate Consultation",
              ].map((service, idx) => (
                <li key={idx} className="flex items-center">
                  <svg className="w-3 h-3 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {service}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* ---- BOTTOM SECTION ---- */}
        <motion.div variants={fadeInUp} className="border-t border-white/10 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">© {new Date().getFullYear()} ZipAcres. All Rights Reserved.</p>
            <button
              onClick={() => setShowTerms(true)}
              className="text-sm text-gray-400 hover:text-blue-400 mt-4 md:mt-0"
            >
              Terms & Conditions
            </button>
          </div>
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-xs text-gray-500 mb-3">Certified & Trusted By</p>
            <div className="flex justify-center items-center space-x-6 opacity-60">
              <div className="w-px h-4 bg-gray-600"></div>
              <div className="text-xs text-gray-400">ISO 9001:2015</div>
              <div className="w-px h-4 bg-gray-600"></div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ---- TERMS MODAL ---- */}
      {showTerms && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setShowTerms(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              ✖
            </button>
            <h2 className="text-2xl font-semibold text-blue-700 mb-4">Terms & Conditions</h2>
            <div className="text-gray-700 text-sm space-y-3">
              <p>Welcome to ZipAcres. By accessing or using our services, you agree to the following terms:</p>
              <p>1. All property listings are verified to the best of our ability, but users are responsible for conducting their own due diligence.</p>
              <p>2. ZipAcres is not liable for any direct or indirect loss arising from transactions made using our platform.</p>
              <p>3. Users agree not to misuse or misrepresent any information on the platform.</p>
              <p>4. We may update these terms at any time. Continued use of our services implies acceptance of updated terms.</p>
              <p>For questions, contact us at <span className="text-blue-600">contact@zipacres.com</span>.</p>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
