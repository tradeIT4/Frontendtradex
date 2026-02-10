import React, { useEffect, useState } from "react";
import { apiGet, apiPut } from "../services/api";

export default function AdminSubscribersPage() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await apiGet("/api/admin/subscribers");
      setSubs(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    await apiPut(`/api/admin/subscribers/${id}/status`, { status });
    await load();
  };

  if (loading) return <p>Loading subscribers…</p>;

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
          {subs.map((s) => (
            <tr key={s._id}>
              <td>{s.company}</td>
              <td>{s.fullname}</td>
              <td>{s.email}</td>
              <td>{s.phone}</td>
              <td><strong>{s.status}</strong></td>
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
          ))}
        </tbody>
      </table>
    </section>
  );
}
