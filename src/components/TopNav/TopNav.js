import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const { language, changeLanguage, t } = useLanguage();

  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const langRef = useRef(null);

  const isDark = themeApi?.theme === "dark";

  /* ================= CLOSE DROPDOWN ON OUTSIDE CLICK ================= */
  useEffect(() => {
    function handleClickOutside(e) {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= CLOSE MOBILE MENU ON ROUTE CHANGE ================= */
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  /* ================= CATEGORY CLICK ================= */
  const handleCategoryClick = (cat) => {
    onCategoryChange?.(cat);
    navigate(`/category/${cat}`);
  };

  /* ================= LANGUAGE ================= */
  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
    setLangOpen(false);
  };

  return (
    <header className="topNav">
      {/* ================= TOP ROW ================= */}
      <div className="topNav__row topNav__row--top">
        {/* Logo */}
        <div className="brand" onClick={() => navigate("/")}>
          <span className="brand__logo">⬣</span>
          <span className="brand__name">TradeX</span>
        </div>

        <div className="rightControls">
          {/* Desktop Auth */}
          <div className="desktopOnly">
            <NavLink to="/signin" className="linkBtn">
              {t("signIn")}
            </NavLink>

            <NavLink to="/signup" className="linkBtn">
              {t("signUp")}
            </NavLink>

            <NavLink to="/subscriber/register" className="primaryBtn">
              {t("subscribe")}
            </NavLink>
          </div>

          {/* Language */}
          <div className="langWrap" ref={langRef}>
            <button
              className="langBtn"
              onClick={() => setLangOpen((v) => !v)}
            >
              <ReactCountryFlag
                countryCode={language === "en" ? "GB" : "ET"}
                svg
                style={{ width: 20, height: 14, marginRight: 6 }}
              />
              {language === "en" ? "English" : "አማርኛ"}
              <span className="caret">▼</span>
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

          {/* Theme Toggle */}
          <button
            className="themeBtn"
            onClick={() => themeApi?.toggleTheme?.()}
          >
            {isDark ? "☀" : "☾"}
          </button>

          {/* Mobile Hamburger */}
          <button
            className="hamburger mobileOnly"
            onClick={() => setMenuOpen((v) => !v)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* ================= DESKTOP NAV ================= */}
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

          {/* Programs / TV */}
          <NavLink to="/programs-tv" className="catItem navVideo">
            🎥 {t("video")}
          </NavLink>
        </nav>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {menuOpen && (
        <div className="mobileMenu">
          {/* Categories */}
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
              onClick={() => navigate("/programs-tv")}
            >
              🎥 {t("video")}
            </button>
          </div>

          {/* Auth */}
          <div className="mobileSection">
            <NavLink to="/signin" className="mobileBtn">
              {t("signIn")}
            </NavLink>

            <NavLink to="/signup" className="mobileBtn">
              {t("signUp")}
            </NavLink>

            <NavLink to="/subscriber/register" className="mobileBtn primary">
              {t("subscribe")}
            </NavLink>
          </div>

          {/* Language */}
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
