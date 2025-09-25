import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// --- ICON COMPONENTS ---
const MapPinIcon = () => (
  <svg
    className="w-8 h-8"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const KeyIcon = () => (
  <svg
    className="w-8 h-8"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
  >
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
);

const BuildingIcon = () => (
  <svg
    className="w-8 h-8"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="9" y1="21" x2="9" y2="9" />
  </svg>
);

const StarIcon = ({ filled }) => (
  <svg
    className={`w-5 h-5 ${filled ? "text-yellow-400" : "text-gray-900"}`}
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
  >
    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const QuoteIcon = () => (
  <svg
    className="w-8 h-8 text-gray-300"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <polyline points="15,18 9,12 15,6"></polyline>
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <polyline points="9,18 15,12 9,6"></polyline>
  </svg>
);

const PhoneIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const MailIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const WhatsAppIcon = () => (
  <svg
    className="w-8 h-8 text-white"
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.487 5.235 3.487 8.413 0 6.556-5.338 11.891-11.893 11.891-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 4.315 1.919 6.066l-1.21 4.389 4.462-1.166zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.371-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01s-.521.074-.792.372c-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

// --- FRAMER MOTION VARIANTS ---
const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const scaleIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function Home() {
  // --- STATE MANAGEMENT ---
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // --- HANDLER FUNCTIONS ---
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim() !== "") {
      console.log(`Subscribed with: ${email}`);
      setIsSubmitted(true);
    }
  };

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  // --- DATA ---
  const allProperties = [
    {
      id: 1,
      name: "Apartment",
      location: "Delhi",
      image: "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg",
      featured: true,
      trending: false,
    },
    {
      id: 2,
      name: "Villa",
      location: "Noida",
      image: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg",
      featured: true,
      trending: true,
    },
    {
      id: 3,
      name: "House",
      location: "Faridabad",
      image: "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg",
      featured: false,
      trending: false,
    },
    {
      id: 4,
      name: "Condo",
      location: "Badarpur",
      image: "https://images.pexels.com/photos/209296/pexels-photo-209296.jpeg",
      featured: false,
      trending: true,
    },
    {
      id: 5,
      name: "Penthouse",
      location: "Ghaziabad",
      image: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg",
      featured: true,
      trending: true,
    },
    {
      id: 6,
      name: "Studio",
      location: "Greater Noida",
      image: "https://images.pexels.com/photos/164558/pexels-photo-164558.jpeg",
      featured: false,
      trending: true,
    },
  ];

  const testimonials = [
    {
      name: "Mehar Chand",
      role: "Customer",
      content:
        "ZipAcres made my plot buying journey smooth and hassle-free. Found the perfect location with their help!",
      rating: 5,
      location: "South Delhi",
      image: "/images/l1.jpeg",
    },
    {
      name: "Yadbeer Singh",
      role: "Customer",
      content:
        "Professional, responsive, and reliable. My home search was stress-free with ZipAcres.",
      rating: 5,
      location: "Delhi",
      image: "/images/l2.jpeg",
    },
    {
      name: "Vishwanath Thakur",
      role: "Customer",
      content: "ZipAcres made my home purchase smooth and stress-free.",
      rating: 5,
      location: "South Delhi",
      image: "/images/l3.jpeg",
    },
    {
      name: "Vishnu Chandra",
      role: "Customer",
      content:
        "ZipAcres made buying my villa seamless—their professional team helped me find the perfect one.",
      rating: 5,
      location: "West Delhi",
      image: "/images/l4.jpeg",
    },
    {
      name: "Viney Kumar",
      role: "Customer",
      content:
        "Found my dream apartment easily with ZipAcres’ expert guidance and support.",
      rating: 5,
      location: "Faridabad",
      image: "/images/l5.jpeg",
    },
    {
      name: "Vikram Singh",
      role: "First-time Buyer",
      content:
        "Exceptional service and market knowledge. They helped me identify great investment opportunities and handled all the paperwork seamlessly.",
      rating: 5,
      location: "New Delhi",
      image: "/images/l6.jpeg",
    },
    {
      name: "Bibekanand Sharma",
      role: "First-time Buyer",
      content:
        "As a first-time buyer, I was nervous. ZipAcres guided me through every step and made sure I understood everything clearly.",
      rating: 5,
      location: "Bihar",
      image: "/images/l7.jpeg",
    },
    {
      name: "Bharat Singh",
      role: "Property Developer",
      content:
        "Outstanding market insights and professional approach. They've been instrumental in helping us launch our residential projects successfully.",
      rating: 5,
      location: "South Delhi",
      image: "/images/l8.jpeg",
    },
  ];

  const trustedCustomers = [
    {
      id: 1,
      name: "Amit Verma",
      image: "/images/rel1.jpeg",
      location: "Delhi",
    },
    {
      id: 2,
      name: "Rashika Jha",
      image: "/images/rel2.jpeg",
      location: "Noida",
    },
    { id: 3, name: "Vikash Kumar", image: "/images/rel3.jpeg", location: "Meerut" },
    {
      id: 4,
      name: "Sarah Sha",
      image: "/images/rel4.jpeg",
      location: "Faridabad",
    },
  ];

  const features = [
    {
      icon: MapPinIcon,
      title: "Prime Locations",
      description:
        "Carefully selected properties in the most desirable neighborhoods.",
      color: "blue",
    },
    {
      icon: KeyIcon,
      title: "Seamless Process",
      description:
        "Streamlined transactions with end-to-end support and guidance.",
      color: "emerald",
    },
    {
      icon: BuildingIcon,
      title: "Expert Service",
      description:
        "Professional agents committed to finding your perfect home.",
      color: "purple",
    },
  ];

  const stats = [
    { number: "2000+", label: "Properties Sold", icon: KeyIcon },
    { number: "99%", label: "Client Satisfaction", icon: StarIcon },
    { number: "50+", label: "Prime Locations", icon: MapPinIcon },
    { number: "10+", label: "Years Experience", icon: BuildingIcon },
  ];

  // --- DERIVED DATA & CONSTANTS ---
  const locationProjects = allProperties.reduce((acc, property) => {
    const location = property.location || "Other";
    if (!acc[location]) {
      acc[location] = [];
    }
    acc[location].push(property);
    return acc;
  }, {});

  const topLocations = Object.entries(locationProjects)
    .sort(([, a], [, b]) => b.length - a.length)
    .slice(0, 4);

  const colorClasses = {
    blue: { bg: "bg-blue-100", text: "text-blue-600", border: "border-blue-100" },
    emerald: { bg: "bg-emerald-100", text: "text-emerald-600", border: "border-emerald-100" },
    purple: { bg: "bg-purple-100", text: "text-purple-600", border: "border-purple-100" },
  };

  // --- SIDE EFFECTS ---
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="w-full bg-gray-100 text-gray-800">
      {/* --- HERO SECTION --- */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="relative w-full h-[70vh] min-h-[500px] flex items-center justify-center text-white overflow-hidden"
      >
        <video
          className="absolute top-1/2 left-1/2 w-full h-full object-cover transform -translate-x-1/2 -translate-y-1/2"
          src="https://cdn.pixabay.com/video/2022/12/22/143861-784164182_large.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/70" />
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.h1
            variants={fadeInUp}
            className="text-4xl md:text-6xl font-semibold mb-2 text-zinc-200 tracking-tight leading-tight"
            style={{ textShadow: "2px 2px 12px rgba(0,0,0,0.8)" }}
          >
            Your Dream Home Awaits
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-md md:text-xl mb-4 text-gray-300 tracking-tight max-w-3xl mx-auto leading-tight"
          >
            Discover exceptional properties with ZipAcres - where luxury meets
            comfort in India's most coveted locations.
          </motion.p>
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="/properties"
              className="inline-block bg-zinc-200 text-gray-900 font-semibold py-4 px-10 text-lg rounded-full hover:bg-gray-300 transition-all duration-300 shadow-xl transform hover:scale-105"
            >
              Explore Properties
            </a>
            <a
              href="/contact"
              className="inline-block bg-transparent border-2 border-zinc-500 text-zinc-200 font-semibold py-4 px-10 text-lg rounded-full hover:bg-gray-300 hover:text-gray-900 transition-all duration-300 shadow-xl transform hover:scale-105"
            >
              Consultant
            </a>
          </motion.div>
        </div>
      </motion.section>

      {/* --- STATS SECTION --- */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-950 border-b"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="text-center"
              >
                <div className="inline-flex p-4 rounded-full bg-gray-200 text-blue-900 mb-2">
                  <stat.icon />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-zinc-100 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* --- TRUSTED CUSTOMERS & VIDEO SECTION --- */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="py-24 px-4 sm:px-6 lg:px-8 bg-zinc-100"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-semibold tracking-tight mb-2 max-w-2xl text-center mx-auto leading-relaxed"
            >
              Trusted Customers
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-gray-600 text-lg md:text-xl text-center max-w-2xl mx-auto leading-tight"
            >
              Thousands trust us to make their dream property a reality.
            </motion.p>
          </div>

          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-20"
          >
            {trustedCustomers.map((customer) => (
              <motion.div
                key={customer.id}
                variants={fadeInUp}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.1, ease: "easeOut" }}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100/50"
              >
                <Link to="/blog" className="relative block">
                  <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10"></div>
                    <img
                      src={customer.image}
                      alt={customer.name}
                      className="w-full h-64 object-cover object-[50%_20%] group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-3 right-3 bg-blue-700 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      Blog
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
                <div className="p-6 bg-blue-900 relative">
                  <div className="relative z-10 text-center">
                    <h3 className="text-lg font-semibold text-white mb-1 tracking-wide">
                      {customer.name}
                    </h3>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <svg className="w-4 h-4 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm text-blue-200 font-medium">{customer.location}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="relative max-w-6xl mx-auto mb-6"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-red-500/20 via-pink-500/20 to-red-500/20 rounded-3xl blur-2xl opacity-60"></div>
            <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-3xl overflow-hidden shadow-2xl border border-gray-700/50">
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/8-GwOifS2MA?autoplay=1&mute=1&loop=1&playlist=8-GwOifS2MA&controls=1&rel=0&modestbranding=1"
                  title="Real Estate Success Stories - Customer Testimonials"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex justify-center">
            <motion.a
              href="https://www.youtube.com/@zipacres"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="group inline-flex items-center gap-4 px-8 py-4 bg-red-800 text-white text-md font-semibold rounded-2xl shadow-2xl hover:shadow-red-500/25 relative overflow-hidden border border-red-500/20"
            >
              <div className="absolute inset-0 bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 fill-current text-white relative z-10 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 576 512">
                <path d="M549.655 124.083c-6.281-23.65-24.81-42.18-48.459-48.459C458.299 64 288 64 288 64S117.701 64 74.804 75.624c-23.65 6.281-42.179 24.81-48.459 48.459C14.721 167.02 14.721 256 14.721 256s0 88.98 11.624 131.917c6.281 23.65 24.81 42.18 48.459 48.459C117.701 448 288 448 288 448s170.299 0 213.196-11.624c23.65-6.281 42.179-24.81 48.459-48.459C561.279 344.98 561.279 256 561.279 256s0-88.98-11.624-131.917zM232 338.5v-165l142 82.5-142 82.5z" />
              </svg>
              <span className="relative z-10">Explore Our YouTube Channel</span>
              <svg className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </motion.a>
          </motion.div>
        </div>
      </motion.section>

      {/* --- PRIME LOCATIONS SECTION --- */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="py-24 px-4 sm:px-6 lg:px-8 bg-zinc-100"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-6">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-2 max-w-2xl text-center mx-auto leading-relaxed">
              Prime Locations
            </h2>
            <p className="text-gray-600 text-lg md:text-xl text-center max-w-2xl mx-auto leading-tight">
              Explore properties across prime neighborhoods and emerging hubs.
            </p>
          </motion.div>
          {topLocations.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {topLocations.map(([location, properties]) => (
                <motion.div
                  key={location}
                  variants={fadeInUp}
                  className="group cursor-pointer"
                >
                  <a href={`/properties`}>
                    <div className="relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                      <img
                        src={properties[0].image}
                        alt={location}
                        className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-zinc-300">
                        <h3 className="text-xl font-semibold">{location}</h3>
                        <p className="text-gray-400 text-sm">Available</p>
                      </div>
                    </div>
                  </a>
                </motion.div>

              ))}
              <div className="col-span-1 md:col-span-2 lg:col-span-4 mt-4">
                <div className="flex items-center justify-center">
               
                    <a href="/properties" className="inline-block bg-blue-900 text-white font-semibold py-3 px-8 text-lg rounded-full hover:bg-blue-800 transition-all duration-300 shadow-xl transform hover:scale-105">
                      View All Locations
                    </a>
                 
                </div>
              </div>



            </motion.div>
          ) : (
            <motion.div variants={fadeInUp} className="text-center">
              <p className="text-gray-500">No location data available.</p>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* --- DRIVEN BY QUALITY SECTION --- */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="bg-white py-24 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-6">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-center mx-auto leading-relaxed max-w-2xl">
              Driven by Quality
            </h2>
            <p className="text-gray-600 text-lg md:text-xl tracking-tighter mx-auto text-center leading-tight max-w-2xl">
              Delivering excellence in real estate services.
            </p>
          </motion.div>
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => {
              const { bg, text, border } = colorClasses[feature.color];
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className={`text-center p-10 bg-gray-100 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-500 border-2 ${border} hover:border-opacity-50`}
                >
                  <div className={`inline-flex p-6 rounded-full ${bg} ${text} mb-6 shadow-xl`}>
                    <feature.icon />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-tight text-md">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* --- CLIENT TESTIMONIALS SECTION --- */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-100 via-white to-gray-300"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-6">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-center mx-auto leading-relaxed max-w-2xl">
              Client Testimonials
            </h2>
            <p className="text-gray-600 text-lg md:text-xl tracking-tighter mx-auto text-center leading-tight max-w-2xl">
              Experiences that speak for themselves.
            </p>
          </motion.div>
          <motion.div
            variants={fadeInUp}
            className="relative max-w-4xl mx-auto"
          >
            <div className="bg-blue-900 rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-6 left-8">
                <QuoteIcon />
              </div>
              <div className="relative z-10">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonials[currentTestimonial].rating)].map(
                      (_, i) => (
                        <StarIcon key={i} filled={true} />
                      )
                    )}
                  </div>
                  <p className="text-lg md:text-xl text-zinc-100 leading-tight tracking-tight mb-6 font-semibold">
                    "{testimonials[currentTestimonial].content}"
                  </p>
                  <div className="flex items-center justify-center space-x-4">
                    <img
                      src={testimonials[currentTestimonial].image}
                      alt={testimonials[currentTestimonial].name}
                      className="w-20 h-20 rounded-full border-4 border-gray-100 shadow-lg"
                    />
                    <div className="text-left">
                      <h4 className="text-md text-zinc-100 font-semibold">
                        {testimonials[currentTestimonial].name}
                      </h4>
                      <p className="text-zinc-200 text-sm">
                        {testimonials[currentTestimonial].role}
                      </p>
                      <p className="text-zinc-100 text-sm">
                        {testimonials[currentTestimonial].location}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
            <button
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-zinc-200 shadow-lg rounded-full p-3 hover:bg-gray-100 transition-all duration-200 hover:scale-110"
              aria-label="Previous testimonial"
            >
              <ChevronLeftIcon />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-zinc-200 shadow-lg rounded-full p-3 hover:bg-gray-100 transition-all duration-200 hover:scale-110"
              aria-label="Next testimonial"
            >
              <ChevronRightIcon />
            </button>
            <div className="flex justify-center space-x-3 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${index === currentTestimonial
                    ? "bg-gray-800 scale-125"
                    : "bg-gray-900 hover:bg-gray-800"
                    }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* --- NEWSLETTER SECTION --- */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-900 via-blue-950 to-blue-900 text-white"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div variants={fadeInUp}>
            <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-semibold mb-4">
              STAY UPDATED
            </span>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-1 max-w-2xl text-center mx-auto leading-relaxed">
              Exclusive Property Alerts
            </h2>
            <p className="text-md text-zinc-400 tracking-tighter leading-tight text-center mb-6 max-w-2xl mx-auto">
              Stay informed with exclusive property updates.
            </p>
          </motion.div>
          <div className="max-w-md mx-auto min-h-[96px]">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center bg-white/10 p-6 rounded-2xl h-full"
              >
                <h3 className="text-2xl font-semibold text-white">🎉 Thank You!</h3>
                <p className="text-blue-200 mt-1">
                  You're on the list for exclusive updates.
                </p>
              </motion.div>
            ) : (
              <motion.form
                variants={fadeInUp}
                className="max-w-md mx-auto"
                onSubmit={handleSubscribe}
              >
                <div className="flex items-center w-full bg-white/10 p-2 rounded-full border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all duration-300 shadow-lg">
                  <input
                    type="email"
                    placeholder="Your best email address"
                    className="flex-1 w-full px-5 py-2 bg-transparent text-white placeholder-gray-300 focus:outline-none"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <motion.button
                    type="submit"
                    className="px-7 py-2 bg-white text-blue-900 font-semibold rounded-full shadow-md"
                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Subscribe
                  </motion.button>
                </div>
                <p className="text-blue-200 text-sm tracking-tight leading-tight mt-4">
                  We respect your privacy. No spam, ever.
                </p>
              </motion.form>
            )}
          </div>
        </div>
      </motion.section>

      {/* --- CONTACT INFO SECTION --- */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="py-24 px-4 sm:px-6 lg:px-8 bg-zinc-200"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-6">
            <h2 className="text-4xl md:text-5xl tracking-tight font-semibold mb-1 max-w-2xl text-center mx-auto leading-relaxed">
              Start Your Search
            </h2>
            <p className="text-md text-gray-600 tracking-tight leading-relaxed text-center max-w-2xl mx-auto">
              Expert guidance to find your dream property.
            </p>
          </motion.div>
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <motion.div
              variants={scaleIn}
              className="text-center p-8 bg-gray-100 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="inline-flex p-4 rounded-full bg-blue-200 text-blue-900 mb-4">
                <PhoneIcon />
              </div>
              <h3 className="text-xl font-semibold leading-relaxed tracking-tight mb-1">
                Call Us
              </h3>
              <p className="text-gray-600 mb-1 leading-relaxed tracking-tight">
                Speak directly with our property experts
              </p>
              <a
                href="tel:+919990263263"
                className="text-blue-800 font-semibold hover:text-blue-900 transition-colors"
              >
                +91 9990263263
              </a>
            </motion.div>
            <motion.div
              variants={scaleIn}
              className="text-center bg-gray-100 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="inline-flex p-4 rounded-full bg-green-200 text-green-900 mb-4">
                <MailIcon />
              </div>
              <h3 className="text-xl font-semibold mb-1 leading-relaxed tracking-tight">
                Email Us
              </h3>
              <p className="text-gray-600 mb-1 leading-relaxed tracking-tight">
                Send us your requirements anytime
              </p>
              <a
                href="mailto:contact@zipacres.com"
                className="text-green-800 font-semibold hover:text-green-900 transition-colors"
              >
                contact@zipacres.com
              </a>
            </motion.div>
            <motion.div
              variants={scaleIn}
              className="text-center p-8 bg-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="inline-flex p-4 rounded-full bg-purple-200 text-purple-900 mb-4">
                <MapPinIcon />
              </div>
              <h3 className="text-xl font-semibold mb-1 leading-relaxed tracking-tight">
                Visit Office
              </h3>
              <p className="text-gray-600 mb-1 leading-relaxed tracking-tight">
                Visit Our Headquarters
              </p>
              <a
                href="https://maps.google.com" // Placeholder link
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-800 font-semibold hover:text-purple-900 transition-colors"
              >
                Get Directions
              </a>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* --- FINAL CTA SECTION --- */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
        className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-800 via-gray-950 to-gray-800 text-white"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-semibold tracking-tighter mb-2 max-w-3xl text-center mx-auto leading-tight"
          >
            Ready to Find Your Dream Home?
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-md text-zinc-400 tracking-tight leading-relaxed text-center mb-6 max-w-2xl mx-auto"
          >
            Trusted guidance to help you find the right property.
          </motion.p>
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="/properties"
              className="inline-block bg-zinc-300 text-gray-900 font-semibold py-6 px-24 text-2xl rounded-full hover:bg-gray-400 transition-all duration-300 transform hover:scale-105"
            >
              Browse Properties
            </a>
          </motion.div>
        </div>
      </motion.section>

      {/* --- FLOATING WHATSAPP ICON --- */}
      <motion.a
        href="https://wa.me/919990263263"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-8 right-8 z-50 bg-green-500 p-4 rounded-full shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-300"
        initial="hidden"
        animate="visible"
        variants={scaleIn}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <WhatsAppIcon />
      </motion.a>
    </div>
  );
}