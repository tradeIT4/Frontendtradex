import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./NewsGrid.css";

const ITEMS_PER_PAGE = 6; // 2 rows x 3 columns

export default function NewsGrid({ items = [], sectionTitle }) {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);

  // Ensure items is always an array
  const safeItems = Array.isArray(items) ? items : [];

  const totalPages = Math.ceil(safeItems.length / ITEMS_PER_PAGE);
  const start = page * ITEMS_PER_PAGE;
  const visibleItems = safeItems.slice(start, start + ITEMS_PER_PAGE);

  const goToArticle = (id) => {
    if (!id) return console.error("Missing _id");
    navigate(`/article/${id}`);
  };

  return (
    <section className="newsSection">
      <div className="newsHeader">
        <h2 className="sectionTitle">{sectionTitle}</h2>

        {totalPages > 1 && (
          <div className="newsArrows">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              disabled={page === 0}
            >
              <FaChevronLeft />
            </button>

            <button
              onClick={() =>
                setPage((p) => Math.min(p + 1, totalPages - 1))
              }
              disabled={page === totalPages - 1}
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>

      <div className="newsGrid">
        {visibleItems.length === 0 ? (
          <p style={{ padding: "20px" }}>No articles available.</p>
        ) : (
          visibleItems.map((n) => (
            <article
              key={n._id} // ✅ MongoDB key
              className="newsCard"
              onClick={() => goToArticle(n._id)} // ✅ MongoDB navigation
              style={{ cursor: "pointer" }}
            >
              <img
                src={n.image || "/placeholder.jpg"}
                alt={n.title || "News"}
              />

              <div className="newsBody">
                <span className="newsCategory">
                  {n.category || "General"}
                </span>
                <h3>{n.title}</h3>
                <p>{n.description}</p>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
