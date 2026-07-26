import { motion as Motion } from "framer-motion";
import { GraduationCap, Loader } from "lucide-react";
import { useAuthStore } from "../stores/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../components/ui/Button";

const EmailVerificationPage = () => {
  const navigate = useNavigate();
  const { user, verifyEmail, isLoading, resendVerificationCode } =
    useAuthStore();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [counter, setCounter] = useState(0);
  const [canResend, setCanResend] = useState(true);

  const handleChange = (index, value) => {
    const newCode = [...code];

    // Handle pasted content
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);

      // Focus on the last non-empty input or the first empty one
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex].focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      // Move focus to the next input field if value is entered
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");

    try {
      const res = await verifyEmail(verificationCode);
      if (res.success) {
        if (res.role === "admin") navigate("/admin/dashboard");
        else navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();
    try {
      await resendVerificationCode();

      // Reset Counter
      setCounter(60);
      setCanResend(false);
      setCode(["", "", "", "", "", ""]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let timer;
    if (counter > 0) {
      timer = setInterval(() => {
        setCounter((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [counter]);

  // Auto submit when all fields are filled
  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit(new Event("submit"));
    }
  }, [code]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4 text-white">
      {/* --- Background glow */}
      <div className="pointer-events-none absolute top-1/2 right-2/5 h-[400px] w-[600px] rounded-full bg-blue-600/20 blur-[120px]"></div>
      <div className="pointer-events-none absolute top-0 left-1/2 h-[500px] w-[400px] -translate-y-2/5 rounded-full bg-zinc-300/20 blur-[120px]"></div>

      <Motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* --- Logo --- */}
        <div className="mb-8 flex flex-col items-center space-y-2">
          <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 p-2 shadow-lg shadow-blue-400/30">
            <GraduationCap size={32} className="text-white" />
          </div>
          <h1 className="text-center text-3xl font-bold">
            Verify your email address
          </h1>
          <p className="text-center text-gray-400">
            We've sent a verification code to your email.
          </p>
        </div>

        {/* --- Card --- */}
        <div className="flex flex-col items-center space-y-6 rounded-2xl border border-slate-700/60 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-sm">
          <p className="text-center font-semibold text-white">
            Enter 6-digit code sent to your email address.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="6"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="h-10 w-10 rounded-lg border-2 border-slate-600 bg-slate-700 text-center text-2xl font-bold text-white focus:border-blue-500 focus:outline-none md:h-12 md:w-12"
                />
              ))}
            </div>

            <Button
              variant="primary"
              type="submit"
              className="flex w-full items-center justify-center shadow-lg shadow-blue-900/40 disabled:shadow-none disabled:hover:bg-blue-600"
              disabled={isLoading || code.some((digit) => digit === "")}
            >
              {isLoading ? (
                <span>
                  <Loader size={20} className="animate-spin" />
                </span>
              ) : (
                "Verify Email"
              )}
            </Button>
          </form>

          <div className="mt-6">
            <div className="flex items-center justify-center gap-2">
              <p className="text-sm text-gray-400">Trouble verifying?</p>
              {canResend ? (
                <button
                  onClick={(e) => handleResend(e)}
                  className="cursor-pointer text-sm font-medium text-emerald-400 transition-colors hover:text-emerald-300"
                >
                  Resend Code
                </button>
              ) : (
                <span className="text-sm text-gray-400">Wait {counter}s</span>
              )}
            </div>
          </div>
        </div>
      </Motion.div>
    </div>
  );
};

export default EmailVerificationPage;
