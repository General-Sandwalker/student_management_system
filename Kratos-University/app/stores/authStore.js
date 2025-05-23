import { create } from "zustand";
import axios from "axios";

const useAuthStore = create((set, get) => ({
  user: null,
  loading: false,

  login: async (userData) => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/auth/login", userData);
      const user = res.data;
      set({ user });
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch (err) {
      if (err.response) {
        // Server responded with an error
        throw new Error(err.response.data?.error || `Login failed: ${err.response.status}`);
      } else if (err.request) {
        // Request was made but no response
        throw new Error('No response from server. Please check your connection.');
      } else {
        // Something else went wrong
        throw new Error('Login request failed. Please try again.');
      }
    }
  },

  register: async (userData) => {
    try {
      const res = await axios.post("http://localhost:8000/auth/register", userData);
      const user = res.data;
      set({ user });
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch (err) {
      throw new Error(err.response?.data?.error || "Registration failed");
    }
  },

  logout: () => {
    set({ user: null });
    localStorage.removeItem("user");
    // Optional: you can also call the backend logout if needed
  },

  checkAuth: () => {
    const user = get().user;
    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        set({ user: JSON.parse(storedUser) });
      } else {
        return false;
      }
    }
    return true;
  },
}));

export default useAuthStore;