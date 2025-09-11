import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { debounce } from "lodash";

export default function Leads() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contacted, setContacted] = useState({});
  const [notes, setNotes] = useState({});
  const [search, setSearch] = useState("");
  const [view, setView] = useState("all");
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  const API_BASE = "https://zipacres.onrender.com/api";

  const showMessage = useCallback((msg, isErr = false) => {
    setMessage(msg);
    setIsError(isErr);
    setTimeout(() => setMessage(null), 3000);
  }, []);

  const formatPhoneNumbers = (phoneData) => {
  if (!phoneData) return <span className="text-gray-400 italic">No phone</span>;

  // Ensure the number starts with +91
  let formattedNumber = phoneData.toString().trim();
  if (!formattedNumber.startsWith("+91")) {
    // Remove leading 0 or 91 if present
    if (formattedNumber.startsWith("0")) {
      formattedNumber = formattedNumber.slice(1);
    } else if (formattedNumber.startsWith("91")) {
      formattedNumber = formattedNumber.slice(2);
    }
    formattedNumber = `+91${formattedNumber}`;
  }

  return <span className="text-sm font-medium text-gray-700">{formattedNumber}</span>;
};


  const token = useMemo(() => localStorage.getItem("token"), []);

  useEffect(() => {
    if (!token) {
      showMessage("Authentication token missing.", true);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    fetch(`${API_BASE}/leads`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch leads (${res.status})`);
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format received");
        }

        setUsers(data);
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
        if (error.name !== 'AbortError') {
          console.error("Error fetching leads:", error);
          showMessage("Error fetching leads.", true);
        }
      })
      .finally(() => setLoading(false));

    // Cleanup function
    return () => controller.abort();
  }, [token, showMessage]);

  // Save function for backend
  const handleSave = useCallback((userId, contactedValue = contacted[userId], noteValue = notes[userId]) => {
    const token = localStorage.getItem("token");
    if (!token) return showMessage("Missing auth token", true);

    const payload = {
      contacted: contactedValue,
      note: noteValue,
      lastContactedAt: contactedValue ? new Date() : null,
    };

    fetch(`${API_BASE}/leads/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to update lead (${res.status})`);
        return res.json();
      })
      .then((updatedLead) => {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? updatedLead : u))
        );
        showMessage("Lead updated successfully!");
      })
      .catch((err) => {
        console.error("Error updating lead:", err);
        showMessage("Error updating lead.", true);
      });
  }, [contacted, notes, showMessage]);

  // Debounced note saving
  const saveNoteDebounced = useMemo(
    () => debounce((id, value) => handleSave(id, contacted[id], value), 500),
    [contacted, handleSave]
  );

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      saveNoteDebounced.cancel();
    };
  }, [saveNoteDebounced]);

  // Handle checkbox
  const handleContactedChange = useCallback((id) => {
    setContacted((prev) => {
      const newStatus = !prev[id];
      handleSave(id, newStatus, notes[id]); // Save immediately
      return { ...prev, [id]: newStatus };
    });
  }, [handleSave, notes]);

  // Handle note change
  const handleNoteChange = useCallback((id, value) => {
    setNotes((prev) => ({ ...prev, [id]: value }));
    saveNoteDebounced(id, value);
  }, [saveNoteDebounced]);

  // Filtered leads
  const filtered = useMemo(() => {
    return users.filter((u) => {
      const phoneString = u.phoneNumber || "";
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
  }, [users, search, view, contacted]);

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

      {/* Message box */}
      {message && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2 sm:px-6 sm:py-3 rounded-lg shadow-lg text-white font-semibold transition-transform transform text-sm sm:text-base ${isError ? "bg-red-500" : "bg-green-500"
            } animate-fade-in-down`}
        >
          {message}
        </div>
      )}

      {/* Leads Table */}
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
                  <th className="px-3 py-3 text-xs sm:text-sm font-semibold">Name</th>
                  <th className="px-3 py-3 text-xs sm:text-sm font-semibold">Email</th>
                  <th className="px-3 py-3 text-xs sm:text-sm font-semibold">Phone Numbers</th>
                  <th className="px-3 py-3 text-xs sm:text-sm text-center font-semibold">Contacted</th>
                  <th className="px-3 py-3 text-xs sm:text-sm font-semibold">Note</th>
                  <th className="px-3 py-3 text-xs sm:text-sm font-semibold">Actions</th>
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
                      {user?.name || "No name"}
                    </td>
                    <td className="px-3 py-4 text-blue-600 text-sm sm:text-base break-all">
                      {user?.email || "No email"}
                    </td>
                    <td className="px-3 py-4 text-blue-600 text-sm sm:text-base">
  {formatPhoneNumbers(user?.phone)}
</td>


                    <td className="px-3 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={contacted[user._id] || false}
                        onChange={() => handleContactedChange(user._id)}
                        className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 bg-gray-100 border-gray-300 rounded-md focus:ring-blue-500 focus:ring-2 cursor-pointer"
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
                        maxLength={500}
                      />
                    </td>
                    <td className="px-3 py-4 space-x-2">
                      <button
                        onClick={() => handleSave(user._id)}
                        className="px-2 py-1 sm:px-3 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500"
                        title="Save changes"
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-4 py-12 text-center text-gray-500">
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
                          />
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
        .animate-fade-in-down { 
          animation: fade-in-down 0.3s ease-out; 
        }
      `}</style>
    </div>
  );
}