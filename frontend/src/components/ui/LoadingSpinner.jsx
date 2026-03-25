import { motion as Motion } from "framer-motion";

const LoadingSpinner = ({ size = "md", text = "" }) => {
  const sizes = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <Motion.div
        className={`${sizes[size]} rounded-full border-4 border-gray-700 border-t-sky-500`}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
      />
      {text && <p className="text-sm text-gray-400">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
