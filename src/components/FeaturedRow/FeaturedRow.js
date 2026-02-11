import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import "./FeaturedRow.css";

export default function FeaturedRow({ items = [] }) {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const [page, setPage] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset page on language or data change
  useEffect(() => {
    setPage(0);
  }, [language, items]);

  const maxPage = items.length - 1;

  // ✅ Hook must always run
  const pagedItems = useMemo(() => {
    return items.slice(page, page + 1);
  }, [items, page]);

  const goToArticle = (id) => {
    if (!id) return;
    navigate(`/article/${id}`);
  };

  // ✅ Early return AFTER hooks
  if (!items || items.length === 0) return null;

  return (
    <section className="featured">
      {isMobile && (
        <div className="featuredNav">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            ←
          </button>

          <span className="featuredPage">
            {page + 1} / {items.length}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
            disabled={page === maxPage}
          >
            →
          </button>
        </div>
      )}

      <div className="featuredTrack">
        {(isMobile ? pagedItems : items).map((item) => (
          <article
            key={item._id}
            className="featuredCard"
            onClick={() => goToArticle(item._id)}
            style={{ cursor: "pointer" }}
          >
            <img src={item.image} alt={item.title} />

            <div className="featuredOverlay">
              <span className="featuredCategory">
                {item.category}
              </span>

              <h2 className="featuredTitle">
                {item.title}
              </h2>

              <p className="featuredDesc">
                {item.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
