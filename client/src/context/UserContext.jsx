import { createContext, useContext, useState } from "react";
import axios from "axios";
import { server } from "../constants/config";

const UserContext = createContext();

// Custom Hook to use User Context
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ New function to fetch user only when needed
  const fetchUser = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}/api/v1/user/me`, {
        withCredentials: true,
      });
      setUser(data.user);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Function to update user profile
  const updateUser = async (formData) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.put(`${server}/api/v1/user/update`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      setUser(data.user); // ✅ Update user state
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ user, fetchUser, updateUser, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};
