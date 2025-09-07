import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// ✅ Make icons true components with props
const IconWrapper = ({ children, className }) => (
  <span className={`inline-flex items-center ${className}`}>{children}</span>
);

const LocationIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const BedIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 7l9-4 9 4M4 10h16v11H4V10z"
    />
  </svg>
);

const BathIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 10h6M10 14h4M7 20h10a2 2 0 002-2V8a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const AreaIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5"
    />
  </svg>
);

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function PropertyCard({ property }) {
  if (!property) return null;

  return (
    <motion.div
      variants={cardVariants}
      className="bg-white rounded-2xl shadow hover:shadow-xl overflow-hidden group transition-all duration-300 border border-gray-200"
    >
      <Link to={`/properties/${property.id}`} className="block">
        {/* Image */}
        <div className="relative">
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <span className="absolute top-3 right-3 bg-gradient-to-r from-blue-900 to-blue-950 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow">
            {property.type}
          </span>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          <h3 className="text-lg font-semibold text-gray-900 truncate mb-1 group-hover:text-blue-900 transition-colors">
            {property.title}
          </h3>

          <div className="flex items-center text-sm text-gray-600 mb-4">
            <LocationIcon className="w-4 h-4 mr-1 text-blue-900" />
            <span className="font-medium">{property.location}</span>
          </div>

          {/* Price + details */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Price */}
            <p className="text-2xl font-bold text-gray-900">
              {property.price}
            </p>

            {/* Details */}
            <div className="flex flex-wrap gap-2">
              {property.type !== "Land/Plot" && (
                <>
                  <div className="flex items-center gap-1 bg-zinc-50 rounded-lg px-3 py-1.5 border border-gray-200">
                    <BedIcon className="w-4 h-4 text-blue-900" />
                    <span className="font-medium text-sm text-blue-900">{property.bedrooms || 0}</span>
                    <span className="text-xs text-gray-500">beds</span>
                  </div>

                  <div className="flex items-center gap-1 bg-zinc-50 rounded-lg px-3 py-1.5 border border-gray-200">
                    <BathIcon className="w-4 h-4 text-blue-900" />
                    <span className="font-medium text-sm text-blue-900">{property.bathrooms || 0}</span>
                    <span className="text-xs text-gray-500">baths</span>
                  </div>
                </>
              )}

              <div className="flex items-center gap-1 bg-zinc-50 rounded-lg px-3 py-1.5 border border-gray-200">
                <AreaIcon className="w-4 h-4 text-blue-900" />
                <span className="font-medium text-sm text-blue-900">{property.areaSqft}</span>
                <span className="text-xs text-gray-500">{property.areaUnit || "sqft"}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
