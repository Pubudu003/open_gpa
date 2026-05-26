import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import axiosInstance from "../../lib/axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../ui/LoadingSpinner";
import DegreeChangingWarning from "./DegreeChangingWarning";
import {
  GraduationCap,
  User,
  BookOpen,
  TrendingUp,
  Info,
  ContactRound,
  LogOut,
  AlertTriangle,
  Award,
  BookMarked,
  AlertCircle,
  Loader2,
  Check,
} from "lucide-react";
import DegreeSearchPicker from "./DegreeSearchPicker";

const ProfileSection = ({ user, onProfileUpdate }) => {
  const [degrees, setDegrees] = useState([]);
  const [selectedDegree, setSelectedDegree] = useState(user?.degree?._id || "");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  // temporary fix for issue where the gpa details are not refreshed after course grade change.
  const [gpaData, setGpaData] = useState({ gpa: 0, totalCredits: 0 });

  const fetchGpaData = useCallback(async () => {
    try {
      const gpaRes = await axiosInstance.get("/student/gpa");
      setGpaData(gpaRes.data.userGPA || { gpa: 0, totalCredits: 0 });
    } catch {
      if (!user?.degree?._id) {
        toast.error("You have not selected a degree!");
      } else {
        toast.error("Failed to load GPA. Please try again.");
      }
    }
  }, [user]);

  useEffect(() => {
    fetchGpaData();
  }, [fetchGpaData]);

  //=========================================================================

  useEffect(() => {
    const fetchDegrees = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/student/degrees");
        setDegrees(res.data.degrees || []);
      } catch {
        // only toast if student has no degree (they need the list to set one)
        if (!user?.degree?._id) {
          toast.error("Failed to load degrees. Please refresh.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDegrees();
  }, [user]);

  const GPA_CARD_VALUES = [
    {
      label: "GPA",
      value: gpaData.gpa.toFixed(2),
      icon: TrendingUp,
      color: "text-emerald-400",
    },
    {
      label: "Total Credits",
      value: gpaData.totalCredits,
      icon: Award,
      color: "text-sky-400",
    },
    {
      label: "Course Selected",
      value: user?.courses?.length ?? 0,
      icon: BookMarked,
      color: "text-violet-400",
    },
  ];

  useEffect(() => {
    if (user?.degree?._id) setSelectedDegree(user.degree._id);
  }, [user?.degree?._id]);

  const doSave = async () => {
    setShowWarning(false);
    setSaving(true);
    try {
      await axiosInstance.patch("/student/profile", {
        degreeId: selectedDegree,
      });
      toast.success("Degree updated successfully!");
      onProfileUpdate(); // degree change -> full profile refresh is intentional here
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to update degree");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = () => {
    if (!selectedDegree) return toast.error("Please select a degree");
    if (user?.degree?._id && user.degree._id !== selectedDegree) {
      setShowWarning(true);
    } else {
      doSave();
    }
  };

  const isDirty = selectedDegree && selectedDegree !== user?.degree?._id;
  //const isDirty = true;

  // Immediately, even before the degrees array arrives form the API, we need to have a fallback label for the degree picker
  const fallbackLabel = user?.degree
    ? `[${user.degree.degreeCode?.toUpperCase()}] ${user.degree.degreeName}`
    : "";

  return (
    <>
      {/* Warning Modal */}
      <AnimatePresence>
        {showWarning && (
          <DegreeChangingWarning
            onConfirm={doSave}
            onCancel={() => {
              setShowWarning(false);
              setSelectedDegree(user?.degree?._id || "");
              console.log("Cancel Button Clicked on degree change warning.");
            }}
          />
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {/* Info card */}
        <div className="rounded-2xl border border-gray-700 bg-gray-900 p-6">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-sky-500 to-violet-600 text-2xl font-bold text-white">
              {user?.userName?.[0]?.toUpperCase() || "S"}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{user?.userName}</h3>
              <p className="text-sm text-gray-400">{user?.email}</p>
              <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-sky-500/15 px-2.5 py-0.5 text-xs font-medium text-sky-400 capitalize">
                <User size={10} /> {user?.role}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {GPA_CARD_VALUES.map(({ label, value, icon: Icon, color }) => (
              <div
                key={label}
                className="rounded-xl bg-gray-800/50 p-4 text-center"
              >
                <Icon size={20} className={`${color} mx-auto mb-1`} />
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="mt-0.5 text-xs text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Degree picker */}
        <div className="rounded-2xl border border-gray-700 bg-gray-900 p-6">
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-white">
            <GraduationCap size={18} className="text-sky-400" /> Enrolled Degree
          </h3>

          {user?.degree ? (
            <div className="mb-4 rounded-xl border border-sky-500/20 bg-sky-500/10 p-4">
              <p className="font-semibold text-sky-400">
                {user.degree.degreeName}
              </p>
              <p className="text-sm text-gray-400">
                {user.degree.faculty} . {user.degree.department}
              </p>
              <p className="mt-1 text-xs text-gray-500 uppercase">
                {user.degree.degreeCode} . {user.degree.degreeType}
              </p>
            </div>
          ) : (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-3">
              <AlertCircle size={16} className="shrink-0 text-yellow-400" />
              <p className="text-sm text-yellow-300">
                You haven't selected a degree yet. Pick one below to see your
                courses.
              </p>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-4">
              <LoadingSpinner size="sm" />
            </div>
          ) : (
            <div className="space-y-3">
              <DegreeSearchPicker
                degrees={degrees}
                selectedId={selectedDegree}
                onSelect={setSelectedDegree}
                fallbackLabel={fallbackLabel}
              />

              {user?.degree && isDirty && (
                <div className="flex items-start gap-2 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3">
                  <AlertTriangle
                    size={15}
                    className="mt-0.5 shrink-0 text-yellow-400"
                  />
                  <p className="text-xs leading-relaxed text-yellow-300">
                    Changing your degree will{" "}
                    <strong>erase all linked course data</strong>. You'll be
                    prompted to confirm.
                  </p>
                </div>
              )}

              <button
                onClick={handleSave}
                disabled={saving || !selectedDegree}
                className="flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-500 disabled:bg-gray-500/50 disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Check size={15} />
                )}
                {saving
                  ? "Saving..."
                  : user?.degree
                    ? "Update Degree"
                    : "Set Degree"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfileSection;
