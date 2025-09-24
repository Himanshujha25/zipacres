import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useProperties } from "../../context/PropertyContext";
import {
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";

// --- animations ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const slideIn = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { properties, loading } = useProperties();

  const [property, setProperty] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // pick property whenever id or list changes
  useEffect(() => {
    const found = properties.find((p) => String(p._id || p.id) === String(id));
    if (found) {
      setProperty(found);
      setActiveImageIndex(0);
    } else if (!loading) {
      // redirect immediately if not found and loading is finished
      navigate("/properties", { replace: true });
    }
  }, [id, properties, loading, navigate]);

  // redirect on browser back
  useEffect(() => {
    const handleBack = () => navigate("/properties", { replace: true });
    window.addEventListener("popstate", handleBack);
    return () => window.removeEventListener("popstate", handleBack);
  }, [navigate]);

  // show loading while fetching properties
  if (loading || !property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-blue-700">
        <AiOutlineLoading3Quarters className="animate-spin text-4xl mb-3" />
        <p className="text-lg font-medium">Loading property details…</p>
      </div>
    );
  }

  // build image array
  const allImages = [
    ...(property.image ? [property.image] : []),
    ...(property.gallery?.length
      ? property.gallery.filter((img) => img !== property.image)
      : []),
  ];
  const activeImage = allImages[activeImageIndex] || "";

  const navigateImage = (direction) => {
    if (allImages.length <= 1) return;
    let newIndex = activeImageIndex + direction;
    if (newIndex < 0) newIndex = allImages.length - 1;
    if (newIndex >= allImages.length) newIndex = 0;
    setActiveImageIndex(newIndex);
  };

  // similar properties
  const similarProperties = properties
    .filter(
      (p) =>
        (p._id || p.id) !== (property._id || property.id) &&
        p.location === property.location
    )
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.main
        className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image + Gallery */}
          <div className="lg:col-span-2">
            <motion.div variants={fadeInUp}>
              {activeImage && (
                <div className="relative group">
                  <img
                    src={activeImage}
                    alt={property.title}
                    className="w-full h-[26rem] sm:h-[30rem] object-cover rounded-2xl shadow-xl cursor-pointer transition hover:opacity-95"
                    onClick={() => setIsImageModalOpen(true)}
                  />
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={() => navigateImage(-1)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow hover:bg-white"
                        aria-label="Previous image"
                      >
                        <AiOutlineArrowLeft />
                      </button>
                      <button
                        onClick={() => navigateImage(1)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow hover:bg-white"
                        aria-label="Next image"
                      >
                        <AiOutlineArrowRight />
                      </button>
                    </>
                  )}
                </div>
              )}

              {allImages.length > 1 && (
                <div className="mt-4 grid grid-cols-5 gap-2">
                  {allImages.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`${property.title} ${i}`}
                      onClick={() => setActiveImageIndex(i)}
                      className={`h-20 w-full object-cover rounded-xl cursor-pointer transition ${
                        i === activeImageIndex
                          ? "ring-2 ring-blue-800 scale-105"
                          : "hover:opacity-80"
                      }`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              variants={slideIn}
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 sticky top-6 border border-gray-200"
            >
              <div className="text-center mb-4">
                <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
                  {property.title}
                </h1>
                <p className="text-gray-500 tracking-tight text-sm mt-1">
                  {property.location}
                </p>
                <div className="mt-4 bg-gradient-to-r from-blue-900 to-blue-950 shadow text-white p-4 rounded-xl">
                  <p className="text-3xl font-bold tracking-tight">
                    ₹{" "}
                    {Number(property.price).toLocaleString("en-IN", {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/contact")}
                  className="w-full bg-gradient-to-r from-blue-900 to-blue-950 text-white py-4 rounded-xl hover:from-blue-950 hover:to-blue-950 transition font-semibold shadow-2xl flex items-center justify-center gap-2"
                >
                  📞 Contact Advisor
                </button>

                <a
                  href={`https://wa.me/919990263263?text=Interested%20in%20${encodeURIComponent(
                    property.title
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full bg-gradient-to-r from-green-700 to-green-800 text-white text-center py-4 rounded-xl hover:from-green-800 hover:to-green-700 transition font-semibold shadow-2xl flex items-center justify-center gap-2"
                >
                  💬 WhatsApp Now
                </a>
              </div>

              <div className="mt-3 text-center">
                <p className="text-xs text-gray-600">
                  ✓ Verified Property • Trusted Advisor
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* About */}
        <motion.div
          variants={fadeInUp}
          className="mt-12 bg-white rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-4">About this Property</h2>
          <p className="text-gray-700 leading-relaxed">{property.desc}</p>
        </motion.div>

        {/* Similar properties */}
        {similarProperties.length > 0 && (
          <motion.div variants={fadeInUp} className="mt-14">
            <h2 className="text-xl font-semibold mb-4">Similar Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarProperties.map((sp) => (
                <Link
                  key={sp._id || sp.id}
                  to={`/properties/${sp._id || sp.id}`}
                  className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden group"
                >
                  <img
                    src={sp.image}
                    alt={sp.title}
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold tracking-tight truncate">
                      {sp.title}
                    </h3>
                    <p className="text-blue-800 tracking-tight font-medium">
                      ₹{" "}
                      {Number(sp.price).toLocaleString("en-IN", {
                        maximumFractionDigits: 0,
                      })}
                    </p>
                    <p className="text-gray-500 text-sm">{sp.location}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </motion.main>

      {/* Image Modal */}
      <AnimatePresence>
        {isImageModalOpen && activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 flex items-center justify-center z-50"
            onClick={() => setIsImageModalOpen(false)}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <motion.img
                src={activeImage}
                alt={property.title}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-1/2 h-90 object-contain"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="absolute top-6 right-6 bg-white/40 p-3 rounded-full hover:bg-white transition z-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-black"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {allImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateImage(-1);
                    }}
                    className="absolute left-4 sm:left-10 top-1/2 -translate-y-1/2 bg-white/30 p-4 sm:p-6 rounded-full hover:bg-white transition"
                  >
                    <AiOutlineArrowLeft size={36} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateImage(1);
                    }}
                    className="absolute right-4 sm:right-10 top-1/2 -translate-y-1/2 bg-white/30 p-4 sm:p-6 rounded-full hover:bg-white transition"
                  >
                    <AiOutlineArrowRight size={36} />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
