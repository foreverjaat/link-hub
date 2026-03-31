import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PublicProfile from "./pages/PublicProfile";
import ProfileSetup from "./pages/ProfileSetup";
import Profile from "./pages/Profile";

import { useLocation } from "react-router-dom";

export default function App() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="spinner-wrap" style={{ minHeight: "100vh" }}>
        <div className="spinner" />
      </div>
    );
  }

  // 👇 Check if it's public profile page
  const isPublicPage = location.pathname.startsWith("/u/");

  return (
    <>
      {/* 👇 Hide Navbar on public page */}
      {!isPublicPage && <Navbar />}

      <Routes>
        <Route path="/" element={<Landing />} />

        {/* PUBLIC ROUTE */}
        <Route path="/u/:username" element={<PublicProfile />} />

        {/* AUTH ROUTES */}
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" replace /> : <Register />}
        />

        {/* PROTECTED ROUTES */}
        <Route
          path="/profile-setup"
          element={
            <ProtectedRoute>
              <ProfileSetup />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <div
              style={{
                minHeight: "60vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                textAlign: "center",
                padding: 24,
              }}
            >
              <div style={{ fontSize: 64 }}>🤔</div>
              <h2>Page not found</h2>
              <a href="/" className="btn btn-primary">
                Go home
              </a>
            </div>
          }
        />
      </Routes>
    </>
  );
}
