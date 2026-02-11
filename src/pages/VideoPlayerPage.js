import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { tvVideos } from "../data/programsTvData";
import "../styles/videoPlayer.css";

/**
 * Converts ANY YouTube URL into embed format
 * Supports:
 * - youtube.com/watch?v=
 * - youtu.be/
 * - youtube.com/embed/
 * - URLs with extra params
 */
function getYouTubeEmbed(url) {
  if (!url) return null;

  const regex =
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/]+)/i;

  const match = url.match(regex);

  return match
    ? `https://www.youtube.com/embed/${match[1]}`
    : null;
}

export default function VideoPlayerPage() {
  const { id } = useParams();

  const video = useMemo(
    () => tvVideos.find((v) => v.id === id),
    [id]
  );

  const related = useMemo(() => {
    if (!video) return [];
    return tvVideos.filter(
      (v) => v.category === video.category && v.id !== video.id
    );
  }, [video]);

  if (!video) {
    return (
      <div className="vpPage">
        <div className="vpNotFound">
          <h1>Video not found</h1>
          <Link className="vpBack" to="/programs-tv">
            Back to Programs
          </Link>
        </div>
      </div>
    );
  }

  const embedUrl = getYouTubeEmbed(video.videoUrl);

  return (
    <div className="vpPage">
      <div className="vpTop">
        <Link className="vpBack" to="/programs-tv">
          ← Back to Programs
        </Link>
      </div>

      {/* VIDEO PLAYER SECTION */}
      <section className="vpPlayerSection">
        <div className="vpPlayerWrap">
          {embedUrl ? (
            <iframe
              className="vpIframe"
              src={embedUrl}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <p className="vpError">Invalid YouTube URL</p>
          )}
        </div>

        <div className="vpInfo">
          <div className="vpKicker">{video.category}</div>
          <h1 className="vpTitle">{video.title}</h1>

          <div className="vpMeta">
            <span>{video.dateTime}</span>
            <span className="dot">•</span>
            <span>{video.venue}</span>
            <span className="dot">•</span>
            <span>Host: {video.host}</span>
          </div>

          <div className="vpDesc">
            <h3>Description</h3>
            <p>{video.description}</p>
          </div>
        </div>
      </section>

      {/* RELATED VIDEOS */}
      {related.length > 0 && (
        <section className="vpRelated">
          <div className="vpRelatedHeader">
            <h2>Related in {video.category}</h2>
            <span className="vpCount">
              {related.length} videos
            </span>
          </div>

          <div className="vpGrid">
            {related.map((r) => (
              <Link
                key={r.id}
                className="vpCard"
                to={`/programs-tv/watch/${r.id}`}
              >
                <div className="vpThumbWrap">
                  <img
                    className="vpThumb"
                    src={r.thumbnail}
                    alt={r.title}
                  />
                  <div className="vpPlay">▶</div>
                </div>

                <div className="vpCardTitle">
                  {r.title}
                </div>

                <div className="vpCardSub">
                  {r.dateTime} • {r.venue}
                </div>

                <div className="vpCardHost">
                  Host: {r.host}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <footer className="vpFooter">
        © 2026 TradeX TV. All rights reserved.
      </footer>
    </div>
  );
}
