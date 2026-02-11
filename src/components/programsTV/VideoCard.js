import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/programsTv.css";

export default function VideoCard({ video }) {
  const navigate = useNavigate();

  return (
    <button
      className="ptvCard"
      onClick={() => navigate(`/programs-tv/watch/${video.id}`)}
      title={video.title}
    >
      <div className="ptvThumbWrap">
        <img className="ptvThumb" src={video.thumbnail} alt={video.title} />
        <div className="ptvPlayBadge" aria-hidden="true">▶</div>
        <div className="ptvHoverCta">Watch Now</div>
      </div>

      <div className="ptvMeta">
        <div className="ptvTitle">{video.title}</div>
        <div className="ptvSub">
          <span>{video.dateTime}</span>
          <span className="dot">•</span>
          <span>{video.venue}</span>
        </div>
        <div className="ptvHost">Host: {video.host}</div>
      </div>
    </button>
  );
}
