import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useAuth } from "./AuthContext";
import { useLocation } from "react-router-dom";

const PropertyContext = createContext();

export const useProperties = () => useContext(PropertyContext);

export const PropertyProvider = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  // State arrays
  const [allProperties, setAllProperties] = useState([]);
  const [myProperties, setMyProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  // Separate fetch statuses
  const [allFetchStatus, setAllFetchStatus] = useState("idle"); // 'idle' | 'loading' | 'succeeded' | 'failed'
  const [myFetchStatus, setMyFetchStatus] = useState("idle");

  // Fetch all public properties
  const fetchAllProperties = useCallback(async () => {
    if (allFetchStatus === "loading" || allFetchStatus === "succeeded") return;

    setLoading(true);
    setAllFetchStatus("loading");
    try {
      const res = await fetch("https://zipacres.onrender.com/api/properties", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to fetch all properties");

      const data = await res.json();
      setAllProperties(data.data || []);
      setAllFetchStatus("succeeded");
    } catch (err) {
      console.error("Error fetching all properties:", err);
      setAllProperties([]);
      setAllFetchStatus("failed");
    } finally {
      setLoading(false);
    }
  }, [allFetchStatus]);

  // Fetch properties created by logged-in admin
  const fetchMyProperties = useCallback(async () => {
    if (!user || user.role !== "admin") return;
    if (myFetchStatus === "loading" || myFetchStatus === "succeeded") return;

    setLoading(true);
    setMyFetchStatus("loading");
    try {
      const res = await fetch(
        "https://zipacres.onrender.com/api/properties/my",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch your properties");

      const data = await res.json();
      setMyProperties(data.data || []);
      setMyFetchStatus("succeeded");
    } catch (err) {
      console.error("Error fetching my properties:", err);
      setMyProperties([]);
      setMyFetchStatus("failed");
    } finally {
      setLoading(false);
    }
  }, [user, myFetchStatus]);

  // Route-aware fetching
  useEffect(() => {
    if (location.pathname.startsWith("/admin") && user?.role === "admin") {
      if (myFetchStatus === "idle") fetchMyProperties();
    } else {
      if (allFetchStatus === "idle") fetchAllProperties();
    }
  }, [
    location.pathname,
    user,
    fetchAllProperties,
    fetchMyProperties,
    allFetchStatus,
    myFetchStatus,
  ]);

  // Add, update, delete helpers
  const addProperty = useCallback((property, type = "all") => {
    if (type === "all") setAllProperties((prev) => [property, ...prev]);
    else setMyProperties((prev) => [property, ...prev]);
  }, []);

  const updateProperty = useCallback((updatedProperty, type = "all") => {
    const updater = (prev) =>
      prev.map((p) => (p._id === updatedProperty._id ? updatedProperty : p));

    if (type === "all") setAllProperties(updater);
    else setMyProperties(updater);
  }, []);

  const deleteProperty = useCallback((id, type = "all") => {
    const filterer = (prev) => prev.filter((p) => p._id !== id);

    if (type === "all") setAllProperties(filterer);
    else setMyProperties(filterer);
  }, []);

  // Force refresh
  const forceRefreshProperties = useCallback((type = "all") => {
    if (type === "all") setAllFetchStatus("idle");
    else setMyFetchStatus("idle");
  }, []);

  // Decide which array to expose depending on route
  const properties =
    location.pathname.startsWith("/admin") && user?.role === "admin"
      ? myProperties
      : allProperties;

  const value = useMemo(
    () => ({
      properties,
      allProperties,
      myProperties,
      loading,
      fetchAllProperties,
      fetchMyProperties,
      addProperty,
      updateProperty,
      deleteProperty,
      forceRefreshProperties,
    }),
    [
      properties,
      allProperties,
      myProperties,
      loading,
      fetchAllProperties,
      fetchMyProperties,
      addProperty,
      updateProperty,
      deleteProperty,
      forceRefreshProperties,
    ]
  );

  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  );
};
