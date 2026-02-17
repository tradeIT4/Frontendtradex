import React, { useRef, useEffect, useState } from "react";
import VideoCard from "./VideoCard";
import "../../styles/programsTv.css";

export default function VideoRow({ title, videos = [] }) {
  const railRef = useRef(null);
  const autoScrollRef = useRef(null);
  const touchResumeRef = useRef(null);
  const manualResumeRef = useRef(null);
  const directionRef = useRef(1);

  const [isDesktop, setIsDesktop] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const [isManualPause, setIsManualPause] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsDesktop(width >= 1024);

      const el = railRef.current;
      if (el) {
        setHasOverflow(el.scrollWidth > el.clientWidth + 4);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [videos.length]);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    setHasOverflow(el.scrollWidth > el.clientWidth + 4);
  }, [videos.length, isDesktop]);

  const autoPaused = isTouching || isManualPause;
  const showArrows = isDesktop && hasOverflow;

  useEffect(() => {
    const el = railRef.current;
    if (!el || !showArrows || autoPaused) return;

    autoScrollRef.current = setInterval(() => {
      const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
      if (maxScroll <= 0) return;

      if (el.scrollLeft <= 0) directionRef.current = 1;
      if (el.scrollLeft >= maxScroll) directionRef.current = -1;

      el.scrollLeft += directionRef.current;
    }, 24);

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
        autoScrollRef.current = null;
      }
    };
  }, [showArrows, autoPaused]);

  useEffect(() => {
    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
      if (touchResumeRef.current) clearTimeout(touchResumeRef.current);
      if (manualResumeRef.current) clearTimeout(manualResumeRef.current);
    };
  }, []);

  const pauseForManualInteraction = () => {
    if (manualResumeRef.current) {
      clearTimeout(manualResumeRef.current);
      manualResumeRef.current = null;
    }

    setIsManualPause(true);

    manualResumeRef.current = setTimeout(() => {
      setIsManualPause(false);
      manualResumeRef.current = null;
    }, 1400);
  };

  const onTouchStart = () => {
    if (touchResumeRef.current) {
      clearTimeout(touchResumeRef.current);
      touchResumeRef.current = null;
    }
    setIsTouching(true);
  };

  const onTouchEnd = () => {
    touchResumeRef.current = setTimeout(() => {
      setIsTouching(false);
      touchResumeRef.current = null;
    }, 800);
  };

  const scrollLeft = () => {
    const el = railRef.current;
    if (!el) return;

    pauseForManualInteraction();
    el.scrollBy({ left: -el.clientWidth, behavior: "smooth" });
    directionRef.current = -1;
  };

  const scrollRight = () => {
    const el = railRef.current;
    if (!el) return;

    pauseForManualInteraction();
    el.scrollBy({ left: el.clientWidth, behavior: "smooth" });
    directionRef.current = 1;
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
            <button className="ptvArrow left" onClick={scrollLeft} aria-label="Scroll Left">
              {"<"}
            </button>

            <button className="ptvArrow right" onClick={scrollRight} aria-label="Scroll Right">
              {">"}
            </button>
          </>
        )}

        <div
          className="ptvRail ptvRail--desktop3"
          ref={railRef}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onTouchCancel={onTouchEnd}
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
