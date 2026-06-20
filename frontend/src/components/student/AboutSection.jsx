import { CodeXml, TrendingUp, TriangleAlert } from "lucide-react";
import StackIcon from "tech-stack-icons";
import React from "react";

const AboutSection = () => {
  const SKILL_TAGS = [
    {
      label: "BSc IT Honours",
      textColor: "text-sky-400/80",
      backColor: "bg-sky-500/20",
    },
    {
      label: "Backend Engineer",
      textColor: "text-violet-400/80",
      backColor: "bg-violet-500/20",
    },
    {
      label: "Full Stack Engineer",
      textColor: "text-emerald-400/80",
      backColor: "bg-emerald-500/20",
    },
    {
      label: "Web Developer",
      textColor: "text-rose-400/80",
      backColor: "bg-rose-500/20",
    },
  ];

  const TECH_STACK = [
    {
      label: "React",
      name: "react",
      color: "bg-sky-400/50",
      borderColor: "border-sky-800",
    },
    {
      label: "Node.js",
      name: "nodejs",
      color: "bg-lime-400/50",
      borderColor: "border-lime-800",
    },
    {
      label: "Express.js",
      name: "expressjs",
      color: "bg-gray-400/50",
      borderColor: "border-gray-800",
    },
    {
      label: "MongoDB",
      name: "mongodb",
      color: "bg-green-400/50",
      borderColor: "border-green-800",
    },
    {
      label: "Tailwind CSS",
      name: "tailwindcss",
      color: "bg-sky-400/50",
      borderColor: "border-sky-800",
    },
    {
      label: "Framer Motion",
      name: "framer",
      color: "bg-violet-400/50",
      borderColor: "border-violet-800",
    },
    {
      label: "JWT Auth",
      name: "",
      color: "bg-orange-400/50",
      borderColor: "border-orange-800/50",
    },
    {
      label: "REST API",
      name: "",
      color: "bg-cyan-400/50",
      borderColor: "border-cyan-800",
    },
  ];

  return (
    <>
      <div className="space-y-6 rounded-2xl bg-gray-700/20 p-4">
        {/* Profile Card */}
        <div className="space-y-2 text-white">
          <p className="text-sm font-semibold text-gray-400">
            DEVELOPER PROFILE
          </p>
          <div className="flex items-center gap-4 rounded-xl border border-gray-700 bg-gray-950/40 p-4">
            {/* Profile Image */}
            <div className="h-32 w-32 overflow-hidden rounded-full">
              <img src="../../assets/sample_prop_image.jpg" alt="prop_pic" />
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-2">
              <p className="text-2xl font-bold">Pubudu Lakshan</p>
              <div>
                {SKILL_TAGS.map(({ label, textColor, backColor }) => (
                  <span
                    key={label}
                    className={`inline-block rounded-md px-2 py-1 text-xs font-semibold ${backColor} ${textColor} mr-2`}
                  >
                    {label}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-400">
                Passionate Web developer, Backend Engineer, Full Stack Engineer
                building practical Software and Web Solutions. This project was
                built to help university students of The Open University of Sri
                Lanka, effortlessly track and calculate their GPA across
                different degree programs.{" "}
              </p>
            </div>
          </div>
        </div>
        {/* TECH STACK CARD */}
        <div className="space-y-2 text-white">
          <p className="text-sm font-semibold text-gray-400">TECH STACK</p>
          <div className="space-y-3 rounded-xl border border-gray-700 bg-gray-950/40 p-4">
            <div className="flex items-center gap-2">
              <CodeXml size={24} className="text-sky-400" />
              <h3 className="text-lg font-semibold">
                Technologies Used in This Project
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {TECH_STACK.map(({ label, name, color, borderColor }) => (
                <div
                  key={name}
                  className="flex items-center gap-4 rounded-lg border border-gray-600 bg-gray-700/50 p-1"
                >
                  <div
                    className={`h-6 w-6 ${color} border-2 ${borderColor} shad ml-1 flex items-center justify-center rounded-full`}
                  >
                    <StackIcon
                      name={name}
                      variant="grayscale"
                      className="p-0.5"
                    />
                  </div>
                  <p className="text-sm font-normal">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* GPA Calculation Explanation Card */}
        <div className="space-y-4 text-white">
          <p className="text-sm font-semibold text-gray-400">GPA CALCULATION</p>
          <div className="space-y-3 rounded-xl border border-gray-700 bg-gray-950/40 p-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={24} className="text-emerald-400" />
              <h3 className="text-lg font-semibold">How GPA is Calculated?</h3>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* General GPA */}
              <div className="space-y-2 rounded-md rounded-t-md border border-t-4 border-gray-700 border-t-sky-500/60 bg-gray-950/40 p-4">
                <h4 className="mb-2 font-semibold">General Degree GPA</h4>
                <p className="mb-4 text-xs text-gray-400">
                  Calculated as a standard credit-weighted average for all
                  completed courses.
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm font-semibold text-gray-400">
                    GPA =
                  </span>
                  <div className="flex flex-col items-center text-xs text-gray-400">
                    <span className="border-b">Σ (GPV × Credits)</span>
                    <span>Total Credits</span>
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  <ul className="list-disc pl-4">
                    <li>
                      <strong>GPA: </strong> Grade Point Average
                    </li>
                    <li>
                      <strong>GPV: </strong> Grade Point Value of a Course
                    </li>
                    <li>
                      <strong>Credits: </strong> Credit Value of a Course
                    </li>
                    <li>
                      <strong>Total Credits: </strong> Sum of the Credit Values
                    </li>
                  </ul>
                </div>
              </div>

              {/* Special GPA */}
              <div className="space-y-2 rounded-md rounded-t-md border border-t-4 border-gray-700 border-t-violet-500/60 bg-gray-950/40 p-4">
                <h4 className="mb-2 font-semibold">
                  Special / Honours Degree GPA
                </h4>
                <p className="mb-4 text-xs text-gray-400">
                  Applies weights based on course levels (Levels 3/4 weighted by
                  2; Levels 5/6 weighted by 3).
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm font-semibold text-gray-400">
                    GPA =
                  </span>
                  <div className="flex flex-col items-center text-xs text-gray-400">
                    <span className="border-b">Σ (GPV × Credits × Weight)</span>
                    <span>Σ (Credits × Weight)</span>
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  <ul className="list-disc pl-4">
                    <li>
                      <strong>GPA: </strong> Grade Point Average
                    </li>
                    <li>
                      <strong>GPV: </strong> Grade Point Value of a Course
                    </li>
                    <li>
                      <strong>Credits: </strong> Credit Value of a Course
                    </li>
                    <li>
                      <strong>Weight: </strong> Weight of a Course
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="flex items-center justify-center gap-4 rounded-md border border-yellow-400/30 bg-yellow-400/10 px-4 py-2">
                <TriangleAlert size={16} className="text-yellow-400" />
                <p className="text-xs text-yellow-400">
                  Courses with no recorded grade are excluded from the
                  calculations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutSection;
