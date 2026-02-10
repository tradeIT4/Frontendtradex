import React from "react";
import { logout } from "../../services/auth";
import { useNavigate } from "react-router-dom";

export default function AdminTopBar({ theme, setTheme }) {
  const navigate = useNavigate();

  const signOut = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <header className="adminTopBar">
      <span>Admin Dashboard</span>

      <div className="adminTopActions">
        <button
          className="themeToggle"
          onClick={() =>
            setTheme(theme === "dark" ? "light" : "dark")
          }
        >
          {theme === "dark" ? "☀ Light" : "🌙 Dark"}
        </button>

        <button className="adminLogoutBtn" onClick={signOut}>
          Logout
        </button>
      </div>
    </header>
  );
}
