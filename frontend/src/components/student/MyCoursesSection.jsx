import {
  BookMarked,
  ChevronDown,
  Loader2,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import axiosInstance from "../../lib/axios";
import toast from "react-hot-toast";
import { GRADES, GPV_MAP, gradeColor } from "./constants";
import LoadingSpinner from "../ui/LoadingSpinner";
import { useAuthStore } from "../../stores/useAuthStore";

const MyCoursesSection = ({ onCourseRemoved }) => {
  const { user, setUser, getProfile } = useAuthStore();
  // const [coursesInHand, setCoursesInHand] = useState([]);
  // const [gpaData, setGpaData] = useState({ gpa: 0, totalCredits: 0 });
  const [loading, setLoading] = useState(false);
  const [updatingGrade, setUpdatingGrade] = useState(null);
  const [removing, setRemoving] = useState(null);

  /*
  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [ihRes, gpaRes] = await Promise.all([
        axiosInstance.get("/student/courses-in-hand"),
        axiosInstance.get("/student/gpa"),
      ]);
      setCoursesInHand(ihRes.data.courses?.courses || []);
      setGpaData(gpaRes.data.userGPA || { gpa: 0, totalCredits: 0 });
    } catch {
      toast.error("Failed to load your courses");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  */

  const handleGradeChange = async (courseId, grade) => {
    setUpdatingGrade(courseId);
    try {
      const res = await axiosInstance.patch(
        `/student/courses-in-hand/${courseId}/grade`,
        {
          grade,
        },
      );
      setUser(res.data.updatedUser);
      toast.success("Grade updated!");
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to update grade");
    } finally {
      setUpdatingGrade(null);
    }
  };

  const handleRemove = async (courseId) => {
    setRemoving(courseId);
    try {
      await axiosInstance.delete(`/student/courses/${courseId}/deselect`);
      // await fetchData(true);
      toast.success("Course removed!");
      onCourseRemoved(courseId);
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to remove course");
    } finally {
      setRemoving(null);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-40">
        <LoadingSpinner text="Loading your courses..." />
      </div>
    );

  const gpaGradient =
    user.gpa >= 3.7
      ? "from-emerald-600 to-teal-600"
      : user.gpa >= 3.0
        ? "from-sky-600 to-blue-600"
        : user.gpa >= 2.0
          ? "from-yellow-600 to-orange-600"
          : "from-red-600 to-rose-600";

  return (
    <div className="space-y-6">
      <div
        className={`relative overflow-hidden bg-linear-to-br ${gpaGradient} rounded-2xl p-6 transition-colors duration-300`}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white/70">Current GPA</p>
            <p className="mt-1 text-5xl font-bold text-white transition-all duration-300">
              {user.gpa.toFixed(2)}
            </p>
            <p className="mt-2 text-sm text-white/60">
              {user.totalCredits ?? 0} total credit hours
            </p>
          </div>
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
            <TrendingUp size={36} className="text-white" />
          </div>
        </div>
        <div className="absolute -right-6 -bottom-6 h-32 w-32 rounded-full bg-white/5" />
        <div className="absolute -top-4 -left-4 h-24 w-24 rounded-full bg-white/5" />
      </div>

      {user.courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-700 bg-gray-900 py-16 text-center">
          <BookMarked size={40} className="mb-3 text-gray-600" />
          <p className="font-medium text-gray-400">No courses selected</p>
          <p className="mt-1 text-sm text-gray-600">
            Head to Browse Courses to add some.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-700 bg-gray-900">
          <div className="border-b border-gray-700 px-5 py-4">
            <h3 className="font-semibold text-white">
              Selected Courses ({user.courses.length})
            </h3>
          </div>
          <div className="divide-y divide-gray-700/50">
            {user.courses.map((item) => {
              const course = item.course;
              if (!course) return null;
              return (
                <div
                  key={item._id || course._id}
                  className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-gray-800/30"
                >
                  <div className="min-w-0 flex-1">
                    <div className="mb-0.5 flex items-center gap-2">
                      <span className="font-mono text-xs text-sky-400 uppercase">
                        {course.courseCode}
                      </span>
                      <span className="text-xs text-gray-600">.</span>
                      <span className="text-xs text-gray-500">
                        {course.courseCredit} cr
                      </span>
                      <span className="text-xs text-gray-600">.</span>
                      <span className="text-xs text-gray-500">
                        L{course.level} S{course.semester}
                      </span>
                    </div>
                    <p className="truncate text-sm font-medium text-white">
                      {course.courseName}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <select
                        value={item.grade || ""}
                        onChange={(e) =>
                          handleGradeChange(course._id, e.target.value)
                        }
                        disabled={updatingGrade === course._id}
                        className={`appearance-none rounded-lg border border-gray-600 bg-gray-800 py-1.5 pr-7 pl-3 text-sm font-semibold transition-all focus:border-sky-500 focus:outline-none ${gradeColor(item.grade)} ${updatingGrade === course._id ? "opacity-60" : ""}`}
                      >
                        <option value="" disabled className="text-gray-500">
                          Grade
                        </option>
                        {GRADES.map((g) => (
                          <option key={g} value={g} className="text-white">
                            {g}
                          </option>
                        ))}
                      </select>
                      {updatingGrade === course._id ? (
                        <Loader2
                          size={12}
                          className="absolute top-1/2 right-2 -translate-y-1/2 animate-spin text-sky-400"
                        />
                      ) : (
                        <ChevronDown
                          size={12}
                          className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-gray-400"
                        />
                      )}
                    </div>
                    {item.grade && (
                      <span className="text-xs text-gray-500">
                        GPV:{" "}
                        <span
                          className={`font-semibold ${gradeColor(item.grade)} transition-all`}
                        >
                          {GPV_MAP[item.grade]?.toFixed(2)}
                        </span>
                      </span>
                    )}
                    <button
                      onClick={() => handleRemove(course._id)}
                      disabled={removing === course._id}
                      className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-red-400/10 hover:text-red-400"
                    >
                      {removing === course._id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCoursesSection;
