import React, { useEffect, useMemo, useState } from "react";
import {
  apiAdminDelete,
  apiAdminGet,
  apiAdminPut,
} from "../../services/api";
import { apiGet } from "../services/api";
import "../../styles/adminContent.css";

const TABS = [
  { key: "news", label: "News" },
  { key: "company-posts", label: "Company Posts" },
  { key: "videos", label: "Videos" },
];

export default function AdminDashboard() {
  /* ================= DASHBOARD STATS ================= */
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  /* ================= CONTENT STATE ================= */
  const [tab, setTab] = useState("news");
  const [items, setItems] = useState([]);
  const [contentLoading, setContentLoading] = useState(false);

  const endpoint = useMemo(
    () => `/api/admin/content/${tab}`,
    [tab]
  );

  /* ================= LOAD DASHBOARD STATS ================= */
  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await apiGet("/api/admin/dashboard/stats");
        setStats(data);
      } catch (err) {
        console.error(err.message);
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
  }, []);

  /* ================= LOAD CONTENT ================= */
  const loadContent = async () => {
    setContentLoading(true);
    try {
      const data = await apiAdminGet(endpoint);
      setItems(Array.isArray(data) ? data : []);
    } catch {
      alert("Failed to load content");
    } finally {
      setContentLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, [tab]);

  /* ================= ACTIONS ================= */

  const approvePost = async (id) => {
    await apiAdminPut(
      `/api/admin/content/company-posts/${id}/approve`
    );
    loadContent();
  };

  const rejectPost = async (id) => {
    await apiAdminPut(
      `/api/admin/content/company-posts/${id}/reject`,
      { adminNote: "Rejected by admin" }
    );
    loadContent();
  };

  const deleteItem = async (id) => {
    await apiAdminDelete(`${endpoint}/${id}`);
    loadContent();
  };

  /* ================= RENDER ================= */

  return (
    <div className="cmsPage">
      <h1>Admin Dashboard</h1>

      {/* ================= STATS SECTION ================= */}
      {statsLoading ? (
        <p>Loading dashboard...</p>
      ) : stats && (
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
      )}

      {/* ================= CONTENT TABS ================= */}
      <div className="cmsTabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={tab === t.key ? "active" : ""}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ================= CONTENT TABLE ================= */}
      {contentLoading ? (
        <p>Loading content...</p>
      ) : (
        <table className="cmsTable">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Author</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td>{item.title}</td>

                <td>
                  {item.status === "approved" && (
                    <span className="badge approved">Approved</span>
                  )}
                  {item.status === "pending" && (
                    <span className="badge pending">Pending</span>
                  )}
                  {item.status === "rejected" && (
                    <span className="badge rejected">Rejected</span>
                  )}
                </td>

                <td>
                  {item.isSubscriberPost ? "Subscriber" : "Admin"}
                </td>

                <td>
                  {tab === "company-posts" &&
                    item.isSubscriberPost &&
                    item.status === "pending" && (
                      <>
                        <button
                          onClick={() => approvePost(item._id)}
                          className="btnApprove"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => rejectPost(item._id)}
                          className="btnReject"
                        >
                          Reject
                        </button>
                      </>
                    )}

                  <button
                    onClick={() => deleteItem(item._id)}
                    className="btnDelete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
