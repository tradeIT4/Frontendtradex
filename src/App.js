import React, { useEffect, useMemo, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./styles/layout.css";

import HomePage from "./pages/HomePage";
import ArticlePage from "./pages/ArticlePage";
import CompanyPostPage from "./pages/CompanyPostPage";
import VideoPage from "./pages/VideoPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

export default function App() {
  const [theme, setTheme] = useState(
    document.documentElement.getAttribute("data-theme") ||
      localStorage.getItem("tradex_theme") ||
      "dark"
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
      <Route path="/" element={<HomePage themeApi={themeApi} />} />
      <Route path="/article/:id" element={<ArticlePage />} />
      <Route path="/company/:id" element={<CompanyPostPage />} />
      <Route path="/video/:id" element={<VideoPage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
