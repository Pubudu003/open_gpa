import { useCallback, useEffect, useState } from "react";
import { GraduationCap, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import axiosInstance from "../../lib/axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../ui/LoadingSpinner";

import { FILTER_SELECT_CLS } from "./constants";
import Modal from "../ui/Modal";
import DegreeForm from "./DegreeForm";
import DeleteConfirm from "./DeleteConfirm";

const DegreesTab = () => {
  const [degrees, setDegrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState(null);

  // --- Filter / Search state ---
  const [degreeSearch, setDegreeSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterFaculty, setFilterFaculty] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");

  const fetchDegrees = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/admin/degrees");
      setDegrees(res.data.degrees || []);
      if (res.data.degrees.length === 0) {
        toast.error("No degrees have been created yet.");
      }
    } catch {
      toast.error("Failed to fetch degrees.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDegrees();
  }, [fetchDegrees]);

  // --- Derived unique options ---
  const uniqueTypes = [
    ...new Set(degrees.map((d) => d.degreeType).filter(Boolean)),
  ];
  const uniqueFaculties = [
    ...new Set(degrees.map((d) => d.faculty).filter(Boolean)),
  ];
  const uniqueDepartments = [
    ...new Set(degrees.map((d) => d.department).filter(Boolean)),
  ];

  // --- Filtered list ---
  const filteredDegrees = degrees.filter((d) => {
    const q = degreeSearch.toLowerCase();
    if (
      q &&
      !d.degreeCode.toLowerCase().includes(q) &&
      !d.degreeName.toLowerCase().includes(q)
    )
      return false;
    if (filterType && d.degreeType !== filterType) return false;
    if (filterFaculty && d.faculty !== filterFaculty) return false;
    if (filterDepartment && d.department !== filterDepartment) return false;
    return true;
  });

  const isFiltered =
    degreeSearch || filterType || filterFaculty || filterDepartment;
  const clearFilters = () => {
    setDegreeSearch("");
    setFilterType("");
    setFilterFaculty("");
    setFilterDepartment("");
  };

  const handleAdd = async (data) => {
    setSaving(true);
    try {
      await axiosInstance.post("/admin/degrees", data);
      toast.success("Degree added!");
      setModal(null);
      fetchDegrees();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to add degree");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (data) => {
    setSaving(true);
    try {
      await axiosInstance.put(`/admin/degrees/${modal.edit._id}`, data);
      toast.success("Degree updated!");
      setModal(null);
      fetchDegrees();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to update degree");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/admin/degrees/${modal.delete._id}`);
      toast.success("Degree Deleted!");
      setModal(null);
      fetchDegrees();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to delete degree");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Degrees</h2>
          <p className="mt-0.5 text-sm text-gray-400">
            {isFiltered ? (
              <>
                <span className="font-medium text-sky-400">
                  {filteredDegrees.length}
                </span>{" "}
                of {degrees.length} degree
                {degrees.length !== 1 ? "s" : ""}
              </>
            ) : (
              <>
                {degrees.length} degree{degrees.length !== 1 ? "s" : ""}{" "}
                registered
              </>
            )}
          </p>
        </div>

        <button
          onClick={() => setModal("add")}
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-500"
        >
          <Plus size={16} /> Add Degree
        </button>
      </div>

      {/* --- Filter / Search bar */}
      {!loading && degrees.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-gray-700/60 bg-gray-800/50 p-3">
          {/* Search */}
          <div className="relative min-w-[180px] flex-1">
            <Search
              size={14}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              value={degreeSearch}
              placeholder="Search by code or name.."
              onChange={(e) => setDegreeSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 py-2 pr-3 pl-8 text-xs text-white placeholder-gray-500 transition-all hover:bg-gray-800/70 focus:border-sky-500 focus:outline-none"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className={FILTER_SELECT_CLS}
          >
            <option value="">All Types</option>
            {uniqueTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          {/* Faculty Filter */}
          <select
            value={filterFaculty}
            onChange={(e) => setFilterFaculty(e.target.value)}
            className={FILTER_SELECT_CLS}
          >
            <option value="">All Faculties</option>
            {uniqueFaculties.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>

          {/* Department Filter */}
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className={FILTER_SELECT_CLS}
          >
            <option value="">All Departments</option>
            {uniqueDepartments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Clear */}
          {isFiltered && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/20"
            >
              <X size={12} /> Clear
            </button>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner text="Loading degrees.." />
        </div>
      ) : degrees.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <GraduationCap size={48} className="mb-3 text-gray-600" />
          <p className="font-medium text-gray-400">
            No degrees yet. Add your first degree.
          </p>
        </div>
      ) : filteredDegrees.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Search size={48} className="mb-3 text-gray-600" />
          <p className="font-medium text-gray-400">
            No degrees match your filters.
          </p>
          <button
            onClick={clearFilters}
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
                {["code", "name", "type", "faculty", "department", ""].map(
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
              {filteredDegrees.map((d) => (
                <tr
                  key={d._id}
                  className="transition-colors hover:bg-gray-800/40"
                >
                  <td className="px-4 py-3.5 font-mono font-medium text-sky-400 uppercase">
                    {d.degreeCode}
                  </td>
                  <td className="max-w-50 px-4 py-3.5 font-medium text-white">
                    {d.degreeName}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`${
                        d.degreeType?.toLowerCase() === "special"
                          ? "bg-violet-500/15 text-violet-400"
                          : d.degreeType?.toLowerCase() === "general"
                            ? "bg-sky-500/15 text-sky-400"
                            : d.degreeType?.toLowerCase() === "masters"
                              ? "bg-teal-500/15 text-teal-400"
                              : "bg-gray-500/15 text-gray-400"
                      } rounded-full px-2.5 py-1 text-xs font-medium`}
                    >
                      {d.degreeType}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-gray-300">{d.faculty}</td>
                  <td className="px-4 py-3.5 text-gray-300">{d.department}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setModal({ edit: d })}
                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-sky-400/10 hover:text-sky-400"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setModal({ delete: d })}
                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-400/10 hover:text-red-400"
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
        title="Add New Degree"
      >
        <DegreeForm onSubmit={handleAdd} isLoading={saving} />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!modal?.edit}
        onClose={() => setModal(null)}
        title="Edit Degree"
      >
        {modal?.edit && (
          <DegreeForm
            initial={{
              degreeCode: modal.edit.degreeCode,
              degreeName: modal.edit.degreeName,
              degreeType: modal.edit.degreeType,
              faculty: modal.edit.faculty,
              department: modal.edit.department,
            }}
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
            label={`${modal.delete.degreeCode.toUpperCase()} - ${modal.delete.degreeName}`}
            onCancel={() => setModal(null)}
            onConfirm={handleDelete}
          />
        )}
      </Modal>
    </div>
  );
};

export default DegreesTab;
