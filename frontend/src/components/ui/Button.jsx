export const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  const baseStyles =
    "px-4 py-2 rounded-lg font-semibold transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-500 shadow-md hover:shadow-blue-300/30 hover:text-gray-100",
    primary2:
      "bg-gradient-to-r from-violet-600 to-sky-600 text-white hover:from-violet-500 hover:to-sky-500",
    secondary:
      "bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-gray-600",
    outline:
      "border border-gray-400 text-gray-300 hover:border-gray-200 hover:text-white",
    danger:
      "bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-500 hover:to-rose-500 shadow-lg hover:shadow-red-500/30",
    ghost: "text-slate-300 hover:text-white",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
