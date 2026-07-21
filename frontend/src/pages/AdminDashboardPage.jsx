import { BookOpen, GraduationCap, LogOut } from "lucide-react";
import { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";

import Footer from "../components/layout/Footer";
import { useAuthStore } from "../stores/useAuthStore";
import DegreesTab from "../components/admin/DegreesTab";
import CoursesTab from "../components/admin/CoursesTab";

const NAV_ITEMS = [
  { id: "degrees", label: "Degrees", icon: GraduationCap },
  { id: "courses", label: "Courses", icon: BookOpen },
];

const AdminDashboardPage = () => {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState("degrees");

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 flex min-h-screen w-64 flex-col border-r border-slate-700/50 bg-slate-900">
        {/* Brand */}
        <div className="border-b border-gray-700/50 px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600">
              <GraduationCap size={20} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">OPEN GPA</p>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-3 py-6">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                activeTab === id
                  ? "bg-blue-500/15 text-blue-400"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        {/* User + logout */}
        <div className="border-t border-gray-700/50 px-4 py-5">
          <div className="mb-3 flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              {user?.userName?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">
                {user?.userName}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
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

      {/* Main Content */}
      <main className="ml-64 min-h-screen flex-1 p-8 text-white">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-gray-400">Admin Dashboard</p>
          <h1 className="text-2xl font-bold text-white capitalize">
            {activeTab} Management
          </h1>
        </div>

        <AnimatePresence mode="wait">
          <Motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "degrees" && <DegreesTab />}
            {activeTab === "courses" && <CoursesTab />}
          </Motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
