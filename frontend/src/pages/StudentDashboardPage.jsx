import {
  GraduationCap,
  User,
  BookOpen,
  TrendingUp,
  Info,
  ContactRound,
  LogOut,
  AlertTriangle,
  Award,
  BookMarked,
  AlertCircle,
} from "lucide-react";

import { useAuthStore } from "../stores/useAuthStore";
import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import LoadingSpinner from "../components/ui/LoadingSpinner";

import DegreeChangingWarning from "../components/student/DegreeChangingWarning";
import ProfileSection from "../components/student/ProfileSection";
import BrowseCourseSection from "../components/student/BrowseCourseSection";
import MyCoursesSection from "../components/student/MyCoursesSection";
import AboutSection from "../components/student/AboutSection";

const NAV_ITEMS = [
  { id: "profile", label: "My Profile", icon: User },
  { id: "browse", label: "Browse Courses", icon: BookOpen },
  { id: "mycourses", label: "My Courses & GPA", icon: TrendingUp },
  { id: "about", label: "About", icon: Info },
  { id: "contact", label: "Contact", icon: ContactRound },
];

const StudentDashboardPage = () => {
  const { user, logout, getProfile, silentProfileRefresh } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");

  const [selectedCourseIds, setSelectedCourseIds] = useState([]);
  const [prevCourses, setPrevCourses] = useState(null);

  // temporary fix for issue where the gpa details are not refreshed after course grade change.
  /* const [gpaData, setGpaData] = useState({ gpa: 0, totalCredits: 0 });

  const fetchGpaData = useCallback(async () => {
    try {
      const gpaRes = await axiosInstance.get("/student/gpa");
      setGpaData((prevGpaData) => ({
        ...prevGpaData,
        gpa: gpaRes.data.userGPA?.gpa || 0,
        totalCredits: gpaRes.data.userGPA?.totalCredits || 0,
      }));
    } catch {
      setGpaData({ gpa: 0, totalCredits: 0 });
    }
  }, [user]);

  useEffect(() => {
    fetchGpaData();
  }, [fetchGpaData]);

  //==================================================================
  */

  useEffect(() => {
    silentProfileRefresh();
  }, [silentProfileRefresh]);

  const handleNavigation = (id) => {
    setActiveTab(id);
    silentProfileRefresh();
  };

  if (user?.courses !== prevCourses) {
    setPrevCourses(user?.courses);
    const ids = user?.courses?.map((c) => c.course?._id || c.course) || [];
    setSelectedCourseIds(ids);
  }

  const handleCourseAdded = useCallback((courseId) => {
    setSelectedCourseIds((prev) =>
      prev.includes(courseId) ? prev : [...prev, courseId],
    );
  }, []);

  const handleCourseRemoved = useCallback((courseId) => {
    setSelectedCourseIds((prev) => prev.filter((id) => id !== courseId));
  }, []);

  const refreshProfile = useCallback(() => {
    getProfile();
  }, [getProfile]);

  return (
    <div className="flex min-h-screen bg-gray-950">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 flex min-h-screen w-64 flex-col border-r border-gray-700/50 bg-gray-900">
        {/* Brand */}
        <div className="border-b border-gray-700/50 px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-sky-500 to-violet-600">
              <GraduationCap size={20} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">OPEN GPA</p>
              <p className="text-xs text-gray-500">Student Portal</p>
            </div>
          </div>
        </div>

        {/* GPA */}
        {user.gpa != null && (
          <div className="mx-4 mt-4 rounded-xl border border-sky-500/20 bg-linear-to-br from-sky-600/20 to-violet-600/20 px-4 py-3">
            <p className="mb-0.5 text-xs text-gray-400">Your GPA</p>
            <p className="text-2xl font-bold text-white">
              {(user.gpa ?? 0).toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">
              {user.totalCredits ?? 0} credits
            </p>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-3 py-6">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleNavigation(id)}
              className={`transaction-all flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium ${
                activeTab === id
                  ? "bg-sky-500/15 text-sky-400"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="border-t border-gray-700/50 px-4 py-5">
          <div className="mb-3 flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-sky-600 to-violet-600 text-sm font-bold text-white">
              {user?.userName?.[0]?.toUpperCase() || "S"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">
                {user?.userName}
              </p>
              <p className="text-xs text-gray-500">
                {user?.degree?.degreeCode?.toUpperCase() || "N/A"}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-400 transition-all hover:bg-red-400/10 hover:text-red-400"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-64 min-h-screen flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-gray-400">Student Dashboard</p>
          <h1 className="text-2xl font-bold text-white">
            {NAV_ITEMS.find((n) => n.id === activeTab)?.label}
          </h1>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <Motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="max-w-3xl"
          >
            {activeTab === "profile" && (
              <div>
                <ProfileSection user={user} onProfileUpdate={refreshProfile} />
              </div>
            )}
            {activeTab === "browse" && (
              <div>
                <BrowseCourseSection
                  selectedCourseIds={selectedCourseIds}
                  onCourseAdded={handleCourseAdded}
                />
              </div>
            )}
            {activeTab === "mycourses" && (
              <div>
                <MyCoursesSection onCourseRemoved={handleCourseRemoved} />
              </div>
            )}
            {activeTab === "about" && (
              <div>
                <AboutSection />
              </div>
            )}
            {activeTab === "contact" && <div>Contact content</div>}
          </Motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default StudentDashboardPage;
