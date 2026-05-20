export const GRADES = [
  "A+",
  "A",
  "A-",
  "B+",
  "B",
  "B-",
  "C+",
  "C",
  "C-",
  "D",
  "E",
];

export const GPV_MAP = {
  "A+": 4.0,
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  D: 1.3,
  E: 1.0,
};

export const gradeColor = (grade) => {
  if (!grade) return "text-gray-500";
  const gpv = GPV_MAP[grade] ?? 0;
  if (gpv >= 3.7) return "text-emerald-400";
  if (gpv >= 3.0) return "text-sky-400";
  if (gpv >= 2.0) return "text-yellow-400";
  return "text-red-400";
};
