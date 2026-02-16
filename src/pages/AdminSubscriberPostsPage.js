import React, { useEffect, useMemo, useState } from "react";
import { apiAdminGet, apiAdminPut } from "../services/api";
import "../styles/adminSubscriberPosts.css";

export default function AdminSubscriberPostsPage() {
  const [status, setStatus] = useState("pending");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const endpoint = useMemo(
    () => `/api/admin/company-posts-approval?status=${status}`,
    [status]
  );

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiAdminGet(endpoint);
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      alert(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [status]);

  // ESC key close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setSelectedPost(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Prevent background scroll when modal open
  useEffect(() => {
    document.body.style.overflow = selectedPost ? "hidden" : "auto";
  }, [selectedPost]);

  const updateStatus = async (id, next) => {
    const adminNote =
      next === "rejected"
        ? window.prompt("Reason / note for rejection (optional):", "") || ""
        : "";

    try {
      await apiAdminPut(`/api/admin/company-posts-approval/${id}/status`, {
        status: next,
        adminNote,
      });
      setSelectedPost(null);
      load();
    } catch (e) {
      alert(e.message || "Update failed");
    }
  };

  return (
    <div className="aspPage">
      <div className="aspHeader">
        <h1>Subscriber Posts Approval</h1>
        <p>Approve / reject subscriber company posts.</p>
      </div>

      <div className="aspFilters">
        <button
          className={status === "pending" ? "active" : ""}
          onClick={() => setStatus("pending")}
        >
          Pending
        </button>
        <button
          className={status === "approved" ? "active" : ""}
          onClick={() => setStatus("approved")}
        >
          Approved
        </button>
        <button
          className={status === "rejected" ? "active" : ""}
          onClick={() => setStatus("rejected")}
        >
          Rejected
        </button>
      </div>

      {loading ? (
        <div className="aspLoading">Loading…</div>
      ) : items.length === 0 ? (
        <div className="aspEmpty">No posts.</div>
      ) : (
        <div className="aspList">
          {items.map((p) => (
            <div className="aspCard" key={p._id}>
              <div className="aspTop">
                <div>
                  <div className="aspTitle">{p.title}</div>
                  <div className="aspMeta">
                    {p.category} · {p.language} ·{" "}
                    {new Date(p.createdAt).toLocaleString()}
                  </div>
                </div>
                <span className={`aspBadge ${p.status}`}>
                  {p.status}
                </span>
              </div>

              {p.description && (
                <div className="aspDesc">{p.description}</div>
              )}

              {p.image && (
                <div className="aspThumb">
                  <img
                    src={p.image}
                    alt=""
                    onError={(e) =>
                      (e.currentTarget.style.display = "none")
                    }
                  />
                </div>
              )}

              <div className="aspActions">
                <button
                  className="view"
                  onClick={() => setSelectedPost(p)}
                >
                  View Full Post
                </button>

                <button
                  className="ok"
                  onClick={() => updateStatus(p._id, "approved")}
                >
                  Approve
                </button>

                <button
                  className="bad"
                  onClick={() => updateStatus(p._id, "rejected")}
                >
                  Reject
                </button>

                <button
                  className="wait"
                  onClick={() => updateStatus(p._id, "pending")}
                >
                  Back to Pending
                </button>
              </div>

              {p.adminNote && (
                <div className="aspNote">
                  <b>Admin note:</b> {p.adminNote}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ================= MODAL ================= */}
      {selectedPost && (
        <div
          className="aspModalOverlay"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="aspModal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="aspClose"
              onClick={() => setSelectedPost(null)}
            >
              ×
            </button>

            <h2>{selectedPost.title}</h2>

            <div className="aspModalMeta">
              {selectedPost.category} · {selectedPost.language} ·{" "}
              {new Date(selectedPost.createdAt).toLocaleString()}
            </div>

            {selectedPost.image && (
              <div className="aspModalImage">
                <img src={selectedPost.image} alt="" />
              </div>
            )}

            {selectedPost.description && (
              <div className="aspModalDesc">
                {selectedPost.description}
              </div>
            )}

            {selectedPost.content && (
              <div className="aspModalContent">
                {selectedPost.content}
              </div>
            )}

            <div className="aspModalActions">
              <button
                className="ok"
                onClick={() =>
                  updateStatus(selectedPost._id, "approved")
                }
              >
                Approve
              </button>

              <button
                className="bad"
                onClick={() =>
                  updateStatus(selectedPost._id, "rejected")
                }
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
