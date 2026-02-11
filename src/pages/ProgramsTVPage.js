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

  const featured = useMemo(
    () => tvVideos.find((v) => v.id === featuredTvId) || tvVideos[0],
    []
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return tvVideos.filter((v) => {
      const matchesCategory =
        activeCategory === "All" ? true : v.category === activeCategory;

      const matchesSearch = q
        ? (
            v.title +
            " " +
            v.category +
            " " +
            v.host +
            " " +
            v.venue
          )
            .toLowerCase()
            .includes(q)
        : true;

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  const grouped = useMemo(() => {
    const byCat = new Map(programCategories.map((c) => [c, []]));
    filtered.forEach((v) => {
      if (!byCat.has(v.category)) byCat.set(v.category, []);
      byCat.get(v.category).push(v);
    });
    return byCat;
  }, [filtered]);

  return (
    <div className="ptvPage">
      <ProgramsHeader links={tvNavLinks} search={search} setSearch={setSearch} />

      <CategoryFilterBar
        categories={programCategories}
        active={activeCategory}
        setActive={setActiveCategory}
      />

      {/* HERO */}
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
              onClick={() => setActiveCategory(featured.category)}
            >
              Filter this program
            </button>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <main className="ptvMain">
        {programCategories.map((cat) => {
          const items = grouped.get(cat) || [];
          if (items.length === 0) return null;
          return <VideoRow key={cat} title={cat} videos={items} />;
        })}

        {filtered.length === 0 && (
          <div className="ptvEmpty">
            <div className="ptvEmptyTitle">No programs found</div>
            <div className="ptvEmptyHint">
              Try a different keyword or category.
            </div>
          </div>
        )}
      </main>

      {/* PREMIUM FOOTER */}
      <footer className="ptvFooter">
        <div className="ptvFooterContainer">

          {/* Brand */}
          <div className="ptvFooterCol">
            <div className="ptvFooterBrand">TradeX TV</div>
            <p className="ptvFooterText">
              Bringing business, education, and innovation programs
              to viewers across Ethiopia and beyond.
            </p>
          </div>

          {/* Contact */}
          <div className="ptvFooterCol">
            <div className="ptvFooterTitle">Contact</div>

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
            <div className="ptvFooterTitle">Follow Us</div>

            <div className="ptvFooterSocial">
              <a href="#" className="ptvSocialIcon"><FaGlobe /></a>
              <a href="#" className="ptvSocialIcon"><FaFacebookF /></a>
              <a href="#" className="ptvSocialIcon"><FaInstagram /></a>
              <a href="#" className="ptvSocialIcon"><FaYoutube /></a>
              <a href="#" className="ptvSocialIcon"><FaTelegramPlane /></a>
            </div>
          </div>

        </div>

        <div className="ptvFooterBottom">
          © 2026 TradeX TV. All rights reserved.
        </div>
      </footer>

    </div>
  );
}
