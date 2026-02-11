import React from "react";
import { Link } from "react-router-dom";
import "../styles/liveTv.css";

export default function LiveTVPage() {
  return (
    <div className="livePage">

      {/* TOP BAR */}
      <div className="liveTop">
        <Link to="/programs-tv" className="liveBack">
          ← Back to Programs
        </Link>
      </div>

      {/* LIVE PLAYER SECTION */}
      <section className="liveHero">

        <div className="livePlayerWrapper">

          <div className="liveBadge">
            <span className="liveDot"></span>
            LIVE
          </div>

          {/* Streaming Placeholder */}
          <div className="livePlayer">
            <div className="livePlayerOverlay">
              <div className="livePlayIcon">▶</div>
              <div className="liveText">
                TradeX Live Broadcast
              </div>
              <div className="liveSubText">
                Streaming placeholder — connect to RTMP / HLS later
              </div>
            </div>
          </div>

        </div>

        <div className="liveInfo">
          <h1>Live Stream Sales Show</h1>
          <p>
            Broadcasting live business insights, market analysis,
            and trade intelligence directly from TradeX Studio.
          </p>

          <div className="liveMeta">
            <span>Venue: TradeX Studio</span>
            <span>Host: Miki Tesfaye</span>
            <span>Every Day • 7:00 PM</span>
          </div>
        </div>

      </section>

      {/* LIVE SCHEDULE */}
      <section className="liveSchedule">
        <h2>Today's Schedule</h2>

        <div className="scheduleGrid">
          <div className="scheduleCard">
            <span className="time">6:00 PM</span>
            <span>The Money Movement</span>
          </div>

          <div className="scheduleCard active">
            <span className="time">7:00 PM</span>
            <span>Live Stream Sales Show</span>
          </div>

          <div className="scheduleCard">
            <span className="time">8:30 PM</span>
            <span>Business News</span>
          </div>

          <div className="scheduleCard">
            <span className="time">9:30 PM</span>
            <span>Capital Market Show</span>
          </div>
        </div>
      </section>

      <footer className="liveFooter">
        © 2026 TradeX TV Live
      </footer>
    </div>
  );
}
