import React, { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

import TopNav from "../components/TopNav/TopNav";
import StockTicker from "../components/StockTicker/StockTicker";
import FeaturedRow from "../components/FeaturedRow/FeaturedRow";
import NewsGrid from "../components/NewsGrid/NewsGrid";
import Sidebar from "../components/Sidebar/Sidebar";
import CompanyUpdates from "../components/CompanyUpdates/CompanyUpdates";
import VideoGrid from "../components/VideoGrid/VideoGrid";
import Footer from "../components/Footer/Footer";

import * as mock from "../data/mockData";
import "../styles/layout.css";

const newsArticles = Array.isArray(mock.newsArticles) ? mock.newsArticles : [];
const companyPosts = Array.isArray(mock.companyPosts) ? mock.companyPosts : [];
const videos = Array.isArray(mock.videos) ? mock.videos : [];

const navCategories = ["all", "business", "economy", "trade", "market", "technology"];

export default function HomePage({ themeApi }) {
  const { language, t } = useLanguage();

  const [activeCategory, setActiveCategory] = useState("all");
  const [sidebarCategory, setSidebarCategory] = useState("all");
  const [page, setPage] = useState(1);

  // 2 rows only -> itemsPerPage depends on columns
  const getItemsPerPage = () => {
    const w = window.innerWidth;
    if (w < 600) return 2;      // 1 column x 2 rows
    if (w < 900) return 4;      // 2 columns x 2 rows
    return 6;                   // 3 columns x 2 rows
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

  const filteredNews = useMemo(() => {
    const base =
      activeCategory === "all"
        ? newsArticles
        : newsArticles.filter((n) => (n?.category || "").toLowerCase() === activeCategory);

    return base.filter((n) => (n?.language || "en") === language);
  }, [activeCategory, language]);

  const featured = useMemo(() => filteredNews.slice(0, 3), [filteredNews]);

  const totalPages = Math.max(1, Math.ceil(filteredNews.length / itemsPerPage));

  const pagedNews = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredNews.slice(start, start + itemsPerPage);
  }, [filteredNews, page, itemsPerPage]);

  const sidebarStories = useMemo(() => {
    const base =
      sidebarCategory === "all"
        ? newsArticles
        : newsArticles.filter((n) => (n?.category || "").toLowerCase() === sidebarCategory);

    return base
      .filter((n) => (n?.language || "en") === language)
      .slice(0, 4);
  }, [sidebarCategory, language]);

  const companyByLang = useMemo(
    () => companyPosts.filter((p) => (p?.language || "en") === language),
    [language]
  );

  const videosByLang = useMemo(
    () => videos.filter((v) => (v?.language || "en") === language),
    [language]
  );

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
                activeCategory === "all" ? t("topStories") : t(`categories.${activeCategory}`)
              }
            />

            {totalPages > 1 && (
              <div className="pager">
                <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                  ◀
                </button>

                <span className="pagerInfo">
                  {t("page")} {page} / {totalPages}
                </span>

                <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
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
