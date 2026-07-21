import { CodeXml, TrendingUp, TriangleAlert, Wrench } from "lucide-react";
import StackIcon from "tech-stack-icons";
import React from "react";
import { motion as Motion } from "framer-motion";

const AboutSection = () => {
  const SKILL_TAGS = [
    {
      label: "BSc IT Honours",
      textColor: "text-blue-400/80",
      backColor: "bg-blue-500/20",
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
      textColor: "text-amber-400/80",
      backColor: "bg-amber-500/20",
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
      name: "stackLogo_01",
      color: "bg-orange-400/50",
      borderColor: "border-orange-800/50",
    },
    {
      label: "REST API",
      name: "stackLogo_02",
      color: "bg-cyan-400/50",
      borderColor: "border-cyan-800",
    },
  ];

  return (
    <>
      <div className="space-y-6">
        {/* Profile Card */}
        <div className="space-y-2 text-white">
          <p className="text-sm font-semibold tracking-wider text-gray-400 uppercase">
            developer profile
          </p>
          <Motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-700 bg-slate-900 p-6 md:flex-row">
              {/* Profile Image */}
              <div className="h-32 w-32 overflow-hidden rounded-full border-2 border-white">
                <img
                  src="/pp2.png"
                  alt="Pubudu Lakshan - Developer"
                  className="h-full w-full object-cover"
                />
              </div>
              {/* Profile Info */}
              <div className="flex flex-col space-y-2 text-center md:flex-1 md:text-left">
                <p className="text-2xl font-bold">Pubudu Lakshan</p>
                <div className="grid grid-cols-2 gap-1 text-center md:grid-cols-2 lg:grid-cols-4">
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
                  Passionate Web developer, Backend Engineer, Full Stack
                  Engineer building practical Software and Web Solutions. This
                  project was built to help university students of The Open
                  University of Sri Lanka, effortlessly track and calculate
                  their GPA across different degree programs.{" "}
                </p>
              </div>
            </div>
          </Motion.div>
        </div>
        {/* TECH STACK CARD */}
        <div className="space-y-2 text-white">
          <p className="text-sm font-semibold tracking-wider text-gray-400 uppercase">
            tech stack
          </p>
          <Motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="space-y-3 rounded-2xl border border-slate-700 bg-slate-900 p-6">
              <div className="flex items-center gap-2">
                <CodeXml size={24} className="text-blue-400" />
                <h3 className="text-lg font-semibold">
                  Technologies Used in This Project
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {TECH_STACK.map(({ label, name, color, borderColor }) => (
                  <div
                    key={name}
                    className="flex items-center gap-4 rounded-xl border border-slate-700 bg-slate-800/50 p-2"
                  >
                    <div
                      className={`h-6 w-6 ${color} border-2 ${borderColor} ml-1 flex items-center justify-center rounded-full`}
                    >
                      {name.startsWith("stackLogo") ? (
                        <Wrench size={14} />
                      ) : (
                        <StackIcon
                          name={name}
                          variant="grayscale"
                          className="p-0.5"
                        />
                      )}
                    </div>
                    <p className="text-sm font-normal text-gray-400">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Motion.div>
        </div>
        {/* GPA Calculation Explanation Card */}
        <div className="space-y-2 text-white">
          <p className="text-sm font-semibold tracking-wider text-gray-400 uppercase">
            gpa calculation
          </p>
          <Motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="space-y-3 rounded-2xl border border-slate-700 bg-slate-900 p-6">
              <div className="flex items-center gap-2">
                <TrendingUp size={24} className="text-emerald-400" />
                <h3 className="text-lg font-semibold">
                  How GPA is Calculated?
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* General GPA */}
                <div className="space-y-2 rounded-md rounded-t-md border border-t-4 border-slate-700 border-t-blue-500 bg-slate-800/30 p-4">
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
                        <strong>Total Credits: </strong> Sum of the Credit
                        Values
                      </li>
                    </ul>
                  </div>
                </div>
                {/* Special GPA */}
                <div className="space-y-2 rounded-md rounded-t-md border border-t-4 border-slate-700 border-t-violet-500 bg-slate-800/30 p-4">
                  <h4 className="mb-2 font-semibold">
                    Special / Honours Degree GPA
                  </h4>
                  <p className="mb-4 text-xs text-gray-400">
                    Applies weights based on course levels (Levels 3/4 weighted
                    by 2; Levels 5/6 weighted by 3).
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm font-semibold text-gray-400">
                      GPA =
                    </span>
                    <div className="flex flex-col items-center text-xs text-gray-400">
                      <span className="border-b">
                        Σ (GPV × Credits × Weight)
                      </span>
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
                <div className="flex items-center justify-center gap-4 rounded-md border border-yellow-500/20 bg-yellow-500/10 p-3">
                  <TriangleAlert size={16} className="text-yellow-400" />
                  <p className="text-xs text-yellow-300">
                    Courses with no recorded grade are excluded from the
                    calculations.
                  </p>
                </div>
              </div>
            </div>
          </Motion.div>
        </div>
      </div>
    </>
  );
};

export default AboutSection;
