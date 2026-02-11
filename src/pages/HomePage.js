import React, { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { apiPublicGet } from "../services/api";

import TopNav from "../components/TopNav/TopNav";
import StockTicker from "../components/StockTicker/StockTicker";
import FeaturedRow from "../components/FeaturedRow/FeaturedRow";
import NewsGrid from "../components/NewsGrid/NewsGrid";
import Sidebar from "../components/Sidebar/Sidebar";
import CompanyUpdates from "../components/CompanyUpdates/CompanyUpdates";
import VideoGrid from "../components/VideoGrid/VideoGrid";
import Footer from "../components/Footer/Footer";

import "../styles/layout.css";

/* ================= NAV CATEGORIES ================= */
const navCategories = [
  "all",
  "business",
  "economy",
  "trade",
  "market",
  "technology",
];

export default function HomePage({ themeApi }) {
  const { language, t } = useLanguage();

  /* ================= STATE ================= */
  const [newsArticles, setNewsArticles] = useState([]);
  const [companyPosts, setCompanyPosts] = useState([]);
  const [videos, setVideos] = useState([]);

  const [activeCategory, setActiveCategory] = useState("all");
  const [sidebarCategory, setSidebarCategory] = useState("all");
  const [page, setPage] = useState(1);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const news = await apiPublicGet("/api/public/news");
        const company = await apiPublicGet("/api/public/company-posts");
        const vids = await apiPublicGet("/api/public/videos");

        setNewsArticles(Array.isArray(news) ? news : []);
        setCompanyPosts(Array.isArray(company) ? company : []);
        setVideos(Array.isArray(vids) ? vids : []);
      } catch (error) {
        console.error("Home fetch error:", error.message);
      }
    };

    fetchData();
  }, []);

  /* ================= RESPONSIVE ITEMS ================= */
  const getItemsPerPage = () => {
    if (typeof window === "undefined") return 6;
    const w = window.innerWidth;
    if (w < 600) return 2;
    if (w < 900) return 4;
    return 6;
  };

  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage());

  useEffect(() => {
    const onResize = () => setItemsPerPage(getItemsPerPage());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [activeCategory, language]);

  /* ================= FILTERED NEWS ================= */
  const filteredNews = useMemo(() => {
    if (!newsArticles.length) return [];

    const normalizedCategory = activeCategory.toLowerCase();

    const base =
      normalizedCategory === "all"
        ? newsArticles
        : newsArticles.filter(
            (n) =>
              (n?.category || "")
                .toLowerCase()
                .trim() === normalizedCategory
          );

    return base.filter(
      (n) => (n?.language || "en") === language
    );
  }, [newsArticles, activeCategory, language]);

  /* ================= FEATURED ================= */
  const featured = useMemo(() => {
    return filteredNews.slice(0, 3);
  }, [filteredNews]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.max(
    1,
    Math.ceil(filteredNews.length / itemsPerPage)
  );

  const pagedNews = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredNews.slice(start, start + itemsPerPage);
  }, [filteredNews, page, itemsPerPage]);

  /* ================= SIDEBAR ================= */
  const sidebarStories = useMemo(() => {
    const normalizedCategory = sidebarCategory.toLowerCase();

    const base =
      normalizedCategory === "all"
        ? newsArticles
        : newsArticles.filter(
            (n) =>
              (n?.category || "")
                .toLowerCase()
                .trim() === normalizedCategory
          );

    return base
      .filter((n) => (n?.language || "en") === language)
      .slice(0, 4);
  }, [newsArticles, sidebarCategory, language]);

  /* ================= COMPANY ================= */
  const companyByLang = useMemo(() => {
    return companyPosts.filter(
      (p) => (p?.language || "en") === language
    );
  }, [companyPosts, language]);

  /* ================= VIDEOS ================= */
  const videosByLang = useMemo(() => {
    return videos.filter(
      (v) => (v?.language || "en") === language
    );
  }, [videos, language]);

  /* ================= UI ================= */
  return (
    <div className="appShell">
      <TopNav
        categories={navCategories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        themeApi={themeApi}
      />

      <StockTicker />

      <main className="page">
        <FeaturedRow items={featured} />

        <section className="contentGrid">
          <div className="contentMain">
            <NewsGrid
              items={pagedNews}
              sectionTitle={
                activeCategory === "all"
                  ? t("topStories")
                  : t(`categories.${activeCategory}`)
              }
            />

            {totalPages > 1 && (
              <div className="pager">
                <button
                  disabled={page === 1}
                  onClick={() =>
                    setPage((prev) => Math.max(1, prev - 1))
                  }
                >
                  ◀
                </button>

                <span className="pagerInfo">
                  {t("page")} {page} / {totalPages}
                </span>

                <button
                  disabled={page === totalPages}
                  onClick={() =>
                    setPage((prev) =>
                      Math.min(totalPages, prev + 1)
                    )
                  }
                >
                  ▶
                </button>
              </div>
            )}
          </div>

          <aside className="contentSide">
            <Sidebar
              categories={navCategories}
              value={sidebarCategory}
              onChange={setSidebarCategory}
              stories={sidebarStories}
            />
          </aside>
        </section>

        <CompanyUpdates items={companyByLang} />
        <VideoGrid items={videosByLang} />
      </main>

      <Footer />
    </div>
  );
}
