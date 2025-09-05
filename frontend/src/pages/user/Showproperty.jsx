import React, { useState, useMemo, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import PropertyCard from "../../components/PropertyCard";
import { useProperties } from "../../context/PropertyContext"; // ✅ using context

const parsePrice = (priceStr) => {
  if (!priceStr) return 0;

  const str = String(priceStr).toLowerCase(); // convert to string first
  const numericPart = parseFloat(str.replace(/,/g, "").replace(/[^0-9.]/g, ""));
  if (isNaN(numericPart)) return 0;

  if (str.includes("crore")) return numericPart * 10000000;
  if (str.includes("lakh")) return numericPart * 100000;

  return numericPart;
};

export default function Properties() {
  const navigate = useNavigate();
  const { properties, loading, fetchallProperties } = useProperties(); // ✅ include fetchallProperties

  const [tempFilters, setTempFilters] = useState({
    search: "",
    type: "All",
    price: "All",
  });

  const [filters, setFilters] = useState(tempFilters);
    const [isSearchOpen, setIsSearchOpen] = useState(false);


  const applyFilters = () => setFilters(tempFilters);

  useEffect(() => {
    fetchallProperties(); // ✅ load all properties, not just admin’s
  }, [fetchallProperties]);

  const filteredList = useMemo(() => {
    let result = [...properties];
    if (filters.search) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          p.location.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    if (filters.type !== "All") {
      result = result.filter((p) => p.type === filters.type);
    }
    if (filters.price !== "All") {
      const [min, max] = filters.price.split("-").map(Number);
      result = result.filter((p) => {
        const price = parsePrice(p.price);
        return price >= min && price <= max;
      });
    }
    return result;
  }, [properties, filters]);

  return (
   <div className="bg-gray-100 min-h-screen p-6">
      {/* Mobile: Search Button */}
      <div className="md:hidden mb-6">
        <button
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className="w-full px-6 py-3 bg-gradient-to-tr from-blue-950 to-blue-900 text-white text-mdfont-semibold rounded-lg shadow hover:scale-105 hover:from-blue-900  hover:to-blue-950 transition flex items-center justify-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Search Properties
        </button>
      </div>

      {/* Desktop: Always visible + Mobile: Sliding panel */}
      <div
        className={`
        bg-gradient-to-tr from-blue-950 to-blue-900 rounded-xl shadow-md p-8 mb-10 border border-gray-500
        md:flex md:flex-row md:gap-4 md:items-end md:relative md:transform-none md:transition-none
        ${
          isSearchOpen
            ? "flex flex-col gap-4 fixed inset-x-4 top-4 z-50 max-h-screen overflow-y-auto"
            : "hidden md:flex"
        }
      `}
      >
        {/* Mobile: Close button */}
        <div className="md:hidden flex justify-between items-center  ">
          <h3 className="text-white text-md font-semibold">
            Search Properties
          </h3>
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-zinc-300  hover:text-gray-200 transition"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <input
          type="text"
          placeholder="Search by title or location..."
          className="px-4 py-2 border rounded-lg w-full md:w-1/3 focus:ring-1 focus:ring-blue-800 focus:border-blue-800 transition"
          value={tempFilters.search}
          onChange={(e) =>
            setTempFilters((f) => ({ ...f, search: e.target.value }))
          }
        />
        <select
          value={tempFilters.type}
          onChange={(e) =>
            setTempFilters((f) => ({ ...f, type: e.target.value }))
          }
          className="px-3 py-2 border rounded-lg w-full md:w-1/3 bg-gray-50 focus:ring-2 focus:ring-blue-800 focus:border-blue-800 transition"
        >
          <option>All</option>
          <option>Apartment</option>
          <option>Villa</option>
          <option>Penthouse</option>
          <option>Studio</option>
          <option>Independent House</option>
          <option>Farmhouse</option>
          <option>Land/Plot</option>
        </select>
        <select
          value={tempFilters.price}
          onChange={(e) =>
            setTempFilters((f) => ({ ...f, price: e.target.value }))
          }
          className="px-3 py-2 border rounded-lg bg-gray-50 focus:ring-1 focus:ring-blue-800 focus:border-blue-800 transition"
        >
          <option value="All">All Prices</option>
          <option value="0-5000000">Under ₹50 Lakh</option>
          <option value="5000000-10000000">₹50 Lakh - ₹2 Cr</option>
          <option value="10000000-999999999">Above ₹2 Cr</option>
        </select>
        <button
 onClick={() => {
            applyFilters();
            setIsSearchOpen(false); // Close mobile panel after search
          }}          className="px-6 py-2 bg-gradient-to-r from-blue-800 to-blue-800 text-white font-semibold rounded-lg shadow hover:from-blue-700 hover:to-blue-700 transition"
        >
          Search
        </button>
      </div>


      {/* Mobile: Backdrop */}
      {isSearchOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSearchOpen(false)}
        />
      )}

      {/* Results */}
      {loading ? (
        <p className="text-center text-gray-500">Loading properties...</p>
      ) : filteredList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredList.map((property) => (
            <div
              key={property._id || property.id}
              onClick={() =>
                navigate(`/properties/${property._id || property.id}`)
              }
              className="cursor-pointer transform hover:scale-[1.02] transition"
            >
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold text-gray-900">
            No properties found
          </h2>
          <p className="text-gray-500 mt-1 tracking-tight leading-none text-md">
            Try adjusting your filters to see more results.
          </p>
        </div>
      )}
    </div>
  );
}
