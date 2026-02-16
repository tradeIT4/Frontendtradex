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

        <NavLink to="/admin/subscribers">
          Subscribers
        </NavLink>

        <NavLink to="/admin/content">
          Content Manager
        </NavLink>
        <NavLink to="/admin/subscriber-posts" className="adminLink highlight">
          Subscriber Posts Approval
        </NavLink>
      </nav>
    </aside>
  );
}