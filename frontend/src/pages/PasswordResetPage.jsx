import { motion as Motion } from "framer-motion";
import { Eye, EyeOff, GraduationCap, Loader, Lock } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { useAuthStore } from "../stores/useAuthStore";
import toast from "react-hot-toast";

const PasswordResetPage = () => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const { isLoading, resetPassword } = useAuthStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Compete the handlesubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = searchParams.get("token");
      if (!token) {
        toast.error("Something went wrong. Please try again later.");
        return { success: false };
      }

      const res = await resetPassword(
        form.newPassword,
        form.confirmPassword,
        token,
      );

      if (res.success) {
        toast.success(
          "Password reset successfully, Please sign in with your new password.",
        );
        navigate("/signin");
      } else {
        toast.error(res.message);
        navigate("/forgot-password");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 text-white">
      {/* Background glow */}
      <Motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.6 }}
        transition={{ duration: 0.4 }}
        className="pointer-events-none absolute top-[60%] left-[20%] h-[500px] w-[400px] rounded-full bg-zinc-500/20 blur-[130px]"
      />
      <Motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.6 }}
        transition={{ duration: 0.6 }}
        className="pointer-events-none absolute top-[0%] right-[20%] h-[600px] w-[500px] -translate-y-[40%] rounded-full bg-blue-600/20 blur-[150px]"
      />

      <Motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center space-y-2">
          <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 p-2 shadow-lg shadow-blue-400/30">
            <GraduationCap size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold">Reset your password</h1>
          <p className="text-gray-400">Enter new password</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-700/60 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* --- Password --- */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                New Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showNewPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={form.newPassword}
                  onChange={(e) =>
                    setForm({ ...form, newPassword: e.target.value })
                  }
                  placeholder="••••••••"
                  className="focus: w-full rounded-lg border border-gray-600 bg-gray-800/60 py-3 pr-4 pl-10 text-white placeholder-gray-500 transition-all outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* --- Confirm Password --- */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  placeholder="••••••••"
                  className="focus: w-full rounded-lg border border-gray-600 bg-gray-800/60 py-3 pr-4 pl-10 text-white placeholder-gray-500 transition-all outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* --- Submit Button --- */}
            <Button
              variant="primary"
              type="submit"
              className="flex w-full items-center justify-center shadow-lg shadow-blue-900/40"
            >
              {isLoading ? (
                <Loader size={20} className="animate-spin" />
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </div>
      </Motion.div>
    </div>
  );
};

export default PasswordResetPage;
