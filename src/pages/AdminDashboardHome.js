import React, { useEffect, useState } from "react";
import { apiGet } from "../services/api";

export default function AdminDashboardHome() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    apiGet("/api/admin/dashboard/stats")
      .then(setStats)
      .catch(console.error);
  }, []);

  if (!stats) return <p>Loading dashboard…</p>;

  return (
    <section className="adminStats">
      <div className="statCard">
        <h4>Total Subscribers</h4>
        <strong>{stats.total}</strong>
      </div>

      <div className="statCard pending">
        <h4>Pending</h4>
        <strong>{stats.pending}</strong>
      </div>

      <div className="statCard approved">
        <h4>Approved</h4>
        <strong>{stats.approved}</strong>
      </div>

      <div className="statCard rejected">
        <h4>Rejected</h4>
        <strong>{stats.rejected}</strong>
      </div>
    </section>
  );
}
