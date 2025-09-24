import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";

const PropertyContext = createContext();
export const useProperties = () => useContext(PropertyContext);

export const PropertyProvider = ({ children }) => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch admin's own properties (for Dashboard)
  const fetchProperties = useCallback(async () => {
    if (!user || user.role !== "admin") {
      setProperties([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/properties/my", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch your properties");
      const data = await res.json();
      
      setProperties(data.data || []);
    } catch (err) {
      console.error("Error fetching your properties:", err);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch all public properties (for Properties page)
  const fetchAllProperties = useCallback(async () => {
    try {
      setLoading(true);
      
      // For all public properties, we don't need authentication
      const headers = {
        "Content-Type": "application/json",
      };
      
      // Add auth header if user is logged in
      if (user?.token) {
        headers.Authorization = `Bearer ${user.token}`;
      }

      const res = await fetch("http://localhost:5000/api/properties", {
        method: "GET",
        headers,
      });

      if (!res.ok) throw new Error("Failed to fetch all properties");
      const data = await res.json();
      
      setProperties(data.data || []);
    } catch (err) {
      console.error("Error fetching all properties:", err);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Auto-fetch admin's properties when user logs in (for Dashboard)
  useEffect(() => {
    if (user && user.role === "admin") {
      fetchProperties();
    } else {
      setProperties([]);
      setLoading(false);
    }
  }, [user, fetchProperties]);

  const addProperty = (property) => {
    setProperties((prev) => [property, ...prev]);
  };

  const updateProperty = (updatedProperty) => {
    setProperties((prev) =>
      prev.map((p) => (p._id === updatedProperty._id ? updatedProperty : p))
    );
  };

  const deleteProperty = (id) => {
    setProperties((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <PropertyContext.Provider
      value={{
        properties,
        loading,
        setProperties,
        fetchProperties,        // For Dashboard - admin's own properties
        fetchAllProperties,     // For Properties page - all public properties
        addProperty,
        updateProperty,
        deleteProperty,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};