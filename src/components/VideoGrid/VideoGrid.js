import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/videoGrid.css";

export default function VideoGrid({ items = [] }) {
  const railRef = useRef(null);
  const autoTimerRef = useRef(null);
  const resumeTimerRef = useRef(null);
  const manualResumeTimerRef = useRef(null);
  const directionRef = useRef(1);
  const [isTouching, setIsTouching] = useState(false);
  const [isManualPause, setIsManualPause] = useState(false);
  const autoPaused = isTouching || isManualPause;

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
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      if (manualResumeTimerRef.current) clearTimeout(manualResumeTimerRef.current);
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    };
  }, []);

  const scrollByStep = (direction) => {
    const rail = railRef.current;
    if (!rail) return;

    if (manualResumeTimerRef.current) {
      clearTimeout(manualResumeTimerRef.current);
      manualResumeTimerRef.current = null;
    }
    setIsManualPause(true);

    const step = Math.max(260, Math.floor(rail.clientWidth * 0.7));
    rail.scrollBy({ left: direction * step, behavior: "smooth" });
    directionRef.current = direction;

    manualResumeTimerRef.current = setTimeout(() => {
      setIsManualPause(false);
      manualResumeTimerRef.current = null;
    }, 1400);
  };

  useEffect(() => {
    const rail = railRef.current;
    if (!rail || !items.length) return undefined;

    if (autoTimerRef.current) {
      clearInterval(autoTimerRef.current);
      autoTimerRef.current = null;
    }
    if (autoPaused) return undefined;

    autoTimerRef.current = setInterval(() => {
      const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth);
      if (maxScroll <= 0) return;

      if (rail.scrollLeft <= 0) directionRef.current = 1;
      if (rail.scrollLeft >= maxScroll) directionRef.current = -1;

      rail.scrollLeft += directionRef.current;
    }, 24);

    return () => {
      if (autoTimerRef.current) {
        clearInterval(autoTimerRef.current);
        autoTimerRef.current = null;
      }
    };
  }, [autoPaused, items.length]);

  if (!items.length) return null;

  // Ensure enough rail width on large desktop so auto-scroll can always move.
  const minCardsForRail = 10;
  const repeatCount = Math.max(2, Math.ceil(minCardsForRail / items.length));
  const railItems = Array.from({ length: repeatCount }, () => items).flat();

  return (
    <section className="videoSection">
      <div className="videoHeader">
        <h2>Videos</h2>
      </div>

      <div className="videoRailWrap">
        <div className="videoArrows">
          <button
            type="button"
            onClick={() => scrollByStep(-1)}
            aria-label="Scroll videos left"
          >
            {"<"}
          </button>
          <button
            type="button"
            onClick={() => scrollByStep(1)}
            aria-label="Scroll videos right"
          >
            {">"}
          </button>
        </div>

        <div
          className="videoRail"
          ref={railRef}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onTouchCancel={onTouchEnd}
        >
          <div className="videoTrack">
            {railItems.map((video, index) => (
            <Link
              key={`${video._id}-${index}`}
              to={`/video/${video._id}`}
              className="videoCard"
            >
              <div className="videoThumb">
                <img
                  src={video.image}
                  alt={video.title}
                  loading="lazy"
                />
                <div className="playOverlay">{">"}</div>
              </div>

              <div className="videoBody">
                <h3>{video.title}</h3>
              </div>
            </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}



