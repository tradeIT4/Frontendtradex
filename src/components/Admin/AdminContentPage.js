import React, { useEffect, useMemo, useState } from "react";
import {
  apiAdminDelete,
  apiAdminGet,
  apiAdminPost,
  apiAdminPut,
} from "../../services/api";
import "../../styles/adminContent.css";

/* ================= TAB CONFIG ================= */
const TABS = [
  { key: "news", label: "News" },
  { key: "company-posts", label: "Company Posts" },
  { key: "videos", label: "Videos" },
];

/* ================= CATEGORY OPTIONS ================= */

const NEWS_CATEGORIES = [
  "Business",
  "Economy",
  "Trade",
  "Market",
  "Technology",
];

const COMPANY_CATEGORIES = [
  "Company Update",
  "Announcement",
  "Press Release",
];

const VIDEO_CATEGORIES = [
  "Videos",
  "Live",
  "Programs",
];

/* ================= EMPTY FORM ================= */

const emptyFormByTab = (tab) => {
  if (tab === "videos") {
    return {
      title: "",
      category: VIDEO_CATEGORIES[0],
      image: "",
      youtubeUrl: "",
      published: true,
    };
  }

  if (tab === "company-posts") {
    return {
      title: "",
      category: COMPANY_CATEGORIES[0],
      description: "",
      image: "",
      author: "TradeX Team",
      date: "",
      content: "",
      published: true,
    };
  }

  return {
    title: "",
    category: NEWS_CATEGORIES[0],
    description: "",
    image: "",
    author: "TradeX Desk",
    date: "",
    content: "",
    published: true,
  };
};

export default function AdminContentPage() {
  const [tab, setTab] = useState("news");
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyFormByTab("news"));
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= CATEGORY BASED ON TAB ================= */
  const categoryOptions = useMemo(() => {
    if (tab === "videos") return VIDEO_CATEGORIES;
    if (tab === "company-posts") return COMPANY_CATEGORIES;
    return NEWS_CATEGORIES;
  }, [tab]);

  /* ================= ENDPOINT ================= */
  const endpoint = useMemo(() => `/api/admin/content/${tab}`, [tab]);

  /* ================= LOAD ITEMS ================= */
  const load = async () => {
    setLoading(true);
    try {
      const data = await apiAdminGet(endpoint);
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setForm(emptyFormByTab(tab));
    setEditingId(null);
    load();
    // eslint-disable-next-line
  }, [tab]);

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const reset = () => {
    setEditingId(null);
    setForm(emptyFormByTab(tab));
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setForm({
      ...item,
      published: item.published ?? true,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ================= SUBMIT ================= */
  const submit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await apiAdminPut(`${endpoint}/${editingId}`, form);
        alert("Updated successfully");
      } else {
        await apiAdminPost(endpoint, form);
        alert("Published successfully");
      }

      reset();
      load();
    } catch (error) {
      console.error(error);
      alert(error.message || "Submission failed");
    }
  };

  /* ================= DELETE ================= */
  const remove = async (id) => {
    if (!window.confirm("Delete this item?")) return;

    try {
      await apiAdminDelete(`${endpoint}/${id}`);
      alert("Deleted successfully");
      load();
    } catch (error) {
      console.error(error);
      alert(error.message || "Delete failed");
    }
  };

  return (
    <div className="cmsPage">
      <div className="cmsHeader">
        <h1>Content Manager</h1>
        <p>Add / edit / publish content that appears on the Home page.</p>
      </div>

      {/* ================= TABS ================= */}
      <div className="cmsTabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`cmsTab ${tab === t.key ? "active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ================= FORM ================= */}
      <form className="cmsForm" onSubmit={submit}>
        <div className="cmsFormTop">
          <h2>
            {editingId ? "Edit" : "Create"}{" "}
            {TABS.find((x) => x.key === tab)?.label}
          </h2>

          <div className="cmsFormActions">
            {editingId && (
              <button type="button" className="btnGhost" onClick={reset}>
                Cancel
              </button>
            )}
            <button type="submit" className="btnPrimary">
              {editingId ? "Update" : "Publish"}
            </button>
          </div>
        </div>

        <div className="cmsGrid">
          <label>
            Title
            <input
              value={form.title || ""}
              onChange={(e) => onChange("title", e.target.value)}
              required
            />
          </label>

          {/* ✅ CATEGORY DROPDOWN */}
          <label>
            Category
            <select
              value={form.category}
              onChange={(e) => onChange("category", e.target.value)}
              required
            >
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>

          <label>
            Image URL
            <input
              value={form.image || ""}
              onChange={(e) => onChange("image", e.target.value)}
              required
            />
          </label>

          <label className="switchRow">
            Published
            <input
              type="checkbox"
              checked={!!form.published}
              onChange={(e) => onChange("published", e.target.checked)}
            />
          </label>
        </div>

        {/* NON VIDEO FIELDS */}
        {tab !== "videos" && (
          <>
            <div className="cmsGrid">
              <label>
                Description
                <input
                  value={form.description || ""}
                  onChange={(e) => onChange("description", e.target.value)}
                  required
                />
              </label>

              <label>
                Author
                <input
                  value={form.author || ""}
                  onChange={(e) => onChange("author", e.target.value)}
                />
              </label>

              <label>
                Date
                <input
                  value={form.date || ""}
                  onChange={(e) => onChange("date", e.target.value)}
                  required
                />
              </label>
            </div>

            <label className="cmsTextarea">
              Content
              <textarea
                rows={8}
                value={form.content || ""}
                onChange={(e) => onChange("content", e.target.value)}
                required
              />
            </label>
          </>
        )}

        {/* VIDEO FIELDS */}
        {tab === "videos" && (
          <label>
            YouTube URL
            <input
              value={form.youtubeUrl || ""}
              onChange={(e) => onChange("youtubeUrl", e.target.value)}
              required
            />
          </label>
        )}
      </form>

      {/* ================= LIST ================= */}
      <div className="cmsList">
        <div className="cmsListHead">
          <h2>Existing</h2>
          <span className="muted">
            {loading ? "Loading..." : `${items.length} items`}
          </span>
        </div>

        <table className="cmsTable">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Published</th>
              <th>Created</th>
              <th style={{ width: 200 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it._id}>
                <td>{it.title}</td>
                <td>{it.category}</td>
                <td>{it.published ? "Published" : "Hidden"}</td>
                <td>
                  {it.createdAt
                    ? new Date(it.createdAt).toLocaleDateString()
                    : "-"}
                </td>
                <td>
                  <button onClick={() => startEdit(it)}>Edit</button>
                  <button
                    onClick={() => remove(it._id)}
                    style={{ color: "red" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {!loading && items.length === 0 && (
              <tr>
                <td colSpan="5">No items yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
