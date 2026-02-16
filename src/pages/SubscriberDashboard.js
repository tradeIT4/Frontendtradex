import React, { useEffect, useMemo, useState } from "react";
import { apiSubscriberGet, apiSubscriberPost } from "../services/subscriberApi";
import { readAuth, logout } from "../services/auth";
import { useNavigate } from "react-router-dom";
import "../styles/subscriberDashboard.css";

const CATS = ["Company Update", "Announcement", "Press Release"];

const LANGS = [
  { code: "en", label: "English" },
  { code: "am", label: "Amharic" },
];

const emptyForm = {
  title: "",
  category: CATS[0],
  description: "",
  image: "",
  content: "",
  language: "en",
};

export default function SubscriberDashboard() {
  const navigate = useNavigate();
  const auth = readAuth();

  const [meName] = useState(auth?.fullname || "Subscriber");

  const [form, setForm] = useState(emptyForm);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  /* ================= AUTH CHECK ================= */
  useEffect(() => {
    if (!auth?.token) {
      navigate("/subscriber/login", { replace: true });
      return;
    }
    loadPosts();
    // eslint-disable-next-line
  }, []);

  /* ================= STATUS COUNTS ================= */
  const counts = useMemo(() => {
    const c = { pending: 0, approved: 0, rejected: 0 };

    items.forEach((item) => {
      if (item.status === "pending") c.pending++;
      if (item.status === "approved") c.approved++;
      if (item.status === "rejected") c.rejected++;
    });

    return c;
  }, [items]);

  /* ================= LOAD POSTS ================= */
  const loadPosts = async () => {
    setLoading(true);
    setMessage("");

    try {
      const data = await apiSubscriberGet(
        "/api/subscriber/company-posts/mine"
      );
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setMessage(err.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FORM CHANGE ================= */
  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /* ================= SUBMIT ================= */
  const submitPost = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.title.trim() || !form.content.trim()) {
      setMessage("Title and content are required.");
      return;
    }

    setSaving(true);

    try {
      await apiSubscriberPost("/api/subscriber/company-posts", {
        ...form,
        author: meName,
        date: new Date().toLocaleDateString(),
      });

      setMessage("✅ Submitted! Awaiting admin approval.");
      setForm(emptyForm);
      loadPosts();
    } catch (err) {
      setMessage(err.message || "Submission failed");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/subscriber/login", { replace: true });
  };

  return (
    <div className="subDash">
      {/* HEADER */}
      <header className="subHeader">
        <div className="subBrand">
          <div className="subLogo">TX</div>
          <div>
            <h1>Subscriber Dashboard</h1>
            <p>Submit company updates for publishing.</p>
          </div>
        </div>

        <div className="subHeaderRight">
          <div className="subWelcome">
            Welcome, <b>{meName}</b>
          </div>
          <button className="subLogout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* STATS */}
      <section className="subStats">
        <StatCard label="Pending" value={counts.pending} />
        <StatCard label="Approved" value={counts.approved} />
        <StatCard label="Rejected" value={counts.rejected} />
      </section>

      {/* MAIN */}
      <main className="subGrid">
        {/* CREATE POST */}
        <section className="subCard">
          <h2>Create Company Post</h2>

          {message && <div className="subMsg">{message}</div>}

          <form onSubmit={submitPost} className="subForm">
            <input
              placeholder="Title *"
              value={form.title}
              onChange={(e) => onChange("title", e.target.value)}
              required
            />

            <select
              value={form.category}
              onChange={(e) => onChange("category", e.target.value)}
            >
              {CATS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <select
              value={form.language}
              onChange={(e) => onChange("language", e.target.value)}
            >
              {LANGS.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>

            <input
              placeholder="Image URL"
              value={form.image}
              onChange={(e) => onChange("image", e.target.value)}
            />

            <textarea
              rows={6}
              placeholder="Full Content *"
              value={form.content}
              onChange={(e) => onChange("content", e.target.value)}
              required
            />

            <button disabled={saving}>
              {saving ? "Submitting..." : "Submit"}
            </button>
          </form>
        </section>

        {/* POSTS LIST */}
        <section className="subCard">
          <h2>My Posts</h2>

          {loading ? (
            <p>Loading...</p>
          ) : items.length === 0 ? (
            <p>No posts yet.</p>
          ) : (
            items.map((post) => (
              <div key={post._id} className="subPost">
                <div className="subPostTop">
                  <strong>{post.title}</strong>
                  <StatusBadge status={post.status} />
                </div>

                <small>
                  {post.category} · {post.language}
                </small>

                <div className="subAdminNote">
                  {post.adminNote ||
                    (post.status === "pending"
                      ? "Waiting for review..."
                      : post.status === "approved"
                      ? "Approved and published."
                      : "Rejected. Please revise.")}
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({ label, value }) {
  return (
    <div className="statCard">
      <div>{label}</div>
      <strong>{value}</strong>
    </div>
  );
}

function StatusBadge({ status }) {
  const text =
    status === "approved"
      ? "Approved"
      : status === "rejected"
      ? "Rejected"
      : "Pending";

  return <span className={`badge ${status}`}>{text}</span>;
}
