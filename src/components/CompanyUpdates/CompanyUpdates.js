import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import "./CompanyUpdates.css";

export default function CompanyUpdates({ items = [] }) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  if (!items.length) return null;

  // Duplicate items for seamless scroll
  const scrollItems = [...items, ...items];

  return (
    <section className="companySection">
      <div className="companyHead">
        <h2 className="sectionTitle">{t("companyUpdatesTitle")}</h2>
        <p className="sectionSub">{t("companyUpdatesDesc")}</p>
      </div>

      <div className="companyScrollWrapper">
        <div className="companyScrollTrack">
          {scrollItems.map((p, idx) => (
            <article
              key={`${p.id}-${idx}`}
              className="companyCard"
              onClick={() => navigate(`/company/${p.id}`)}
            >
              <div className="companyThumb">
                <img src={p.image} alt={p.title} loading="lazy" />
              </div>
              <div className="companyBody">
                <h3 className="companyTitle">{p.title}</h3>
                <p className="companyDesc">{p.description}</p>
                <div className="companyMeta">
                  <span>{p.author}</span> · <span>{p.date}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
