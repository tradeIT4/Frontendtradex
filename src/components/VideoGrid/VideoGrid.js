import React from "react";
import { Link } from "react-router-dom";
import "../../styles/videoGrid.css";

export default function VideoGrid({ items = [] }) {
  if (!items.length) return null;

  return (
    <section className="videoSection">
      <div className="videoHeader">
        <h2>Videos</h2>
      </div>

      <div className="videoGrid">
        {items.map((video) => (
          <Link
            key={video._id}
            to={`/video/${video._id}`}
            className="videoCard"
          >
            <div className="videoThumb">
              <img
                src={video.image}
                alt={video.title}
                loading="lazy"
              />
              <div className="playOverlay">▶</div>
            </div>

            <div className="videoBody">
              <h3>{video.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}