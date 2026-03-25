import { motion as Motion } from "framer-motion";
import {
  GraduationCap,
  TrendingUp,
  BookOpen,
  Shield,
  ChevronRight,
  Star,
  Users,
  BarChart3,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

import NavBar from "../components/layout/NavBar";
import { Button } from "../components/ui/Button";
import Footer from "../components/layout/Footer";

const STATS = [
  { icon: Users, value: "100%", label: "Degree Coverage" },
  { icon: BarChart3, value: "Real-time", label: "GPA Calculation" },
  { icon: Star, value: "Free", label: "Always" },
];

const FEATURES = [
  {
    icon: TrendingUp,
    color: "from-sky-500 to-blue-600",
    glow: "bg-sky-500/10 border-sky-500/20",
    title: "Real-Time GPA Tracking",
    desc: "Instantly see your GPA recalculate as you assign grades. Visual feedback keeps you motivated and on track.",
  },
  {
    icon: BookOpen,
    color: "from-violet-500 to-purple-600",
    glow: "bg-violet-500/10 border-violet-500/20",
    title: "Smart Course Management",
    desc: "Browse all courses available for your enrolled degree, filter by level, semester, or credit value, and build your academic plan.",
  },
  {
    icon: Shield,
    color: "from-emerald-500 to-teal-600",
    glow: "bg-emerald-500/10 border-emerald-500/20",
    title: "Role-Based Access",
    desc: "Admins manage degrees & courses. Students manage their own study plan. Secure, separate experiences for each role.",
  },
];

const STEPS = [
  {
    no: "01",
    title: "Sign Up & Select Your Degree",
    desc: "Create an account in seconds, then choose the degree programme you're enrolled in.",
  },
  {
    no: "02",
    title: "Browse & Add Courses",
    desc: "Explore courses tailored to your degree. Add the ones you're taking this semester to your plan.",
  },
  {
    no: "03",
    title: "Assign Grades & Watch Your GPA",
    desc: "Enter your expected or received grades for each course. Your GPA updates immediately.",
  },
];

const fadeup = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const LandingPage = () => {
  return (
    <div className="min-h-screen overflow-x-hidden text-white">
      {/* --- Navbar ---*/}
      <header className="fixed top-0 right-0 left-0 z-50 border-b border-gray-800/60 bg-gray-950/50 backdrop-blur-md">
        <NavBar />
      </header>

      {/* --- Hero --- */}
      <section className="relative overflow-hidden px-6 pt-32 pb-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/4 left-1/2 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-sky-600/10 blur-3xl" />
          <div className="absolute top-1/3 left-1/4 h-[300px] w-[300px] rounded-full bg-violet-600/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <Motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-500/25 bg-sky-500/10 px-3.5 py-1.5 text-xs font-medium text-sky-400"
          >
            <Star size={12} />
            Student GPA & Course Tracker
          </Motion.div>

          <Motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 text-5xl leading-tight font-extrabold tracking-tight md:text-6xl"
          >
            Track Your{" "}
            <span className="bg-gradient-to-r from-sky-400 to-violet-500 bg-clip-text text-transparent">
              Academic Progress
            </span>{" "}
            Effortlessly
          </Motion.h1>

          <Motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-400"
          >
            Select your degree, add your courses, assign grades and watch your
            GPA calculate in real time. Built for students in the{" "}
            <span className="inline-flex font-bold">
              Open University of Sri Lanka
            </span>{" "}
            who want clarity on their academic standing.
          </Motion.p>

          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col justify-center gap-4 sm:flex-row"
          >
            <Link to={"/signup"} className="w-full sm:w-auto">
              <Button
                variant="primary"
                className="group inline-flex w-full items-center justify-center gap-2 px-7 py-3.5 shadow-lg shadow-sky-500/20"
              >
                Start Tracking Free
                <ArrowRight
                  size={18}
                  className="text-white transition-transform group-hover:translate-x-1"
                />
              </Button>
            </Link>
            <Link to={"/signin"} className="w-full sm:w-auto">
              <Button
                variant="secondary"
                className="group inline-flex w-full items-center justify-center gap-2 px-7 py-3.5 shadow-lg shadow-gray-600/20"
              >
                Sign In
                <ChevronRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Button>
            </Link>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 flex flex-col items-center justify-center gap-8 sm:flex-row"
          >
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-3 text-left">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-700 bg-gray-800">
                  <Icon size={18} className="text-sky-400" />
                </div>
                <div>
                  <p className="text-lg leading-none font-bold text-white">
                    {value}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">{label}</p>
                </div>
              </div>
            ))}
          </Motion.div>
        </div>
      </section>

      {/* --- Features --- */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <Motion.div {...fadeup} className="mb-14 text-center">
            <p className="mb-3 text-sm font-semibold tracking-widest text-sky-400 uppercase">
              FEATURES
            </p>
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Everything you need to succeed
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-gray-400">
              One platform for tracking courses, grades and your overall
              academic performance
            </p>
          </Motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {FEATURES.map((f, i) => (
              <Motion.div
                key={f.title}
                {...fadeup}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`border ${f.glow} group rounded-2xl bg-gray-900 p-6 transition-all hover:bg-gray-900/60`}
              >
                <div
                  className={`bg-gradient-to-br ${f.color} mb-4 flex h-12 w-12 items-center justify-center rounded-xl shadow-lg`}
                >
                  <f.icon size={22} className="text-white" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">{f.title}</h3>
                <p className="text-sm leading-relaxed text-gray-400">
                  {f.desc}
                </p>
              </Motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- How it Works --- */}
      <section className="bg-gray-900/40 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <Motion.div {...fadeup} className="mb-14 text-center">
            <p className="mb-3 font-medium tracking-widest text-violet-400">
              HOW IT WORKS
            </p>
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Up and running in 3 steps
            </h2>
          </Motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <Motion.div
                key={s.no}
                {...fadeup}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative"
              >
                <p className="mb-3 text-6xl font-black text-gray-800 select-none">
                  {s.no}
                </p>
                <h3 className="mb-2 text-lg font-bold text-white">{s.title}</h3>
                <p className="text-sm leading-relaxed text-gray-400">
                  {s.desc}
                </p>
              </Motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA Banner --- */}
      <section className="px-6 py-24">
        <Motion.div
          {...fadeup}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl rounded-3xl border border-sky-900 bg-gradient-to-br from-sky-600/20 to-violet-600/20 py-12 text-center"
        >
          <GraduationCap className="mx-auto mb-3 h-16 w-16 text-sky-400" />
          <h3 className="mb-3 text-3xl font-bold text-white">
            Ready to take control of your GPA?
          </h3>
          <p className="mb-8 text-gray-400">
            Join students who use OPEN GPA to stay ahead of their academic
            goals.
          </p>

          <div className="mx-8 flex flex-col justify-center gap-4 md:flex-row">
            <Link to={"/signin"} className="w-full sm:w-auto">
              <Button
                variant="primary"
                className="group inline-flex w-full items-center justify-center gap-2 py-4"
              >
                Create Free Account
                <ArrowRight
                  size={16}
                  className="text-white transition-transform group-hover:translate-x-1"
                />
              </Button>
            </Link>
            <Link to={"/signup"} className="w-full sm:w-auto">
              <Button variant="outline" className="w-full py-4">
                Already have an account? Sign In
              </Button>
            </Link>
          </div>
        </Motion.div>
      </section>
      <Footer />
    </div>
  );
};

export default LandingPage;
