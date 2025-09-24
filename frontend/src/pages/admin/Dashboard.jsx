import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useProperties } from "../../context/PropertyContext";

const Icon = ({ path, className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const icons = {
  plus: "M12 6v6m0 0v6m0-6h6m-6 0H6",
  edit: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z",
  delete: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
  leads: "M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 110 7.75M8 3.13a4 4 0 110 7.75",
};

const inputClass =
  "w-full border-2 border-gray-200 px-3 py-2 rounded-lg focus:ring-1 focus:ring-blue-900 focus:border-blue-900 transition-all";

export default function Dashboard() {
  const { properties, deleteProperty, updateProperty, loading, fetchProperties } = useProperties();
  const { user: currentUser } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [editingProperty, setEditingProperty] = useState(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const ITEMS_PER_PAGE = 5;

  // Fetch admin's own properties when component mounts
  useEffect(() => {
    if (currentUser && currentUser.role === "admin") {
      fetchProperties(); // This will fetch only admin's own properties
    }
  }, [currentUser, fetchProperties]);

  const handleDelete = async (propertyId, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://zipacres.onrender.com/api/properties/${propertyId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Delete failed");
      deleteProperty(propertyId);
    } catch {
      alert("Error deleting");
    }
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://zipacres.onrender.com/api/properties/${editingProperty._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingProperty),
      });
      if (!res.ok) throw new Error("Update failed");
      const data = await res.json();
      updateProperty(data.property);
      setEditingProperty(null);
    } catch {
      alert("Error saving");
    }
  };

  const filtered = properties.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) &&
      (typeFilter === "" || p.type === typeFilter)
  );
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedProperties = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const userName = currentUser?.name || currentUser?.email?.split("@")[0] || "Admin";

  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-900 via-blue-950 to-blue-900 px-6 py-5 rounded-lg shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img src="/images/Zipacres Logo.png" alt="Logo" className="h-12 w-12 rounded-lg" />
              <div>
                <h1 className="text-2xl font-semibold text-white">ZipAcres Admin</h1>
                <p className="text-slate-300">Hello, {userName}</p>
              </div>
            </div>

            <div className="flex gap-3">
              {/* Leads button */}
              <Link
                to="/admin/leads"
                className="flex items-center gap-2 bg-zinc-200 hover:scale-105 transition-transform duration-300 text-black font-medium py-2.5 px-5 rounded-lg shadow-lg"
              >
                <Icon path={icons.leads} className="w-4 h-4 text-black" />
                Leads
              </Link>

              {/* Add Property button */}
              <Link
                to="/admin/addproperty"
                className="flex items-center gap-2 bg-zinc-200 hover:scale-105 transition-transform duration-300 text-black font-medium py-2.5 px-5 rounded-lg shadow-lg"
              >
                <Icon path={icons.plus} className="w-4 h-4 text-black" />
                Add Property
              </Link>
            </div>
          </div>
        </header>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow flex flex-col md:flex-row gap-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search property..."
            className="border px-3 py-2 rounded w-full md:w-1/3"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border px-3 py-2 rounded w-full md:w-1/3"
          >
            <option value="">All Types</option>
            <option>Apartment</option>
            <option>Plot</option>
            <option>Villa</option>
            <option>Penthouse</option>
            <option>Studio</option>
            <option>Independent House</option>
            <option>Farmhouse</option>
            <option>Duplex</option>
            <option>Builder Floor</option>
          </select>
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-zinc-50 rounded-xl shadow-sm border overflow-hidden"
        >
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="text-lg font-semibold">My Properties</h3>
            <span className="text-sm text-gray-700">
              Showing {paginatedProperties.length} of {filtered.length}
            </span>
          </div>
          {loading ? (
            <div className="space-y-2 p-4">
              {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 animate-pulse rounded"></div>
              ))}
            </div>
          ) : paginatedProperties.length === 0 ? (
            <div className="text-center py-20">
              <h2 className="text-xl font-semibold text-gray-600 mb-2">No Properties Found</h2>
              <p className="text-gray-500 mb-4">You haven't added any properties yet.</p>
              <Link
                to="/admin/addproperty"
                className="inline-flex items-center gap-2 bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition"
              >
                <Icon path={icons.plus} className="w-4 h-4" />
                Add Your First Property
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="text-xs uppercase bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3">Property</th>
                    <th className="px-6 py-3 hidden md:table-cell">Type</th>
                    <th className="px-6 py-3">Price</th>
                    <th className="px-6 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProperties.map((p, idx) => (
                    <tr
                      key={p._id}
                      className={`border-b hover:bg-gray-50 transition ${
                        idx % 2 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image || "https://via.placeholder.com/150"}
                            alt={p.title}
                            className="w-14 h-10 object-cover rounded-md"
                          />
                          <div>
                            <p className="font-semibold">{p.title}</p>
                            <p className="text-xs text-gray-500 md:hidden">{p.type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">{p.type}</td>
                      <td className="px-6 py-4 font-semibold text-green-800">{p.price}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setEditingProperty(p)}
                          className="text-indigo-800 hover:underline mr-4 focus:outline-none"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p._id, p.title)}
                          className="text-red-800 hover:underline focus:outline-none"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!loading && totalPages > 1 && (
            <div className="p-4 flex justify-between border-t bg-gray-50">
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Edit Modal */}
        <AnimatePresence>
          {editingProperty && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingProperty(null)}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            >
              <motion.div
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg overflow-y-auto max-h-[90vh]"
              >
                <div className="bg-gradient-to-t from-blue-900 via-blue-950 to-blue-900 -m-6 mb-4 p-4 rounded-t-xl">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-blue-900 p-2 rounded-lg">
                      <Icon path={icons.edit} className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold text-white">Edit Property</h2>
                  </div>
                </div>
                <input
                  type="text"
                  value={editingProperty.title}
                  onChange={(e) =>
                    setEditingProperty({ ...editingProperty, title: e.target.value })
                  }
                  className={`${inputClass} mb-3`}
                  placeholder="Property Title"
                />
                <select
                  value={editingProperty.type}
                  onChange={(e) =>
                    setEditingProperty({ ...editingProperty, type: e.target.value })
                  }
                  className={`${inputClass} mb-3`}
                >
                  <option>Apartment</option>
                  <option>Plot</option>
                  <option>Villa</option>
                  <option>Penthouse</option>
                  <option>Studio</option>
                  <option>Independent House</option>
                  <option>Farmhouse</option>
                  <option>Duplex</option>
                  <option>Builder Floor</option>
                </select>
                <input
                  type="text"
                  value={editingProperty.location || ""}
                  onChange={(e) =>
                    setEditingProperty({ ...editingProperty, location: e.target.value })
                  }
                  className={`${inputClass} mb-3`}
                  placeholder="Location"
                />
                <input
                  type="text"
                  value={editingProperty.price}
                  onChange={(e) =>
                    setEditingProperty({ ...editingProperty, price: e.target.value })
                  }
                  className={`${inputClass} mb-3`}
                  placeholder="Price"
                />
                {editingProperty.type !== "Plot" && (
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input
                      type="number"
                      value={editingProperty.bedrooms || ""}
                      onChange={(e) =>
                        setEditingProperty({ ...editingProperty, bedrooms: e.target.value })
                      }
                      className={inputClass}
                      placeholder="Bedrooms"
                    />
                    <input
                      type="number"
                      value={editingProperty.bathrooms || ""}
                      onChange={(e) =>
                        setEditingProperty({ ...editingProperty, bathrooms: e.target.value })
                      }
                      className={inputClass}
                      placeholder="Bathrooms"
                    />
                  </div>
                )}
                <input
                  type="number"
                  value={editingProperty.areaSqft || ""}
                  onChange={(e) =>
                    setEditingProperty({ ...editingProperty, areaSqft: e.target.value })
                  }
                  className={`${inputClass} mb-3`}
                  placeholder="Area (sqft)"
                />
                <textarea
                  value={editingProperty.desc || ""}
                  onChange={(e) =>
                    setEditingProperty({ ...editingProperty, desc: e.target.value })
                  }
                  className={`${inputClass} mb-3`}
                  rows="3"
                  placeholder="About this property..."
                />
                <input
                  type="text"
                  value={editingProperty.image || ""}
                  onChange={(e) =>
                    setEditingProperty({ ...editingProperty, image: e.target.value })
                  }
                  className={`${inputClass} mb-4`}
                  placeholder="Image URL"
                />
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setEditingProperty(null)}
                    className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 shadow-md"
                  >
                    Save Changes
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}