import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import "./VideoGrid.css";

export default function VideoGrid({ items = [] }) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  if (!items.length) return null;

  // ensure enough items so mobile always shows
  const loopItems =
    items.length < 6 ? [...items, ...items, ...items] : [...items, ...items];

  return (
    <section className="videoMarqueeSection">
      <div className="videoHeader">
        <h2 className="videoSectionTitle">{t("videos")}</h2>
        <p className="videoSectionSub">{t("videosDesc")}</p>
      </div>

      <div className="videoMarquee">
        <div className="videoTrack">
          {loopItems.map((v, idx) => (
            <div
              key={`${v.id}-${idx}`}
              className="videoItem"
              onClick={() => navigate(`/video/${v.id}`)}
              role="button"
              tabIndex={0}
            >
              <img src={v.thumbnail} alt={v.title} loading="lazy" />

              <div className="videoTitleOverlay">
                <span className="videoItemTitle">{v.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
