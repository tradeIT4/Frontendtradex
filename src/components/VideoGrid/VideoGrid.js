import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import "./VideoGrid.css";

export default function VideoGrid({ items = [] }) {
  const { t } = useLanguage();

  if (!items || items.length === 0) return null;

  // Duplicate items for marquee loop
  const loopItems =
    items.length < 6
      ? [...items, ...items, ...items]
      : [...items, ...items];

  return (
    <section className="videoMarqueeSection">
      <div className="videoHeader">
        <h2 className="videoSectionTitle">{t("videos")}</h2>
        <p className="videoSectionSub">{t("videosDesc")}</p>
      </div>

      <div className="videoMarquee">
        <div className="videoTrack">
          {loopItems.map((v, idx) => (
            <Link
              key={`${v._id}-${idx}`}
              to={`/video/${v._id}`}   // ✅ MongoDB _id
              className="videoItem"
            >
              <img
                src={v.thumbnail || "/placeholder.jpg"}
                alt={v.title || "Video"}
                loading="lazy"
              />

              <div className="videoTitleOverlay">
                <span className="videoItemTitle">
                  {v.title}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
