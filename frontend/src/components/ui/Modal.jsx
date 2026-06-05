import { AnimatePresence, motion as Motion } from "framer-motion";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <Motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal box */}
          <Motion.div
            className="relative z-10 w-full max-w-lg rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white">{title}</h2>
              <button
                className="cursor-pointer rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-400/10 hover:text-red-400"
                onClick={onClose}
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="max-h-140 overflow-y-auto p-6">{children}</div>
          </Motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
