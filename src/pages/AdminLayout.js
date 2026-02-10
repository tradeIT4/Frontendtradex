import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/Admin/AdminSidebar";
import AdminTopBar from "../components/Admin/AdminTopBar";
import "../styles/admin.css";

export default function AdminLayout() {
  const [theme, setTheme] = useState(
    localStorage.getItem("admin_theme") || "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("admin_theme", theme);
  }, [theme]);

  return (
    <div className="adminPage">
      <div className="adminLayout">
        <AdminSidebar />

        <main className="adminMain">
          <AdminTopBar theme={theme} setTheme={setTheme} />

          {/* 🔥 REQUIRED: nested admin routes render here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
