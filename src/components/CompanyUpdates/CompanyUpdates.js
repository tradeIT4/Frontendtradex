import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import "./CompanyUpdates.css";

export default function CompanyUpdates({ items = [] }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isTouching, setIsTouching] = useState(false);
  const resumeTimerRef = useRef(null);

  const onTouchStart = () => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
    setIsTouching(true);
  };

  const onTouchEnd = () => {
    resumeTimerRef.current = setTimeout(() => {
      setIsTouching(false);
      resumeTimerRef.current = null;
    }, 800);
  };

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
      }
    };
  }, []);

  if (!items.length) {
    return (
      <section className="companySection">
        <div className="companyHead">
          <h2 className="sectionTitle">{t("companyUpdatesTitle")}</h2>
        </div>
        <div className="companyEmpty">{t("noPostsFound")}</div>
      </section>
    );
  }

  // duplicate for smooth loop animation
  const scrollItems = [...items, ...items];

  return (
    <section className="companySection">
      <div className="companyHead">
        <h2 className="sectionTitle">{t("companyUpdatesTitle")}</h2>
        <p className="sectionSub">{t("companyUpdatesDesc")}</p>
      </div>

      <div
        className="companyScrollWrapper"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      >
        <div
          className={`companyScrollTrack ${isTouching ? "isTouching" : ""}`}
        >
          {scrollItems.map((p, idx) => (
            <article
              key={`${p._id}-${idx}`}
              className="companyCard"
              onClick={() => navigate(`/company-post/${p._id}`)}
            >
              <div className="companyThumb">
                <img src={p.image} alt={p.title} loading="lazy" />
              </div>

              <div className="companyBody">
                {p.category && (
                  <div className="companyMeta">{p.category}</div>
                )}

                <h3 className="companyTitle">{p.title}</h3>

                {p.description && (
                  <p className="companyDesc">{p.description}</p>
                )}

                {(p.author || p.date) && (
                  <div className="companyMeta">
                    {p.author && <span>{p.author}</span>}
                    {p.author && p.date && " · "}
                    {p.date && <span>{p.date}</span>}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
