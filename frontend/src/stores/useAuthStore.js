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
    } catch {
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

  silentProfileRefresh: async () => {
    try {
      const res = await axiosInstance.get("/student/profile");
      set({ user: res.data.userProfile });
    } catch {
      try {
        const res = await axiosInstance.get("/admin/profile");
        set({ user: res.data.userProfile });
      } catch {
        set({ user: null });
      }
    }
  },

  verifyEmail: async (verificationCode) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("/auth/verify-email", {
        verificationCode,
      });
      set({ user: res.data.user, isLoading: false });
      toast.success(res.data.message || "User verified successfully");
      return { success: true, role: res.data.user.role };
    } catch (error) {
      const msg =
        error.response?.data?.message || "Verification failed, Try Resend.";
      toast.error(msg);
      return { success: false };
    } finally {
      set({ isLoading: false });
    }
  },

  resendVerificationCode: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("/auth/resend-verification-code");
      toast.success(
        res.data.message || "Verification code resend to your email",
      );
      return { success: true };
    } catch (error) {
      const msg =
        error.response?.data?.message || "Verification code send failed";
      toast.error(msg);
      return { success: false };
    } finally {
      set({ isLoading: false });
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("/auth/forgot-password", { email });
      toast.success(
        res.data.message ||
          "A password reset link has been sent to your email address.",
      );
      return { success: true };
    } catch (error) {
      console.log("Failed to send password reset link", error);
      const msg =
        error.response?.data?.message || "Failed to send password reset link";
      toast.error(msg);
      return { success: false };
    } finally {
      set({ isLoading: false });
    }
  },

  // Need to create resetPassword..........
  resetPassword: async (newPassword, confirmPassword, token) => {
    set({ isLoading: true });
    try {
      if (!token) {
        set({ isLoading: false });
        toast.error("Something went wrong. Please try again later.");
        return { success: false };
      }

      if (newPassword !== confirmPassword) {
        set({ isLoading: false });
        toast.error("Password not match");
        return { success: false };
      }

      const res = await axiosInstance.post("/auth/reset-password", {
        newPassword,
        token,
      });
      set({ user: res.data.user, isLoading: false });
      toast.success("Password reset successfully");
      return { success: true };
    } catch (error) {
      console.log("Failed to reset password", error);
      const msg = error.response?.data?.message || "Failed to reset password";
      toast.error(msg);
      return { success: false };
    } finally {
      set({ isLoading: false });
    }
  },

  // --- User State ---
  setUser: (user) => set({ user }),
}));
