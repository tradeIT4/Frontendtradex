import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiPublicGet } from "../services/api";
import "../styles/article.css";

export default function CompanyPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError("");

        if (!id || id === "undefined") {
          setError("Invalid post ID");
          return;
        }

        const data = await apiPublicGet(`/api/public/company-posts/${id}`);
        setPost(data);
      } catch (e) {
        setError(e.message || "Post not found");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [id]);

  if (loading) {
    return (
      <main className="articlePage">
        <p className="articleLoading">Loading post...</p>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="articlePage">
        <p className="articleError">{error || "Post not found"}</p>
        <button className="articleBack" onClick={() => navigate("/")}>
          ← Back
        </button>
      </main>
    );
  }

  return (
    <main className="articlePage">
      <button className="articleBack" onClick={() => navigate(-1)}>
        ← Back
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