import { AlertTriangle } from "lucide-react";

const DeleteConfirm = ({ label, onCancel, onConfirm }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-2">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
        <AlertTriangle size={28} className="text-red-400" />
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold text-white">Delete {label}?</p>
        <p className="mt-1 text-sm text-gray-400">
          This action cannot be undone.
        </p>
      </div>
      <div className="flex w-full gap-3">
        <button
          onClick={onCancel}
          className="flex-1 rounded-lg border border-gray-600 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirm;
