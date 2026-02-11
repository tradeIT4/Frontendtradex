import React from "react";
import VideoCard from "./VideoCard";
import "../../styles/programsTv.css";

export default function VideoRow({ title, videos }) {
  return (
    <section className="ptvRow">
      <div className="ptvRowHeader">
        <h2 className="ptvRowTitle">{title}</h2>
        <div className="ptvRowCount">{videos.length} videos</div>
      </div>

      <div className="ptvRail" role="list">
        {videos.map((v) => (
          <div key={v.id} role="listitem" className="ptvRailItem">
            <VideoCard video={v} />
          </div>
        ))}
      </div>
    </section>
  );
}
