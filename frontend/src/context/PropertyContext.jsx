import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useAuth } from "./AuthContext";

const PropertyContext = createContext();

export const useProperties = () => useContext(PropertyContext);

export const PropertyProvider = ({ children }) => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false); // Set initial loading to false
  
  // New: Add a status to track if the fetch has been attempted
  const [fetchStatus, setFetchStatus] = useState("idle"); // 'idle' | 'loading' | 'succeeded' | 'failed'

  // This function remains useful for an admin-specific page (e.g., a dashboard)
  const fetchMyProperties = useCallback(async () => {
    // ... (no changes needed in this function)
    if (!user || user.role !== "admin") return;

    setLoading(true);
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

      if (!res.ok) {
        throw new Error("Failed to fetch your properties");
      }
      const data = await res.json();
      setProperties(data.data || []); 
    } catch (err) {
      console.error("Error fetching your properties:", err);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // This function now manages the fetch status to prevent re-fetching
  const fetchAllProperties = useCallback(async () => {
    // If we are already loading or have succeeded, don't fetch again
    if (fetchStatus === "loading" || fetchStatus === "succeeded") {
      return;
    }

    setLoading(true);
    setFetchStatus("loading");
    try {
      const res = await fetch("https://zipacres.onrender.com/api/properties", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch all properties");
      }
      const data = await res.json();
      setProperties(data.data || []);
      setFetchStatus("succeeded"); // Mark as succeeded
    } catch (err) {
      console.error("Error fetching all properties:", err);
      setProperties([]);
      setFetchStatus("failed"); // Mark as failed
    } finally {
      setLoading(false);
    }
  }, [fetchStatus]); // Depend on fetchStatus

  // This is now the ONLY useEffect for fetching data.
  // It runs when the provider mounts and will only fetch if the status is 'idle'.
  useEffect(() => {
    if (fetchStatus === "idle") {
      fetchAllProperties();
    }
  }, [fetchStatus, fetchAllProperties]);

  const addProperty = useCallback((property) => {
    setProperties((prev) => [property, ...prev]);
  }, []);

  const updateProperty = useCallback((updatedProperty) => {
    setProperties((prev) =>
      prev.map((p) => (p._id === updatedProperty._id ? updatedProperty : p))
    );
  }, []);

  const deleteProperty = useCallback((id) => {
    setProperties((prev) => prev.filter((p) => p._id !== id));
  }, []);
  
  // Bonus: A function to manually refresh the properties if needed
  const forceRefreshProperties = useCallback(() => {
    setFetchStatus('idle');
  }, []);

  const value = useMemo(
    () => ({
      properties,
      loading,
      fetchMyProperties,
      fetchAllProperties, // You can keep this if you want to call it manually
      addProperty,
      updateProperty,
      deleteProperty,
      forceRefreshProperties, // Expose the refresh function
    }),
    [
      properties,
      loading,
      fetchMyProperties,
      fetchAllProperties,
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