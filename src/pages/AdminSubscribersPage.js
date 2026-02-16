import React, { useEffect, useState } from "react";
import { apiGet, apiPut } from "../services/api";

export default function AdminSubscribersPage() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiGet("/api/admin/subscribers");

      // ✅ FIX: Ensure we extract the array properly
      if (response?.success && Array.isArray(response.data)) {
        setSubs(response.data);
      } else {
        setSubs([]);
      }
    } catch (err) {
      console.error("Failed to fetch subscribers:", err);
      setError("Failed to load subscribers");
      setSubs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await apiPut(`/api/admin/subscribers/${id}/status`, { status });
      await load(); // refresh after update
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update subscriber status");
    }
  };

  if (loading) return <p>Loading subscribers…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <section className="adminTable">
      <h2>Subscribers</h2>

      <table>
        <thead>
          <tr>
            <th>Company</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {subs.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No subscribers found
              </td>
            </tr>
          ) : (
            subs.map((s) => (
              <tr key={s._id}>
                <td>{s.company}</td>
                <td>{s.fullname}</td>
                <td>{s.email}</td>
                <td>{s.phone}</td>
                <td>
                  <strong>{s.status}</strong>
                </td>
                <td style={{ display: "flex", gap: 8 }}>
                  {s.status !== "approved" && (
                    <button
                      className="adminApproveBtn"
                      onClick={() => updateStatus(s._id, "approved")}
                    >
                      Approve
                    </button>
                  )}

                  {s.status !== "rejected" && (
                    <button
                      className="adminRejectBtn"
                      onClick={() => updateStatus(s._id, "rejected")}
                    >
                      Reject
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}
