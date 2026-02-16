import React, { useEffect, useMemo, useState, useCallback } from "react";
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

/* ================= LANGUAGES ================= */
const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "am", label: "Amharic" },
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

/* ================= EMPTY FORM FACTORY ================= */
const getEmptyForm = (tab) => {
  const base = {
    title: "",
    image: "",
    language: "en",
    published: true,
  };

  if (tab === "videos") {
    return {
      ...base,
      youtubeUrl: "",
    };
  }

  const isCompany = tab === "company-posts";

  return {
    ...base,
    category: isCompany
      ? COMPANY_CATEGORIES[0]
      : NEWS_CATEGORIES[0],
    description: "",
    author: isCompany ? "TradeX Team" : "TradeX Desk",
    date: "",
    content: "",
  };
};

export default function AdminContentPage() {
  const [tab, setTab] = useState("news");
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(getEmptyForm("news"));
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const endpoint = useMemo(
    () => `/api/admin/content/${tab}`,
    [tab]
  );

  const categoryOptions = useMemo(() => {
    return tab === "company-posts"
      ? COMPANY_CATEGORIES
      : NEWS_CATEGORIES;
  }, [tab]);

  /* ================= LOAD DATA ================= */
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiAdminGet(endpoint);
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      alert("Failed to load content");
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    setForm(getEmptyForm(tab));
    setEditingId(null);
    load();
  }, [tab, load]);

  /* ================= FORM HELPERS ================= */
  const onChange = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm(getEmptyForm(tab));
  };

  const openCreateModal = () => {
    resetForm();
    setShowFormModal(true);
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setForm({
      ...item,
      language: item.language || "en",
      published: item.published ?? true,
    });
    setShowFormModal(true);
  };

  /* ================= SUBMIT ================= */
  const submit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await apiAdminPut(`${endpoint}/${editingId}`, form);
      } else {
        await apiAdminPost(endpoint, form);
      }

      setShowFormModal(false);
      resetForm();
      load();
    } catch (err) {
      console.error(err);
      alert("Submission failed");
    }
  };

  /* ================= DELETE ================= */
  const confirmDelete = async () => {
    try {
      await apiAdminDelete(`${endpoint}/${deleteId}`);
      setDeleteId(null);
      load();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  /* ================= RENDER ================= */
  return (
    <div className="cmsPage">
      <div className="cmsHeader">
        <h1>Content Manager</h1>
        <p>Add / edit / publish content for TradeX</p>
      </div>

      {/* TABS */}
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

      {/* CREATE BUTTON */}
      <div style={{ marginBottom: 20 }}>
        <button className="btnPrimary" onClick={openCreateModal}>
          + Create {TABS.find((x) => x.key === tab)?.label}
        </button>
      </div>

      {/* LIST */}
      <div className="cmsList">
        <div className="cmsListHead">
          <h2>Existing</h2>
          <span>
            {loading ? "Loading..." : `${items.length} items`}
          </span>
        </div>

        <table className="cmsTable">
          <thead>
            <tr>
              <th>Title</th>
              <th>Language</th>
              <th>Published</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan="5">No items yet.</td>
              </tr>
            )}

            {items.map((it) => (
              <tr key={it._id}>
                <td>{it.title}</td>
                <td>{it.language || "en"}</td>
                <td>
                  {it.published ? "Published" : "Hidden"}
                </td>
                <td>
                  {it.createdAt
                    ? new Date(it.createdAt).toLocaleDateString()
                    : "-"}
                </td>
                <td>
                  <button onClick={() => startEdit(it)}>
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(it._id)}
                    style={{
                      color: "red",
                      marginLeft: 10,
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FORM MODAL */}
      {showFormModal && (
        <div className="modalOverlay">
          <div className="modalBox">
            <div className="modalHeader">
              <h2>
                {editingId
                  ? "Edit Content"
                  : "Create Content"}
              </h2>
              <button
                className="modalClose"
                onClick={() => {
                  setShowFormModal(false);
                  resetForm();
                }}
              >
                ×
              </button>
            </div>

            <form className="cmsForm" onSubmit={submit}>
              <div className="cmsGrid">
                <label>
                  Title
                  <input
                    value={form.title || ""}
                    onChange={(e) =>
                      onChange("title", e.target.value)
                    }
                    required
                  />
                </label>

                <label>
                  Language
                  <select
                    value={form.language}
                    onChange={(e) =>
                      onChange("language", e.target.value)
                    }
                  >
                    {LANGUAGES.map((l) => (
                      <option
                        key={l.code}
                        value={l.code}
                      >
                        {l.label}
                      </option>
                    ))}
                  </select>
                </label>

                {tab !== "videos" && (
                  <label>
                    Category
                    <select
                      value={form.category}
                      onChange={(e) =>
                        onChange(
                          "category",
                          e.target.value
                        )
                      }
                    >
                      {categoryOptions.map((cat) => (
                        <option key={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </label>
                )}

                <label>
                  Thumbnail / Image URL
                  <input
                    value={form.image || ""}
                    onChange={(e) =>
                      onChange("image", e.target.value)
                    }
                  />
                </label>

                <label className="switchRow">
                  Published
                  <input
                    type="checkbox"
                    checked={!!form.published}
                    onChange={(e) =>
                      onChange(
                        "published",
                        e.target.checked
                      )
                    }
                  />
                </label>
              </div>

              {tab === "videos" && (
                <label>
                  Video URL
                  <input
                    value={form.youtubeUrl || ""}
                    onChange={(e) =>
                      onChange(
                        "youtubeUrl",
                        e.target.value
                      )
                    }
                  />
                </label>
              )}

              {tab !== "videos" && (
                <>
                  <label>
                    Description
                    <input
                      value={form.description || ""}
                      onChange={(e) =>
                        onChange(
                          "description",
                          e.target.value
                        )
                      }
                    />
                  </label>

                  <label>
                    Author
                    <input
                      value={form.author || ""}
                      onChange={(e) =>
                        onChange(
                          "author",
                          e.target.value
                        )
                      }
                    />
                  </label>

                  <label>
                    Date
                    <input
                      type="date"
                      value={form.date || ""}
                      onChange={(e) =>
                        onChange("date", e.target.value)
                      }
                    />
                  </label>

                  <label>
                    Content
                    <textarea
                      rows={6}
                      value={form.content || ""}
                      onChange={(e) =>
                        onChange(
                          "content",
                          e.target.value
                        )
                      }
                    />
                  </label>
                </>
              )}

              <div style={{ marginTop: 20 }}>
                <button
                  className="btnPrimary"
                  type="submit"
                >
                  {editingId ? "Update" : "Publish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteId && (
        <div className="modalOverlay">
          <div className="modalBox small">
            <h3>Delete this item?</h3>
            <div style={{ marginTop: 20 }}>
              <button
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>
              <button
                className="btnDanger"
                onClick={confirmDelete}
                style={{ marginLeft: 10 }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
