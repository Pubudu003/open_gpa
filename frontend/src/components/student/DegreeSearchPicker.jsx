import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { AnimatePresence, motion as Motion } from "framer-motion";

const DegreeSearchPicker = ({
  degrees,
  selectedId,
  onSelect,
  fallbackLabel = "",
}) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const selected = degrees.find((d) => d._id === selectedId);

  // Use fallback label when the degrees array hasn't loaded yet
  const displayLabel = selected
    ? `[${selected.degreeCode.toUpperCase()}] ${selected.degreeName}`
    : fallbackLabel;

  const filtered = degrees.filter(
    (d) =>
      d.degreeName.toLowerCase().includes(query.toLowerCase()) ||
      d.degreeCode.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  });

  const handleSelect = (d) => {
    onSelect(d._id);
    setQuery("");
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div
        className="flex w-full cursor-pointer items-center gap-2 rounded-lg border border-gray-600 bg-gray-800 px-4 py-2.5 transition-all focus-within:border-sky-500"
        onClick={() => setOpen((o) => !o)}
      >
        <Search size={15} className="shrink-0 text-gray-500" />
        <input
          type="text"
          value={open ? query : displayLabel}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            setQuery("");
            setOpen(true);
          }}
          placeholder="Search and select a degree.."
          className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none"
        />
        <ChevronDown
          size={15}
          className={`shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </div>

      <AnimatePresence>
        {open && (
          <Motion.div>
            <div className="max-h-52 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="py-6 text-center text-sm text-gray-500">
                  {degrees.length === 0
                    ? "Loading degrees.."
                    : "No degrees match your search."}
                </p>
              ) : (
                filtered.map((d) => (
                  <button
                    key={d._id}
                    type="button"
                    onClick={() => handleSelect(d)}
                    className={`w-full border-b border-gray-700/50 px-4 py-3 text-left transition-colors last:border-0 hover:bg-gray-700/70 ${selectedId === d._id ? "bg-sky-500/10" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="shrink-0 font-mono text-xs font-bold text-sky-400 uppercase">
                        {d.degreeCode}
                      </span>
                      <span className="text-sm text-white">{d.degreeName}</span>
                      {selectedId === d._id && (
                        <Check
                          size={13}
                          className="ml-auto shrink-0 text-sky-400"
                        />
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {d.faculty} . {d.department} . {d.degreeType}
                    </p>
                  </button>
                ))
              )}
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DegreeSearchPicker;
