import React, { useMemo, useState } from "react";
import ProgramsHeader from "../components/programsTV/ProgramsHeader";
import CategoryFilterBar from "../components/programsTV/CategoryFilterBar";
import VideoRow from "../components/programsTV/VideoRow";
import {
  featuredTvId,
  programCategories,
  tvNavLinks,
  tvVideos,
} from "../data/programsTvData";
import "../styles/programsTv.css";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTelegramPlane,
  FaGlobe,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

export default function ProgramsTVPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  /* =========================
     FEATURED PROGRAM
  ========================== */
  const featured = useMemo(() => {
    if (!tvVideos || tvVideos.length === 0) return null;
    return (
      tvVideos.find((v) => v.id === featuredTvId) ||
      tvVideos[0]
    );
  }, [featuredTvId]);

  /* =========================
     FILTERED PROGRAMS
  ========================== */
  const filtered = useMemo(() => {
    if (!tvVideos) return [];

    const q = search.trim().toLowerCase();

    return tvVideos.filter((v) => {
      const matchesCategory =
        activeCategory === "All" || v.category === activeCategory;

      const searchableText = `
        ${v.title || ""}
        ${v.category || ""}
        ${v.host || ""}
        ${v.venue || ""}
      `
        .toLowerCase()
        .trim();

      const matchesSearch = q ? searchableText.includes(q) : true;

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  /* =========================
     GROUP BY CATEGORY
  ========================== */
  const grouped = useMemo(() => {
    const byCat = new Map();

    programCategories.forEach((cat) => {
      byCat.set(cat, []);
    });

    filtered.forEach((video) => {
      if (!byCat.has(video.category)) {
        byCat.set(video.category, []);
      }
      byCat.get(video.category).push(video);
    });

    return byCat;
  }, [filtered]);

  /* =========================
     SAFETY CHECK
  ========================== */
  if (!featured) {
    return (
      <div className="ptvPage">
        <div className="ptvEmpty">
          <div className="ptvEmptyTitle">No programs available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="ptvPage">
      <ProgramsHeader
        links={tvNavLinks}
        search={search}
        setSearch={setSearch}
      />

      <CategoryFilterBar
        categories={programCategories}
        active={activeCategory}
        setActive={setActiveCategory}
      />

      {/* ================= HERO ================= */}
      <section className="ptvHero">
        <div className="ptvHeroBg">
          <img
            className="ptvHeroImg"
            src={featured.thumbnail}
            alt={featured.title}
          />
          <div className="ptvHeroOverlay" />
        </div>

        <div className="ptvHeroContent">
          <div className="ptvHeroKicker">
            Featured • {featured.category}
          </div>

          <h1 className="ptvHeroTitle">{featured.title}</h1>

          <div className="ptvHeroMeta">
            <span>{featured.dateTime}</span>
            <span className="dot">•</span>
            <span>{featured.venue}</span>
            <span className="dot">•</span>
            <span>Host: {featured.host}</span>
          </div>

          <p className="ptvHeroDesc">{featured.description}</p>

          <div className="ptvHeroActions">
            <a
              className="ptvBtnPrimary"
              href={`/programs-tv/watch/${featured.id}`}
            >
              ▶ Watch
            </a>

            <button
              className="ptvBtnGhost"
              onClick={() =>
                setActiveCategory(featured.category)
              }
            >
              Filter this program
            </button>
          </div>
        </div>
      </section>

      {/* ================= MAIN ================= */}
      <main className="ptvMain">
        {programCategories.map((cat) => {
          const items = grouped.get(cat) || [];
          if (items.length === 0) return null;

          return (
            <VideoRow
              key={cat}
              title={cat}
              videos={items}
            />
          );
        })}

        {filtered.length === 0 && (
          <div className="ptvEmpty">
            <div className="ptvEmptyTitle">
              No programs found
            </div>
            <div className="ptvEmptyHint">
              Try a different keyword or category.
            </div>
          </div>
        )}
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="ptvFooter">
        <div className="ptvFooterContainer">

          {/* Brand */}
          <div className="ptvFooterCol">
            <div className="ptvFooterBrand">
              TradeX TV
            </div>
            <p className="ptvFooterText">
              Bringing business, education, and innovation
              programs to viewers across Ethiopia and beyond.
            </p>
          </div>

          {/* Contact */}
          <div className="ptvFooterCol">
            <div className="ptvFooterTitle">
              Contact
            </div>

            <div className="ptvFooterItem">
              <FaMapMarkerAlt /> Ethiopia, Addis Ababa
            </div>

            <div className="ptvFooterItem">
              <FaPhoneAlt /> +251 900 000 000
            </div>

            <div className="ptvFooterItem">
              <FaEnvelope /> info@tradextv.com
            </div>
          </div>

          {/* Social */}
          <div className="ptvFooterCol">
            <div className="ptvFooterTitle">
              Follow Us
            </div>

            <div className="ptvFooterSocial">
              <a
                href="#"
                className="ptvSocialIcon"
                aria-label="Website"
              >
                <FaGlobe />
              </a>
              <a
                href="#"
                className="ptvSocialIcon"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="ptvSocialIcon"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                className="ptvSocialIcon"
                aria-label="YouTube"
              >
                <FaYoutube />
              </a>
              <a
                href="#"
                className="ptvSocialIcon"
                aria-label="Telegram"
              >
                <FaTelegramPlane />
              </a>
            </div>
          </div>
        </div>

        <div className="ptvFooterBottom">
          © {new Date().getFullYear()} TradeX TV. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
