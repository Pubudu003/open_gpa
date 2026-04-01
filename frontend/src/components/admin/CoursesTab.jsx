import { useCallback, useEffect, useState } from "react";
import axiosInstance from "../../lib/axios";
import toast from "react-hot-toast";
import { Plus, Search, X } from "lucide-react";
import { FILTER_SELECT_CLS } from "./constants";

const CoursesTab = () => {
  const [courses, setCourses] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState(null);

  // --- Filter / Search state ---
  const [courseSearch, setCourseSearch] = useState("");
  const [filterCredits, setFilterCredits] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [filterSem, setFilterSem] = useState("");
  const [filterDegree, setFilterDegree] = useState("");

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [cRes, dRes] = await Promise.all([
        axiosInstance.get("/admin/courses"),
        axiosInstance.get("/admin/degrees"),
      ]);
      setCourses(cRes.data.courses || []);
      setDegrees(dRes.data.degrees || []);
      if (cRes.data.courses.length === 0 || dRes.data.degrees.length === 0) {
        toast.error("No degrees or courses have been created yet.");
      }
    } catch {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // --- Derived unique options ---
  const uniqueCredits = [...new Set(courses.map((c) => c.courseCredit))].sort(
    (a, b) => a - b,
  );
  const uniqueLevels = [...new Set(courses.map((c) => String(c.level)))].sort();
  const uniqueSems = [
    ...new Set(courses.map((c) => String(c.semester))),
  ].sort();

  // --- Filtered list ---
  const getDegreeIds = (degArr) => (degArr || []).map((d) => d._id || d);

  const filteredCourses = courses.filter((c) => {
    const q = courseSearch.toLocaleLowerCase();
    if (
      q &&
      !c.courseCode.toLocaleLowerCase().includes(q) &&
      !c.courseCode.toLocaleLowerCase().includes(q)
    )
      return false;
    if (filterCredits && String(c.courseCredit) !== filterCredits) return false;
    if (filterLevel && String(c.level) !== filterLevel) return false;
    if (filterSem && String(c.semester) !== filterSem) return false;
    if (filterDegree && !getDegreeIds(c.degree).includes(filterDegree))
      return false;
    return true;
  });

  const isFiltered =
    courseSearch || filterCredits || filterLevel || filterSem || filterDegree;
  const clearFilter = () => {
    setCourseSearch("");
    setFilterCredits("");
    setFilterLevel("");
    setFilterSem("");
    setFilterDegree("");
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Courses</h2>
          <p className="mt-0.5 text-sm text-gray-400">
            {isFiltered ? (
              <>
                <span className="font-medium text-sky-400">
                  {filteredCourses.length}
                </span>{" "}
                of {courses.length} course
                {courses.length !== 1 ? "s" : ""}
              </>
            ) : (
              <>
                {courses.length} course{courses.length !== 1 ? "s" : ""}{" "}
                registered
              </>
            )}
          </p>
        </div>

        <button
          onClick={() => setModal("add")}
          className="flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-500"
        >
          <Plus size={16} /> Add course
        </button>
      </div>

      {/* Filter / Searchbar */}
      {!loading && courses.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-gray-700/60 bg-gray-800/50 p-3">
          {/* Search */}
          <div className="relative min-w-[180px] flex-1">
            <Search
              size={14}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              value={courseSearch}
              placeholder="Search by code or name.."
              onChange={(e) => setCourseSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 py-2 pr-3 pl-8 text-xs text-white placeholder-gray-500 transition-all hover:bg-gray-800/70 focus:border-sky-500 focus:outline-none"
            />
          </div>

          {/* Credit filter */}
          <select
            value={filterCredits}
            onChange={(e) => setFilterCredits(e.target.value)}
            className={FILTER_SELECT_CLS}
          >
            <option value="">All Credits</option>
            {uniqueCredits.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Level filter */}
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className={FILTER_SELECT_CLS}
          >
            <option value="">All Levels</option>
            {uniqueLevels.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>

          {/* Semester filter */}
          <select
            value={filterSem}
            onChange={(e) => setFilterSem(e.target.value)}
            className={FILTER_SELECT_CLS}
          >
            <option value="">All Semesters</option>
            {uniqueSems.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Degree filter */}
          <select
            value={filterDegree}
            onChange={(e) => setFilterDegree(e.target.value)}
            className={FILTER_SELECT_CLS}
          >
            <option value="">All Degrees</option>
            {degrees.map((d) => (
              <option key={d._id} value={d._id}>
                {d.degreeCode.toUpperCase()} - {d.degreeName}
              </option>
            ))}
          </select>

          {/* Clear */}
          {isFiltered && (
            <button
              onClick={clearFilter}
              className="hover: flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/20"
            >
              <X size={12} /> Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CoursesTab;
