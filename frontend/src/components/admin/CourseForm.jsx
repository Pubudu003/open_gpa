import { useState } from "react";
import { INPUT_CLS, LABEL_CLS, SELECT_CLS } from "./constants";
import { Check, Loader2, X } from "lucide-react";

// -- Degree Multi Select ---
const DegreeMultiSelect = ({ degrees, selected, onToggle }) => {
  const [search, setSearch] = useState("");
  const filtered = degrees.filter(
    (d) =>
      d.degreeCode.toLowerCase().includes(search.toLowerCase()) ||
      d.degreeName.toLowerCase().includes(search.toLowerCase()),
  );
  const selectedDegrees = degrees.filter((d) => selected.includes(d._id));

  return (
    <div className="space-y-2">
      {/* selected degree phills */}
      {selectedDegrees.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedDegrees.map((d) => (
            <span
              key={d._id}
              className="flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/15 px-2.5 py-1 text-xs font-medium text-sky-400"
            >
              <span className="font-semibold uppercase">{d.degreeCode}</span>
              <button
                type="button"
                onClick={() => onToggle(d._id)}
                className="transition-colors hover:text-red-400"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* degree search bar */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search degrees..."
        className={INPUT_CLS}
      />

      {/* degree selecting */}
      <div className="max-h-30 space-y-1 overflow-y-auto rounded-lg border border-slate-700 bg-slate-800/40 p-2 pr-1">
        {filtered.length === 0 && degrees.length > 0 && (
          <p className="py-3 text-center text-xs text-gray-500">
            No degrees match your search
          </p>
        )}
        {filtered.length === 0 && degrees.length === 0 && (
          <p className="py-3 text-center text-xs text-gray-500">
            No degrees available - add a degree first.
          </p>
        )}
        {filtered.map((d) => (
          <label
            key={d._id}
            className="flex cursor-pointer items-center gap-2.5 rounded-lg p-2 transition-colors hover:bg-slate-700/50"
          >
            <input
              type="checkbox"
              checked={selected.includes(d._id)}
              onChange={() => onToggle(d._id)}
              className="h-4 w-4 shrink-0 accent-blue-500"
            />
            <span className="text-sm text-gray-200">
              <span className="text-xs font-medium text-blue-400 uppercase">
                {d.degreeCode}
              </span>{" "}
              {d.degreeName}
              <span className="ml-1 text-xs text-gray-500">
                ({d.degreeType})
              </span>
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

const COURSE_DEFAULTS = {
  courseCode: "",
  courseName: "",
  courseCredit: "",
  courseDescription: "",
  level: "3",
  semester: "1",
  degree: [],
};
const CourseForm = ({
  initial = COURSE_DEFAULTS,
  degrees = [],
  onSubmit,
  isLoading,
}) => {
  const [form, setForm] = useState({
    ...initial,
    degree: initial.degree?.map
      ? initial.degree.map((d) => (d._id ? d._id : d))
      : [],
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const toggleDegree = (id) => {
    setForm((f) => ({
      ...f,
      degree: f.degree.includes(id)
        ? f.degree.filter((d) => d !== id)
        : [...f.degree, id],
    }));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={LABEL_CLS}>Course Code*</label>
          <input
            className={INPUT_CLS}
            required
            value={form.courseCode}
            onChange={set("courseCode")}
            placeholder="CSI2200"
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Credits*</label>
          <input
            className={INPUT_CLS}
            required
            value={form.courseCredit}
            onChange={set("courseCredit")}
            placeholder="2"
          />
        </div>
      </div>
      <div>
        <label className={LABEL_CLS}>Course Name*</label>
        <input
          className={INPUT_CLS}
          required
          value={form.courseName}
          onChange={set("courseName")}
          placeholder="Computer Security Concepts"
        />
      </div>
      <div>
        <label className={LABEL_CLS}>Description</label>
        <textarea
          className={INPUT_CLS + "h-20 resize-none text-sm"}
          value={form.courseDescription}
          onChange={set("courseDescription")}
          placeholder="Brief description.."
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={LABEL_CLS}>Level *</label>
          <select
            className={SELECT_CLS}
            value={form.level}
            onChange={set("level")}
          >
            {["3", "4", "5", "6"].map((l) => (
              <option key={l} value={l}>
                Level {l}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={LABEL_CLS}>Semester *</label>
          <select
            className={SELECT_CLS}
            value={form.semester}
            onChange={set("semester")}
          >
            {["1", "2"].map((s) => (
              <option key={s} value={s}>
                Semester {s}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className={LABEL_CLS}>Degrees * (select at least one)</label>
        <DegreeMultiSelect
          degrees={degrees}
          selected={form.degree}
          onToggle={toggleDegree}
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isLoading || form.degree.length === 0}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-500 disabled:opacity-60 disabled:hover:bg-blue-600"
      >
        {isLoading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Check size={16} />
        )}
        {isLoading ? "Saving..." : "Save Course"}
      </button>
    </form>
  );
};

export default CourseForm;
