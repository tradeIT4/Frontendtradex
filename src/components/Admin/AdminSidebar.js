import React from "react";
import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <aside className="adminSidebar">
      <h2>TradeX</h2>

      <nav>
        <NavLink to="/admin" end>
          Dashboard
        </NavLink>

        <NavLink to="/admin/articles">
          Articles
        </NavLink>

        <NavLink to="/admin/company">
          Company Updates
        </NavLink>

        <NavLink to="/admin/videos">
          Videos
        </NavLink>

        <NavLink to="/admin/subscribers">
          Subscribers
        </NavLink>

        <NavLink to="/admin/users">
          Admin Users
        </NavLink>
      </nav>
    </aside>
  );
}
