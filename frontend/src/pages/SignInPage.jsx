import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  GraduationCap,
  Loader,
  Lock,
  Mail,
} from "lucide-react";

import { Button } from "../components/ui/Button";
import { useAuthStore } from "../stores/useAuthStore";

const SignInPage = () => {
  const navigate = useNavigate();
  const { signin, isLoading } = useAuthStore();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signin(form.email, form.password);
    if (res.success) {
      if (res.role === "admin") navigate("/admin/dashboard");
      else navigate("/dashboard");
    }
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
      <div className="pointer-events-none absolute top-1/2 right-1/3 h-[400px] w-[400px] rounded-full bg-blue-600/20 blur-[120px]"></div>
      <div className="pointer-events-none absolute top-0 left-1/3 h-[400px] w-[300px] rounded-full bg-zinc-300/20 blur-[120px]"></div>

      <Motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* --- Logo ---*/}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 p-2 shadow-lg shadow-blue-400/30">
            <GraduationCap size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="text-gray-400">Sign in to your GPA Calculator</p>
        </div>

        {/* --- Card --- */}
        <div className="rounded-2xl border border-gray-700/60 bg-gray-900/80 p-8 shadow-2xl backdrop-blur-sm">
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
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="focus: w-full rounded-lg border border-gray-600 bg-gray-800/60 py-3 pr-4 pl-10 text-white placeholder-gray-500 transition-all outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
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
                  placeholder="••••••••"
                  className="focus: w-full rounded-lg border border-gray-600 bg-gray-800/60 py-3 pr-4 pl-10 text-white placeholder-gray-500 transition-all outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-1/2"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
                "Sign In"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link
              to={"/signup"}
              className="font-medium text-blue-400 transition-colors hover:text-sky-300"
            >
              Sign up
            </Link>
          </p>
        </div>
      </Motion.div>
    </div>
  );
};

export default SignInPage;
