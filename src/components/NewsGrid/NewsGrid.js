import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./NewsGrid.css";

const ITEMS_PER_PAGE = 6; // 2 rows x 3 columns

export default function NewsGrid({ items = [], sectionTitle }) {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const start = page * ITEMS_PER_PAGE;
  const visibleItems = items.slice(start, start + ITEMS_PER_PAGE);

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
              onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
              disabled={page === totalPages - 1}
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>

      <div className="newsGrid">
        {visibleItems.map((n) => (
          <article
            key={n.id}
            className="newsCard"
            onClick={() => navigate(`/article/${n.id}`)}
          >
            <img src={n.image} alt={n.title} />
            <div className="newsBody">
              <span className="newsCategory">{n.category}</span>
              <h3>{n.title}</h3>
              <p>{n.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
