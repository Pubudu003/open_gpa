import {
  ArrowLeft,
  FileWarning,
  GraduationCap,
  Mail,
  TriangleAlert,
  CircleCheckBig,
  Loader,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { Button } from "../components/ui/Button";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const { isLoading, forgotPassword } = useAuthStore();
  const [isLinkSent, setIsLinkSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await forgotPassword(email);
      if (res.success) {
        setIsLinkSent(true);
      }
    } catch (error) {
      console.log("Failed to send password reset link", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 text-white">
      <Link
        to={"/signin"}
        className="absolute top-8 left-8 z-10 flex items-center justify-center gap-2 text-gray-400 transition-colors hover:text-white"
      >
        <ArrowLeft />
        <span className="hidden font-medium sm:block">Go Back</span>
      </Link>

      {/* Background glow */}
      <Motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.6 }}
        transition={{ duration: 0.4 }}
        className="pointer-events-none absolute top-[20%] left-[20%] h-[400px] w-[500px] -translate-y-[40%] rounded-full bg-zinc-500/20 blur-[150px]"
      />
      <Motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.6 }}
        transition={{ duration: 0.6 }}
        className="pointer-events-none absolute top-2/5 right-1/5 h-[600px] w-[400px] rounded-full bg-blue-600/20 blur-[150px]"
      />

      <Motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 p-2 shadow-lg shadow-blue-400/30">
            <GraduationCap size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold">Trouble Logging In?</h1>
          <p className="text-gray-400">
            Enter your email to reset your password
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-700/60 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-sm">
          {!isLinkSent ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* --- Email --- */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="focus: w-full rounded-lg border border-gray-600 bg-gray-800/60 py-3 pr-4 pl-10 text-white placeholder-gray-500 transition-all outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                  />
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
                  "Send Reset Link"
                )}
              </Button>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-emerald-600/50 bg-emerald-800/10 p-4">
              <CircleCheckBig size={28} className="text-emerald-200" />
              <p className="text-sm tracking-wide text-emerald-200">
                Password reset link sent to:
              </p>
              <p className="text-lg tracking-wide text-emerald-400">{email}</p>
              <p className="text-sm tracking-wide text-emerald-200">
                Check your email to reset your password
              </p>
            </div>
          )}
        </div>
      </Motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
