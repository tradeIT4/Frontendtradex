import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiPublicGet } from "../services/api";
import { useLanguage } from "../context/LanguageContext";
import "../styles/videoPage.css";

function getYouTubeEmbed(url) {
  if (!url) return null;

  const match = String(url).match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/]+)/i
  );

  return match
    ? `https://www.youtube.com/embed/${match[1]}`
    : null;
}

export default function VideoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        // Prevent invalid Mongo ID navigation
        if (!id || id === "undefined") {
          navigate("/", { replace: true });
          return;
        }

        const data = await apiPublicGet(`/api/public/videos/${id}`);

        // Optional language protection
        if (data?.language && data.language !== language) {
          navigate("/", { replace: true });
          return;
        }

        setVideo(data);
      } catch (error) {
        console.error("Video fetch error:", error.message);
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id, language, navigate]);

  if (loading) {
    return (
      <main className="videoPage">
        <p>Loading video...</p>
      </main>
    );
  }

  if (!video) return null;

  const embedUrl = getYouTubeEmbed(video.youtubeUrl);

  return (
    <main className="videoPage">
      <button
        className="videoBack"
        onClick={() => navigate(-1)}
      >
        ← {t("back")}
      </button>

      <h1 className="videoTitle">{video.title}</h1>

      <div className="videoMeta">
        {video.date && <span>{video.date}</span>}
      </div>

      <div className="videoPlayerWrapper">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <p className="videoError">Invalid YouTube URL</p>
        )}
      </div>

      {video.description && (
        <p className="videoDescription">
          {video.description}
        </p>
      )}
    </main>
  );    
}    
