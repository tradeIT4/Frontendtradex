import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { videos } from "../data/mockData";
import "../styles/video.css";

function getYouTubeId(url) {
  if (!url) return null;
  const match = String(url).match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/]+)/i
  );
  return match ? match[1] : null;
}

export default function VideoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const video = videos.find((v) => v.id === id && (v.language || "en") === language);

  if (!video) {
    return (
      <main className="videoPage">
        <p className="videoError">Video not found.</p>
        <button className="videoBack" onClick={() => navigate("/")}>
          ← {t("back")}
        </button>
      </main>
    );
  }

  const vid = getYouTubeId(video.youtubeUrl);

  if (!vid) {
    return (
      <main className="videoPage">
        <p className="videoError">Invalid YouTube URL.</p>
        <button className="videoBack" onClick={() => navigate("/")}>
          ← {t("back")}
        </button>
      </main>
    );
  }

  return (
    <main className="videoPage">
      <button className="videoBack" onClick={() => navigate(-1)}>
        ← {t("back")}
      </button>

      <h1 className="videoTitle">{video.title}</h1>
      <div className="videoMeta">{video.author} · {video.date}</div>

      <div className="videoFrameWrap">
        <iframe
          src={`https://www.youtube.com/embed/${vid}`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </main>
  );
}