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
  const [loading, setLoading] = useState(true);

  // This function remains useful for an admin-specific page (e.g., a dashboard)
  const fetchMyProperties = useCallback(async () => {
    if (!user || user.role !== "admin") return;

    setLoading(true);
    try {
      const res = await fetch("https://zipacres.onrender.com/api/properties/my", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

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

  // This is the primary function for fetching properties for the public list
  const fetchAllProperties = useCallback(async () => {
    setLoading(true);
    try {
      const headers = {
        "Content-Type": "application/json",
      };

      const res = await fetch("https://zipacres.onrender.com/api/properties", {
        method: "GET",
        headers,
      });

      if (!res.ok) {
        throw new Error("Failed to fetch all properties");
      }
      const data = await res.json();
      setProperties(data.data || []);
    } catch (err) {
      console.error("Error fetching all properties:", err);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // CHANGED: This useEffect is now simplified to meet your requirement.
  // It always fetches all properties for any user.
  useEffect(() => {
    fetchAllProperties();
  }, [fetchAllProperties]); // Runs when the component mounts or when fetchAllProperties changes (i.e., when user logs in/out).


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

  const value = useMemo(
    () => ({
      properties,
      loading,
      setProperties,
      fetchMyProperties, // Still available if you need it elsewhere
      fetchAllProperties,
      addProperty,
      updateProperty,
      deleteProperty,
    }),
    [
      properties,
      loading,
      fetchMyProperties,
      fetchAllProperties,
      addProperty,
      updateProperty,
      deleteProperty,
    ]
  );

  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  );
};