import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { companyPosts } from "../data/mockData";
import "../styles/article.css";

export default function CompanyPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const post = companyPosts.find(
    (p) => p.id === id && (p.language || "en") === language
  );

  if (!post) {
    return (
      <main className="articlePage">
        <p className="articleError">Post not found.</p>
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

      <h1 className="articleTitle">{post.title}</h1>

      <div className="articleMeta">
        <span>{post.author}</span> · <span>{post.date}</span>
      </div>

      <div className="articleHero">
        <img src={post.image} alt={post.title} loading="lazy" />
      </div>

      <article className="articleBody">
        {String(post.content || "")
          .split("\n")
          .map((p, i) => (
            <p key={i}>{p}</p>
          ))}
      </article>
    </main>
  );
}