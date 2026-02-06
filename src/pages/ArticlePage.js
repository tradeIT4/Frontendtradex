import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { newsArticles } from "../data/mockData";
import "../styles/article.css";

export default function ArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const article = newsArticles.find(
    (a) => a.id === id && (a.language || "en") === language
  );

  if (!article) {
    return (
      <main className="articlePage">
        <p className="articleError">Article not found.</p>
        <button className="articleBack" onClick={() => navigate("/")}>
          ← {t("back")}
        </button>
      </main>
    );
  }

  return (
    <main className="articlePage">
      <button className="articleBack" onClick={() => navigate(-1)}>
        ← {t("back")}
      </button>

      <h1 className="articleTitle">{article.title}</h1>

      <div className="articleMeta">
        <span>{article.author}</span> · <span>{article.date}</span>
      </div>

      <div className="articleHero">
        <img src={article.image} alt={article.title} loading="lazy" />
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
