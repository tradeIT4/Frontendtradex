import React, { useEffect, useMemo, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./styles/layout.css";

/* ================= PUBLIC ================= */
import HomePage from "./pages/HomePage";
import ArticlePage from "./pages/ArticlePage";
import CompanyPostPage from "./pages/CompanyPostPage";
import VideoPage from "./pages/VideoPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import SubscribePage from "./pages/SubscribePage";
import ProgramsTVPage from "./pages/ProgramsTVPage";
import VideoPlayerPage from "./pages/VideoPlayerPage";
import LiveTVPage from "./pages/LiveTVPage";
import AboutPage from "./pages/AboutPage";

/* ================= SUBSCRIBER ================= */
import SubscriberLoginPage from "./pages/SubscriberLoginPage";
import SubscriberPendingPage from "./pages/SubscriberPendingPage";
import SubscriberDashboard from "./pages/SubscriberDashboard";
import SubscriberRoute from "./components/SubscriberRoute";

/* ================= ADMIN ================= */
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminLayout from "./pages/AdminLayout";
import AdminDashboardHome from "./pages/AdminDashboardHome";
import AdminSubscribersPage from "./pages/AdminSubscribersPage";
import AdminSubscriberPostsPage from "./pages/AdminSubscriberPostsPage";
import AdminContentPage from "./components/Admin/AdminContentPage";
import AdminRoute from "./components/Admin/AdminRoute";

export default function App() {
  /* ================= THEME ================= */
  const [theme, setTheme] = useState(
    document.documentElement.getAttribute("data-theme") ||
      localStorage.getItem("tradex_theme") ||
      "light" // ✅ default is now light
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("tradex_theme", theme);
  }, [theme]);

  const themeApi = useMemo(
    () => ({
      theme,
      toggleTheme: () =>
        setTheme((t) => (t === "dark" ? "light" : "dark")),
    }),
    [theme]
  );

  return (
    <Routes>
      {/* ================= PUBLIC ================= */}
      <Route path="/" element={<HomePage themeApi={themeApi} />} />
      <Route path="/category/:category" element={<HomePage themeApi={themeApi} />} />
      <Route path="/article/:id" element={<ArticlePage />} />
      <Route path="/company/:id" element={<CompanyPostPage />} />
      <Route path="/company-post/:id" element={<CompanyPostPage />} />
      <Route path="/video/:id" element={<VideoPage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/subscribe" element={<SubscribePage />} />
      <Route path="/programs-tv" element={<ProgramsTVPage />} />
      <Route path="/programs-tv/watch/:id" element={<VideoPlayerPage />} />
      <Route path="/live" element={<LiveTVPage />} />
      <Route path="/about" element={<AboutPage />} />

      {/* ================= SUBSCRIBER ================= */}
      <Route path="/subscriber/login" element={<SubscriberLoginPage />} />
      <Route path="/subscriber/pending" element={<SubscriberPendingPage />} />

      <Route
        path="/subscriber/dashboard"
        element={
          <SubscriberRoute>
            <SubscriberDashboard />
          </SubscriberRoute>
        }
      />

      {/* ================= ADMIN ================= */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout themeApi={themeApi} />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboardHome />} />
        <Route path="subscribers" element={<AdminSubscribersPage />} />
        <Route path="subscriber-posts" element={<AdminSubscriberPostsPage />} />
        <Route path="content" element={<AdminContentPage />} />
      </Route>

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
