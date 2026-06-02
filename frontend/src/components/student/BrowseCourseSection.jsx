import {
  BookOpen,
  Check,
  Filter,
  Loader2,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";

import axiosInstance from "../../lib/axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../ui/LoadingSpinner";
import { useAuthStore } from "../../stores/useAuthStore";

const BrowseCourseSection = ({ selectedCourseIds, onCourseAdded }) => {
  const { setUser } = useAuthStore();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterSemester, setFilterSemester] = useState("all");
  const [filterCredit, setFilterCredit] = useState("all");

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/student/courses");
      setCourses(res.data.courses || []);
    } catch (e) {
      if (e.response?.data?.errorCode === "USER_NOT_ENROLLED") {
        toast.error("Please select your degree first!");
      } else {
        toast.error(e.response?.data?.message || "Failed to load courses");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleAdd = async (courseId) => {
    setAdding(courseId);
    try {
      const res = await axiosInstance.patch(
        `/student/courses/${courseId}/select`,
      );
      setUser(res.data.user);
      toast.success("Course added!");
      onCourseAdded(courseId);
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to add course");
    } finally {
      setAdding(null);
    }
  };

  const availableCredits = [
    ...new Set(courses.map((c) => c.courseCredit)),
  ].sort((a, b) => a - b);

  const filtered = courses.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      c.courseCode.toLowerCase().includes(q) ||
      c.courseName.toLowerCase().includes(q);
    const matchLevel = filterLevel === "all" || String(c.level) === filterLevel;
    const matchSemester =
      filterSemester === "all" || String(c.semester) === filterSemester;
    const matchCredit =
      filterCredit === "all" || String(c.courseCredit) === filterCredit;
    return matchSearch && matchLevel && matchSemester && matchCredit;
  });

  const grouped = filtered.reduce((acc, c) => {
    const key = `Level ${c.level} . Semester ${c.semester}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(c);
    return acc;
  }, {});

  const hasActiveFilter =
    searchQuery ||
    filterLevel !== "all" ||
    filterSemester !== "all" ||
    filterCredit !== "all";
  const resetFilter = () => {
    setSearchQuery("");
    setFilterLevel("all");
    setFilterSemester("all");
    setFilterCredit("all");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <LoadingSpinner text="Loading courses..." />
      </div>
    );
  }

  if (courses.length === 0)
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <BookOpen size={48} className="mb-3 text-gray-600" />
        <p className="font-medium text-gray-400">No courses available</p>
        <p className="mt-1 text-sm text-gray-600">
          Make sure you've selected a degree in your profile.
        </p>
      </div>
    );

  return (
    <div className="space-y-5">
      {/* Filter bar */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 rounded-lg border border-gray-600 bg-gray-800 px-4 py-2.5 transition-all focus-within:border-sky-500">
          <Search size={15} className="shrink-0 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by course code or name..."
            className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-gray-500 transition-colors hover:text-gray-300"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="shrink-0 text-gray-500" />
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="rounded-lg border border-gray-600 bg-gray-800 px-3 py-1.5 text-xs text-white transition-all focus:border-sky-500 focus:outline-none"
          >
            <option value="all">All Levels</option>
            {["3", "4", "5", "6"].map((l) => (
              <option key={l} value={l}>
                Level {l}
              </option>
            ))}
          </select>
          <select
            value={filterSemester}
            onChange={(e) => setFilterSemester(e.target.value)}
            className="rounded-lg border border-gray-600 bg-gray-800 px-3 py-1.5 text-xs text-white transition-all focus:border-sky-500 focus:outline-none"
          >
            <option value="all">All Semesters</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
          </select>
          <select
            value={filterCredit}
            onChange={(e) => setFilterCredit(e.target.value)}
            className="rounded-lg border border-gray-600 bg-gray-800 px-3 py-1.5 text-xs text-white transition-all focus:border-sky-500 focus:outline-none"
          >
            <option value="all">All Credits</option>
            {availableCredits.map((c) => (
              <option key={c} value={c}>
                {c} Credit{c !== 1 ? "s" : ""}
              </option>
            ))}
          </select>
          {hasActiveFilter && (
            <button
              onClick={resetFilter}
              className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs text-gray-400 transition-all hover:bg-red-500/30 hover:text-white"
            >
              <X size={12} /> Clear filters
            </button>
          )}
          <span className="ml-auto text-xs text-gray-500">{}</span>
        </div>
      </div>

      {/* Course display */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-700 bg-gray-900 py-16 text-center">
          <Search size={36} className="mb-3 text-gray-600" />
          <p className="font-medium text-gray-400">
            No courses match your filters
          </p>
          <button
            onClick={resetFilter}
            className="mt-3 text-sm text-sky-400 hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped)
            .sort()
            .map(([group, groupCourses]) => (
              <div key={group}>
                <h3 className="mb-3 px-1 text-sm font-semibold tracking-wider text-gray-400 uppercase">
                  {group}
                </h3>
                <div>
                  {groupCourses.map((c) => {
                    const isAdded = selectedCourseIds.includes(c._id);
                    return (
                      <Motion.div
                        key={c._id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl border border-gray-700 bg-gray-900 p-4 transition-all hover:border-gray-600"
                      >
                        <div className="">
                          <div>
                            <div className="mb-1 flex items-center gap-2">
                              <span className="font-mono text-xs font-semibold text-sky-400 uppercase">
                                {c.courseCode}
                              </span>
                              <span className="rounded bg-gray-700 px-1.5 py-0.5 text-xs text-gray-400">
                                {c.courseCredit} Credits
                              </span>
                              <span className="rounded bg-gray-700/50 px-1.5 py-0.5 text-xs text-gray-500">
                                Level {c.level}
                              </span>
                            </div>
                            <p className="text-sm leading-snug font-medium text-white">
                              {c.courseName}
                            </p>
                            {c.courseDescription && (
                              <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                                {c.courseDescription}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => handleAdd(c._id)}
                            disabled={isAdded || adding === c._id}
                            className={`mt-2 flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                              isAdded
                                ? "cursor-default bg-emerald-500/15 text-emerald-400"
                                : "bg-sky-600 text-white hover:bg-sky-500"
                            }`}
                          >
                            {adding === c._id ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : isAdded ? (
                              <>
                                <Check size={12} /> Added
                              </>
                            ) : (
                              <>
                                <Plus size={12} /> Add
                              </>
                            )}
                          </button>
                        </div>
                      </Motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default BrowseCourseSection;
