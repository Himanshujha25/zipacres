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

  // 🔹 helper for API call
  const fetchFromAPI = useCallback(
    async (filterByUser = false) => {
      if (!user) return;

      try {
        setLoading(true);
        const res = await fetch("https://zipacres.onrender.com/api/properties", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch properties");
        const data = await res.json();

        if (filterByUser && user.role === "admin") {
          setProperties(data.data.filter((p) => p.ownerId.email === user.email));
        } else {
          setProperties(data.data || []);
        }
      } catch (err) {
        console.error("Error fetching properties:", err);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  // 🔹 fetch only current user properties (admin filtered)
  const fetchProperties = useCallback(() => {
    fetchFromAPI(true);
  }, [fetchFromAPI]);

  // 🔹 fetch all properties (no filter)
  const fetchallProperties = useCallback(() => {
    fetchFromAPI(false);
  }, [fetchFromAPI]);

  // ✅ Run once whenever user changes (login/logout)
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

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
        fetchProperties,
        fetchallProperties,
        addProperty,
        updateProperty,
        deleteProperty,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};
