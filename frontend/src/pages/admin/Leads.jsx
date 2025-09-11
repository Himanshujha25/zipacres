import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Leads() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contacted, setContacted] = useState({});
  const [notes, setNotes] = useState({});
  const [search, setSearch] = useState("");
  const [view, setView] = useState("all"); // all | uncontacted | contacted

  // State for custom alert/message box
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  // State for custom confirmation modal
  const [showConfirm, setShowConfirm] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);

  // Helper function to show a custom message
  const showMessage = (msg, isErr = false) => {
    setMessage(msg);
    setIsError(isErr);
    setTimeout(() => setMessage(null), 3000);
  };

  // Format phone numbers for professional display
  const formatPhoneNumbers = (phoneString) => {
    if (!phoneString || phoneString === "—") return "No phone";

    // Split by comma and format each number
    const numbers = phoneString.split(',').map(num => num.trim());

    return (
      <div className="flex flex-col gap-1">
        {numbers.map((number, index) => (
          <div key={index} className="flex items-center">
            <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-2">
              <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
            </span>
            <span className="text-sm font-medium text-gray-700">{number}</span>
          </div>
        ))}
      </div>
    );
  };

  // Fetch all leads on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/leads", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch leads.");
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        // Prefill contacted + notes maps
        const contactedMap = {};
        const notesMap = {};
        data.forEach((u) => {
          contactedMap[u._id] = u.contacted || false;
          notesMap[u._id] = u.note || "";
        });
        setContacted(contactedMap);
        setNotes(notesMap);
      })
      .catch((error) => {
        console.error("Error fetching leads:", error);
        showMessage("Error fetching leads.", true);
      })
      .finally(() => setLoading(false));
  }, []);

  // Toggle contacted checkbox
  const handleContactedChange = (id) =>
    setContacted((prev) => ({ ...prev, [id]: !prev[id] }));

  // Update local note text
  const handleNoteChange = (id, value) =>
    setNotes((prev) => ({ ...prev, [id]: value }));

  // Save contacted + note to backend
  const handleSave = (userId) => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:5000/api/leads/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        contacted: contacted[userId],
        note: notes[userId],
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save.");
        return res.json();
      })
      .then((updated) => {
        // Update local users array too
        setUsers((prev) =>
          prev.map((u) => (u._id === updated._id ? updated : u))
        );
        showMessage("Lead updated successfully!");
      })
      .catch((error) => {
        console.error("Error saving lead:", error);
        showMessage("Error saving lead.", true);
      });
  };

  // Open confirmation modal
  const confirmDelete = (userId) => {
    setLeadToDelete(userId);
    setShowConfirm(true);
  };

  // Handle actual delete after confirmation
  const handleDelete = () => {
    const userId = leadToDelete;
    const token = localStorage.getItem("token");
    setShowConfirm(false); // Close the modal
    setLeadToDelete(null);

    fetch(`http://localhost:5000/api/leads/${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete.");
        return res.json();
      })
      .then(() => {
        setUsers((prev) => prev.filter((u) => u._id !== userId));
        // Clean up state
        setContacted((prev) => {
          const newState = { ...prev };
          delete newState[userId];
          return newState;
        });
        setNotes((prev) => {
          const newState = { ...prev };
          delete newState[userId];
          return newState;
        });
        showMessage("Lead deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting lead:", error);
        showMessage("Error deleting lead.", true);
      });
  };

  // filter by search + tab
  const filtered = users.filter((u) => {
    const phoneString = u.phone || "";
    const matchesSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      phoneString.toLowerCase().includes(search.toLowerCase());
    const matchView =
      view === "all"
        ? true
        : view === "contacted"
          ? contacted[u._id]
          : !contacted[u._id];
    return matchesSearch && matchView;
  });

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800">
          Leads ({users.length})
        </h1>
        <Link
          to="/admin/dashboard"
          className="inline-block px-5 py-2.5 sm:px-6 sm:py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200 text-sm sm:text-base"
        >
          Dashboard
        </Link>
      </div>

      {/* Search + Tabs */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search name, email, or phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 flex-1 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-sm sm:text-base"
        />
        <div className="flex gap-2 flex-wrap">
          {["all", "uncontacted", "contacted"].map((tab) => (
            <button
              key={tab}
              onClick={() => setView(tab)}
              className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-colors font-medium text-xs sm:text-sm ${view === tab
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab !== "all" && (
                <span className="ml-1">
                  (
                  {
                    users.filter((u) =>
                      tab === "contacted" ? contacted[u._id] : !contacted[u._id]
                    ).length
                  }
                  )
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Message box for success/error alerts */}
      {message && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2 sm:px-6 sm:py-3 rounded-lg shadow-lg text-white font-semibold transition-transform transform text-sm sm:text-base ${isError ? "bg-red-500" : "bg-green-500"
            } animate-fade-in-down`}
        >
          {message}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="ml-3 text-gray-500 text-lg">Loading leads…</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl sm:rounded-3xl shadow-lg sm:shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-gray-700">
              <thead className="bg-gradient-to-r from-blue-800 to-blue-900 text-white">
                <tr>
                  <th className="px-3 py-3 text-xs sm:text-sm">Name</th>
                  <th className="px-3 py-3 text-xs sm:text-sm">Email</th>
                  <th className="px-3 py-3 text-xs sm:text-sm">Phone Numbers</th>
                  <th className="px-3 py-3 text-xs sm:text-sm text-center">Contacted</th>
                  <th className="px-3 py-3 text-xs sm:text-sm">Note</th>
                  <th className="px-3 py-3 text-xs sm:text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user, idx) => (
                  <tr
                    key={user._id}
                    className={`transition-colors ${contacted[user._id]
                        ? "bg-green-50"
                        : idx % 2 === 0
                          ? "bg-gray-50"
                          : "bg-white"
                      } hover:bg-blue-50`}
                  >
                    <td className="px-3 py-4 font-bold text-gray-800 text-sm sm:text-base">
                      {user.name || "No name"}
                    </td>
                    <td className="px-3 py-4 text-blue-600 text-sm sm:text-base">
                      {user.email || "No email"}
                    </td>

                    <td className="px-3 py-4 text-sm sm:text-base">
                      {Array.isArray(user.phoneNumber) && user.phoneNumber.length > 0
                        ? user.phoneNumber.join(", ")
                        : "No phone"}
                    </td>


                    <td className="px-3 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={contacted[user._id] || false}
                        onChange={() => handleContactedChange(user._id)}
                        className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 bg-gray-100 border-gray-300 rounded-md focus:ring-blue-500 focus:ring-2"
                      />
                    </td>
                    <td className="px-3 py-4">
                      <input
                        type="text"
                        value={notes[user._id] || ""}
                        onChange={(e) =>
                          handleNoteChange(user._id, e.target.value)
                        }
                        placeholder="Add note..."
                        className="border border-gray-300 rounded-lg px-2 py-1 w-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </td>
                    <td className="px-3 py-4 space-x-2">
                      <button
                        onClick={() => handleSave(user._id)}
                        className="px-2 py-1 sm:px-3 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs sm:text-sm font-medium"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => confirmDelete(user._id)}
                        className="px-2 py-1 sm:px-3 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs sm:text-sm font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-12 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center">
                        <svg
                          className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-4m-8 0H4"
                          ></path>
                        </svg>
                        <p className="text-base sm:text-lg font-medium">No leads found</p>
                        <p className="text-xs sm:text-sm">
                          Try adjusting your search or filter criteria.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 w-full max-w-sm text-center transform scale-100 transition-transform animate-scale-in">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Are you sure you want to delete this lead?</p>
            <div className="flex justify-center gap-3 sm:gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 sm:px-6 sm:py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 sm:px-6 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm sm:text-base"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scale-in {
            from {
                transform: scale(0.95);
                opacity: 0;
            }
            to {
                transform: scale(1);
                opacity: 1;
            }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.3s ease-out;
        }
        .animate-scale-in {
            animation: scale-in 0.3s cubic-bezier(0.2, 0.5, 0.5, 1.2);
        }
      `}</style>
    </div>
  );
}
