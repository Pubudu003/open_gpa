import { motion as Motion } from "framer-motion";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  GraduationCap,
  Loader,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { useAuthStore } from "../stores/useAuthStore";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { isLoading, signup } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signup(
      form.userName,
      form.email,
      form.password,
      form.confirmPassword,
    );
    if (res.success) navigate("/signin");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 text-white">
      <Link
        to={"/"}
        className="absolute top-8 left-8 z-10 flex items-center justify-center gap-2 text-gray-400 transition-colors hover:text-white"
      >
        <ArrowLeft />
        <span className="hidden font-medium sm:block">Go Back</span>
      </Link>

      {/* --- Background glow */}
      <div className="pointer-events-none absolute top-0 right-1/3 h-[300px] w-[500px] rounded-full bg-sky-600/20 blur-[120px]"></div>
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-[400px] w-[200px] rounded-full bg-violet-600/30 blur-[120px]"></div>

      <Motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mt-8 w-full max-w-md"
      >
        {/* --- Logo ---*/}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-sky-500 to-violet-600 p-2 shadow-lg shadow-sky-500/30">
            <GraduationCap size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold">Create account</h1>
          <p className="text-gray-400">Start tracking your GPA</p>
        </div>

        {/* --- Card --- */}
        <div className="rounded-2xl border border-gray-700/60 bg-gray-900/80 p-8 shadow-2xl backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* --- Username --- */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                Username
              </label>
              <div className="relative">
                <User
                  size={18}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  required
                  value={form.userName}
                  onChange={(e) =>
                    setForm({ ...form, userName: e.target.value })
                  }
                  placeholder="John Doe"
                  className="focus: w-full rounded-lg border border-gray-600 bg-gray-800/60 py-3 pr-4 pl-10 text-white placeholder-gray-500 transition-all outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

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
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="focus: w-full rounded-lg border border-gray-600 bg-gray-800/60 py-3 pr-4 pl-10 text-white placeholder-gray-500 transition-all outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* --- Password --- */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="Min. 8 characters"
                  className="focus: w-full rounded-lg border border-gray-600 bg-gray-800/60 py-3 pr-4 pl-10 text-white placeholder-gray-500 transition-all outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-1/2"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                At least 8 characters
              </p>
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
                  placeholder="Min. 8 characters"
                  className="focus: w-full rounded-lg border border-gray-600 bg-gray-800/60 py-3 pr-4 pl-10 text-white placeholder-gray-500 transition-all outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute top-1/2 right-3 -translate-1/2"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                At least 8 characters
              </p>
            </div>

            {/* --- Submit Button --- */}
            <Button
              variant="primary"
              type="submit"
              className="flex w-full items-center justify-center shadow-lg shadow-sky-900/40"
            >
              {isLoading ? (
                <Loader size={20} className="animate-spin" />
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              to={"/signin"}
              className="font-medium text-sky-400 transition-colors hover:text-violet-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </Motion.div>
    </div>
  );
};

export default SignUpPage;
