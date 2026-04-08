import { useCallback, useEffect, useState } from "react";
import axiosInstance from "../../lib/axios";
import toast from "react-hot-toast";
import { GraduationCap, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { FILTER_SELECT_CLS } from "./constants";
import LoadingSpinner from "../ui/LoadingSpinner";
import Modal from "../ui/Modal";
import CourseForm from "./CourseForm";
import DeleteConfirm from "./DeleteConfirm";

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

  const handleAdd = async (data) => {
    setSaving(true);
    try {
      await axiosInstance.post("/admin/courses", {
        ...data,
        courseCredit: Number(data.courseCredit),
      });
      toast.success("Course added!");
      setModal(null);
      fetchAll();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to add course");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (data) => {
    try {
      await axiosInstance.put(`admin/courses/${modal.edit._id}`, {
        ...data,
        courseCredit: Number(data.courseCredit),
      });
      toast.success("Course updated!");
      setModal(null);
      fetchAll();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to update course");
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await axiosInstance.delete(`admin/courses/${modal.delete._id}`);
      toast.success("Course deleted!");
      setModal(null);
      fetchAll();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to delete course");
    } finally {
      setSaving(false);
    }
  };

  const degreeName = (ids) => {
    if (!ids || ids.length === 0) return "_";
    return ids
      .map((id) => {
        const found = degrees.find((d) => d._id === (id._id || id));
        return found ? found.degreeCode.toUpperCase() : "?";
      })
      .join(", ");
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
          <Plus size={16} /> Add Course
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

      {loading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner text="Loading Courses..." />
        </div>
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <GraduationCap size={48} className="mb-3 text-gray-600" />
          <p className="font-medium text-gray-400">
            No courses yet. Add your first course
          </p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 text-center">
          <Search size={48} className="mb-3 text-gray-600" />
          <p className="font-medium text-gray-400">
            No courses match your filters.
          </p>
          <button
            onClick={clearFilter}
            className="mt-3 cursor-pointer text-sm text-sky-400 transition-colors hover:text-sky-300"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-700">
          <table className="w-full text-sm">
            <thead className="bg-gray-800/80">
              <tr>
                {["code", "name", "credits", "level", "sem", "degrees", ""].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-gray-400 uppercase"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {filteredCourses.map((c) => (
                <tr
                  key={c._id}
                  className="transition-colors hover:bg-gray-800/40"
                >
                  <td className="px-4 py-3.5 font-mono font-medium text-sky-400 uppercase">
                    {c.courseCode}
                  </td>
                  <td className="max-w-50 px-4 py-3.5 font-medium text-white">
                    {c.courseName}
                  </td>
                  <td className="px-4 py-3.5 text-center text-gray-300">
                    {c.courseCredit}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="rounded bg-gray-700 px-2 py-0.5 text-xs text-gray-300">
                      L{c.level}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="rounded bg-gray-700 px-2 py-0.5 text-xs text-gray-300">
                      S{c.semester}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-gray-400">
                    {degreeName(c.degree)}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-2 text-gray-400">
                      <button
                        onClick={() => setModal({ edit: c })}
                        className="rounded-lg p-1.5 transition-colors hover:bg-sky-400/10 hover:text-sky-400"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setModal({ delete: c })}
                        className="rounded-lg p-1.5 transition-colors hover:bg-red-400/10 hover:text-red-400"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={modal === "add"}
        onClose={() => setModal(null)}
        title="Add New Course"
      >
        <CourseForm degrees={degrees} onSubmit={handleAdd} isLoading={saving} />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!modal?.edit}
        onClose={() => setModal(null)}
        title="Edit Course"
      >
        {modal?.edit && (
          <CourseForm
            initial={{
              courseCode: modal.edit.courseCode,
              courseName: modal.edit.courseName,
              courseCredit: modal.edit.courseCredit,
              courseDescription: modal.edit.courseDescription,
              level: modal.edit.level,
              semester: modal.edit.semester,
              degree: modal.edit.degree,
            }}
            degrees={degrees}
            onSubmit={handleEdit}
            isLoading={saving}
          />
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={!!modal?.delete}
        onClose={() => setModal(null)}
        title="Confirm Delete"
      >
        {modal?.delete && (
          <DeleteConfirm
            label={`${modal.delete.courseCode.toUpperCase()} - ${modal.delete.courseName}`}
            onCancel={() => setModal(null)}
            onConfirm={handleDelete}
          />
        )}
      </Modal>
    </div>
  );
};

export default CoursesTab;
