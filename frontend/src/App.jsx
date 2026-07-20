import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

import { useAuthStore } from "./stores/useAuthStore";

import LandingPage from "./pages/LandingPage";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import Footer from "./components/layout/Footer";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import StudentDashboardPage from "./pages/StudentDashboardPage";

// --- Route Guards --------------------------------------------------------------------
const ProtectedRoute = ({ children }) => {
  const { user, checkingAuth } = useAuthStore();
  if (checkingAuth)
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  if (!user) return <Navigate to="/signin" replace />;
  return children;
};

const RoleRoute = ({ children, role }) => {
  const { user } = useAuthStore();
  if (user?.role !== role) {
    return (
      <Navigate
        to={user?.role === "admin" ? "/admin/dashboard" : "/dashboard"}
        replace
      />
    );
  }
  return children;
};

const GuestRoute = ({ children }) => {
  const { user, checkingAuth } = useAuthStore();
  if (checkingAuth)
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  if (user)
    return (
      <Navigate
        to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}
        replace
      />
    );
  return children;
};

function App() {
  const { getProfile } = useAuthStore();

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  // hide footer
  //const location = useLocation();
  //const hideFooter = ["/signin", "/signup"].includes(location.pathname);

  return (
    <div className="min-h-screen bg-slate-950">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1f2937",
            color: "#f9fafb",
            border: "1px solid #374151",
            borderRadius: "12px",
          },
          success: { iconTheme: { primary: "#38bdf8", secondary: "#1f2937" } },
          error: { iconTheme: { primary: "#f87171", secondary: "#1f2937" } },
        }}
      />
      <Routes>
        {/* public */}
        <Route
          path="/"
          element={
            <GuestRoute>
              <LandingPage />
            </GuestRoute>
          }
        />
        <Route
          path="/signin"
          element={
            <GuestRoute>
              <SignInPage />
            </GuestRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <GuestRoute>
              <SignUpPage />
            </GuestRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute role="admin">
                <AdminDashboardPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* Student */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute role="student">
                <StudentDashboardPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* Fallback} */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/*!hideFooter && <Footer />*/}
    </div>
  );
}

export default App;
