import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  checkingAuth: true,

  signup: async (userName, email, password, confirmPassword) => {
    set({ isLoading: true });

    if (password !== confirmPassword) {
      set({ isLoading: false });
      toast.error("Password do not match.");
      return { success: false };
    }

    console.log({ userName, email, password });

    try {
      const res = await axiosInstance.post("/auth/signup", {
        userName,
        email,
        password,
      });
      set({ user: res.data.user, isLoading: false });
      toast.success(res.data.message || "You have successfully signed up.");
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || "Signup failed";
      toast.error(msg);
      return { success: false };
    } finally {
      set({ isLoading: false });
    }
  },

  signin: async (email, password) => {
    set({ isLoading: true });

    try {
      const res = await axiosInstance.post("/auth/signin", {
        email,
        password,
      });
      set({ user: res.data.user, isLoading: false });
      toast.success(res.data.message || "You have successfully signed in.");
      return { success: true, role: res.data.user.role };
    } catch (error) {
      const msg = error.response?.data?.message || "Sign in failed";
      toast.error(msg);
      return { success: false };
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });

    try {
      const res = await axiosInstance.post("/auth/logout");
      set({ user: null, isLoading: false });
      toast.success(res.data.message || "Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    } finally {
      set({ isLoading: false });
    }
  },

  getProfile: async () => {
    set({ checkingAuth: true });
    try {
      // First try student profile and then admin profile
      const res = await axiosInstance.get("/student/profile");
      set({ user: res.data.userProfile });
    } catch {
      // Try admin profile
      try {
        const res = await axiosInstance.get("/admin/profile");
        set({ user: res.data.userProfile });
      } catch {
        set({ user: null });
      }
    } finally {
      set({ checkingAuth: false });
    }
  },
}));
