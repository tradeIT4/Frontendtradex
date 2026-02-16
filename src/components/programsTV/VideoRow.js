import React, { useRef, useEffect, useState } from "react";
import VideoCard from "./VideoCard";
import "../../styles/programsTv.css";

export default function VideoRow({ title, videos = [] }) {
  const railRef = useRef(null);
  const autoScrollRef = useRef(null);

  const [isMobile, setIsMobile] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  /* =========================
     Detect Screen
  ========================== */
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsDesktop(width >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const showArrows = isDesktop && videos.length > 3;

  /* =========================
     AUTO SLIDE (Desktop Only If >3)
  ========================== */
  useEffect(() => {
    const el = railRef.current;
    if (!el || !showArrows) return;

    const startAutoScroll = () => {
      autoScrollRef.current = setInterval(() => {
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 5) {
          el.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          el.scrollBy({
            left: el.clientWidth,
            behavior: "smooth",
          });
        }
      }, 5000); // every 5 seconds
    };

    const stopAutoScroll = () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
        autoScrollRef.current = null;
      }
    };

    startAutoScroll();

    el.addEventListener("mouseenter", stopAutoScroll);
    el.addEventListener("mouseleave", startAutoScroll);

    return () => {
      stopAutoScroll();
      el.removeEventListener("mouseenter", stopAutoScroll);
      el.removeEventListener("mouseleave", startAutoScroll);
    };
  }, [showArrows]);

  /* =========================
     Scroll Functions
  ========================== */
  const scrollLeft = () => {
    const el = railRef.current;
    if (!el) return;

    el.scrollBy({
      left: -el.clientWidth,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    const el = railRef.current;
    if (!el) return;

    el.scrollBy({
      left: el.clientWidth,
      behavior: "smooth",
    });
  };

  return (
    <section className="ptvRow">
      <div className="ptvRowHeader">
        <h2 className="ptvRowTitle">{title}</h2>
        <div className="ptvRowCount">
          {videos.length} {videos.length === 1 ? "video" : "videos"}
        </div>
      </div>

      <div className="ptvRailWrapper">
        {showArrows && (
          <>
            <button
              className="ptvArrow left"
              onClick={scrollLeft}
              aria-label="Scroll Left"
            >
              ‹
            </button>

            <button
              className="ptvArrow right"
              onClick={scrollRight}
              aria-label="Scroll Right"
            >
              ›
            </button>
          </>
        )}

        <div
          className="ptvRail ptvRail--desktop3"
          ref={railRef}
        >
          {videos.map((v) => (
            <div key={v.id} className="ptvRailItem">
              <VideoCard video={v} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
