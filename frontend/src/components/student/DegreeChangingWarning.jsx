import { motion as Motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

const DegreeChangingWarning = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
    <Motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      className="w-full max-w-md rounded-2xl border border-yellow-500/30 bg-gray-900 p-6 shadow-2xl"
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-500/10">
          <AlertTriangle size={28} className="text-yellow-400" />
        </div>
        <div>
          <p className="text-lg font-bold text-white">Change Degree?</p>
          <p className="mt-2 text-sm leading-relaxed text-gray-400">
            Changing your degree will{" "}
            <span className="font-semibold text-yellow-300">
              permanently erase all course data
            </span>{" "}
            linked to your current degree. All selected courses and grades will
            be cleared.
          </p>
        </div>
        <div className="flex w-full gap-3 pt-1">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-gray-600 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-lg border bg-yellow-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-yellow-500"
          >
            Yes, Change Degree
          </button>
        </div>
      </div>
    </Motion.div>
  </div>
);

export default DegreeChangingWarning;
