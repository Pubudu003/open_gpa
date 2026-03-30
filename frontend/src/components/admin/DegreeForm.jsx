import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { INPUT_CLS, LABEL_CLS } from "./constants";

const DEGREE_DEFAULTS = {
  degreeCode: "",
  degreeName: "",
  degreeType: "",
  faculty: "",
  department: "",
};

const DegreeForm = ({ initial = DEGREE_DEFAULTS, onSubmit, isLoading }) => {
  const [form, setForm] = useState(initial);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

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
          <label className={LABEL_CLS}>Degree Code *</label>
          <input
            className={INPUT_CLS}
            required
            value={form.degreeCode}
            onChange={set("degreeCode")}
            placeholder="BSC-CS"
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Degree Type *</label>
          <input
            className={INPUT_CLS}
            required
            value={form.degreeType}
            onChange={set("degreeType")}
            placeholder="General / Special"
          />
        </div>
      </div>
      <div>
        <label className={LABEL_CLS}>Degree Name *</label>
        <input
          className={INPUT_CLS}
          required
          value={form.degreeName}
          onChange={set("degreeName")}
          placeholder="Bachelor of Science in Computer Science"
        />
      </div>
      <div>
        <label className={LABEL_CLS}>Faculty *</label>
        <input
          className={INPUT_CLS}
          required
          value={form.faculty}
          onChange={set("faculty")}
          placeholder="Faculty of Natural Science"
        />
      </div>
      <div>
        <label className={LABEL_CLS}>Department *</label>
        <input
          className={INPUT_CLS}
          required
          value={form.department}
          onChange={set("department")}
          placeholder="Department of Computer Science"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-sky-600 to-violet-600 py-2.5 text-sm font-semibold text-white transition-all hover:from-sky-500 hover:to-violet-500 disabled:opacity-60"
      >
        {isLoading ? (
          <Loader2 size={12} className="animate-spin" />
        ) : (
          <Check size={16} />
        )}
        {isLoading ? "Saving..." : "Save Degree"}
      </button>
    </form>
  );
};

export default DegreeForm;
