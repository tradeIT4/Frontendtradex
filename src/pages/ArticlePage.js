import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiPublicGet } from "../services/api";
import { useLanguage } from "../context/LanguageContext";
import "../styles/article.css";

export default function ArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        // 🔥 Prevent undefined crash
        if (!id || id === "undefined") {
          navigate("/", { replace: true });
          return;
        }

        const data = await apiPublicGet(`/api/public/news/${id}`);

        if (data.language && data.language !== language) {
          navigate("/", { replace: true });
          return;
        }

        setArticle(data);
      } catch (error) {
        console.error(error.message);
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, language, navigate]);

  if (loading) {
    return (
      <main className="articlePage">
        <p>Loading article...</p>
      </main>
    );
  }

  if (!article) return null;

  return (
    <main className="articlePage">
      <button
        className="articleBack"
        onClick={() => navigate(-1)}
      >
        ← {t("back")}
      </button>

      <h1 className="articleTitle">{article.title}</h1>

      <div className="articleMeta">
        <span>{article.author}</span> ·{" "}
        <span>{article.date}</span>
      </div>

      <div className="articleHero">
        <img
          src={article.image}
          alt={article.title}
        />
      </div>

      <article className="articleBody">
        {String(article.content || "")
          .split("\n")
          .map((p, i) => (
            <p key={i}>{p}</p>
          ))}
      </article>
    </main>
  );
}
