import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import ReactCountryFlag from "react-country-flag";
import "./TopNav.css";

export default function TopNav({
  categories = [],
  activeCategory,
  onCategoryChange,
  themeApi,
  compact = false,
}) {
  const navigate = useNavigate();
  const { language, changeLanguage, t } = useLanguage();

  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const isDark = themeApi.theme === "dark";

  const handleCategoryClick = (cat) => {
    onCategoryChange?.(cat);
    setMenuOpen(false);
    navigate(`/category/${cat}`);
  };

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
    setLangOpen(false);
  };

  return (
    <header className="topNav">
      {/* ───────────────── TOP ROW ───────────────── */}
      <div className="topNav__row topNav__row--top">
        {/* Logo */}
        <div className="brand" onClick={() => navigate("/")}>
          <span className="brand__logo">⬣</span>
          <span className="brand__name">TradeX</span>
        </div>

        {/* Right controls */}
        <div className="rightControls">
          {/* Desktop auth */}
          <div className="desktopOnly">
            <NavLink to="/signin" className="linkBtn">
              {t("signIn")}
            </NavLink>
            <NavLink to="/signup" className="linkBtn">
              {t("signUp")}
            </NavLink>
            <NavLink to="/subscribe" className="primaryBtn">
              {t("subscribe")}
            </NavLink>
          </div>

          {/* Language */}
          <div className="langWrap">
            <button
              className="langBtn"
              onClick={() => setLangOpen((v) => !v)}
            >
              <ReactCountryFlag
                countryCode={language === "en" ? "GB" : "ET"}
                svg
                style={{ width: 20, height: 14, marginRight: 6 }}
              />
              {language === "en" ? "English" : "አማርኛ"} ▼
            </button>

            {langOpen && (
              <div className="langMenu">
                <button onClick={() => handleLanguageChange("en")}>
                  🇬🇧 English
                </button>
                <button onClick={() => handleLanguageChange("am")}>
                  🇪🇹 አማርኛ
                </button>
              </div>
            )}
          </div>

          {/* Theme */}
          <button
            className="themeBtn"
            onClick={themeApi.toggleTheme}
          >
            {isDark ? "☀" : "☾"}
          </button>

          {/* Mobile menu */}
          <button
            className="hamburger mobileOnly"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* ───────────────── DESKTOP NAV ───────────────── */}
      <div className="topNav__row topNav__row--bottom desktopOnly">
        <nav className={`cats ${compact ? "cats--compact" : ""}`}>
          {categories.map((cat) => (
            <NavLink
              key={cat}
              to={`/category/${cat}`}
              className={({ isActive }) =>
                `catItem ${isActive ? "isActive" : ""}`
              }
              onClick={() => onCategoryChange?.(cat)}
            >
              {t(cat)}
            </NavLink>
          ))}

          {/* 🎥 Video */}
          <NavLink to="/programs-tv" className="catItem navVideo">
            {t("video")}
          </NavLink>
        </nav>
      </div>

      {/* ───────────────── MOBILE MENU ───────────────── */}
      {menuOpen && (
        <div className="mobileMenu">
          <div className="mobileSection">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`mobileCat ${
                  cat === activeCategory ? "active" : ""
                }`}
                onClick={() => handleCategoryClick(cat)}
              >
                {t(cat)}
              </button>
            ))}

            <button
              className="mobileCat"
              onClick={() => {
                setMenuOpen(false);
                navigate("/programs-tv");
              }}
            >
              🎥 {t("video")}
            </button>
          </div>

          <div className="mobileSection">
            <NavLink to="/signin" className="mobileBtn">
              {t("signIn")}
            </NavLink>
            <NavLink to="/signup" className="mobileBtn">
              {t("signUp")}
            </NavLink>
            <NavLink to="/subscribe" className="mobileBtn primary">
              {t("subscribe")}
            </NavLink>
          </div>

          <div className="mobileSection">
            <button
              className="mobileBtn"
              onClick={() => handleLanguageChange("en")}
            >
              🇬🇧 English
            </button>
            <button
              className="mobileBtn"
              onClick={() => handleLanguageChange("am")}
            >
              🇪🇹 አማርኛ
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
