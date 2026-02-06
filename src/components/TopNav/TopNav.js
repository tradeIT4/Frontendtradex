import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import ReactCountryFlag from "react-country-flag";
import "./TopNav.css";

export default function TopNav({
  categories,
  activeCategory,
  onCategoryChange,
  themeApi,
  compact = false,
}) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { language, changeLanguage, t } = useLanguage(); // <- add t
  const [langOpen, setLangOpen] = useState(false);

  const isDark = themeApi.theme === "dark";

  const handleCategoryClick = (cat) => {
    onCategoryChange(cat);
    setMenuOpen(false);
    navigate("/");
  };

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
    setLangOpen(false);
    navigate("/");
  };

  return (
    <header className="topNav">
      {/* ROW 1 */}
      <div className="topNav__row topNav__row--top">
        <div className="brand" onClick={() => navigate("/")}>
          <span className="brand__logo">⬣</span>
          <span className="brand__name">TradeX</span>
        </div>

        <div className="rightControls">
          <div className="desktopOnly">
            <button className="linkBtn" onClick={() => navigate("/signin")}>
              {t("signIn")}
            </button>
            <button className="linkBtn" onClick={() => navigate("/signup")}>
              {t("signUp")}
            </button>
            <button className="primaryBtn">{t("subscribe")}</button>
          </div>

          {/* Language dropdown */}
          <div className="langWrap">
            <button
              className="langBtn"
              onClick={() => setLangOpen((v) => !v)}
              aria-label="Language"
            >
              <ReactCountryFlag
                countryCode={language === "en" ? "GB" : "ET"}
                svg
                style={{ width: "20px", height: "14px", marginRight: "6px" }}
              />
              {language === "en" ? "English" : "አማርኛ"} ▼
            </button>

            {langOpen && (
              <div className="langMenu">
                <button onClick={() => handleLanguageChange("en")}>
                  <ReactCountryFlag
                    countryCode="GB"
                    svg
                    style={{ width: "20px", height: "14px", marginRight: "6px" }}
                  />
                  English
                </button>
                <button onClick={() => handleLanguageChange("am")}>
                  <ReactCountryFlag
                    countryCode="ET"
                    svg
                    style={{ width: "20px", height: "14px", marginRight: "6px" }}
                  />
                  አማርኛ
                </button>
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button
            className="themeBtn"
            onClick={themeApi.toggleTheme}
            aria-label="Toggle theme"
          >
            {isDark ? "☀" : "☾"}
          </button>

          {/* Hamburger (mobile) */}
          <button
            className="hamburger mobileOnly"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            ☰
          </button>
        </div>
      </div>

      {/* ROW 2 desktop categories */}
      <div className="topNav__row topNav__row--bottom desktopOnly">
        <nav className={`cats ${compact ? "cats--compact" : ""}`}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`catItem ${cat === activeCategory ? "isActive" : ""}`}
              onClick={() => handleCategoryClick(cat)}
            >
              {t(`${cat}`)} {/* <- translation */}
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile menu */}
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
                {t(`categories.${cat}`)} {/* <- translation */}
              </button>
            ))}
          </div>

          <div className="mobileSection">
            <button className="mobileBtn" onClick={() => navigate("/signin")}>
              {t("signIn")}
            </button>
            <button className="mobileBtn" onClick={() => navigate("/signup")}>
              {t("signUp")}
            </button>
            <button className="mobileBtn primary">{t("subscribe")}</button>
          </div>

          {/* Mobile Language selector */}
          <div className="mobileSection">
            <button
              className="mobileBtn"
              onClick={() => handleLanguageChange("en")}
            >
              <ReactCountryFlag
                countryCode="GB"
                svg
                style={{ width: "20px", height: "14px", marginRight: "6px" }}
              />
              English
            </button>
            <button
              className="mobileBtn"
              onClick={() => handleLanguageChange("am")}
            >
              <ReactCountryFlag
                countryCode="ET"
                svg
                style={{ width: "20px", height: "14px", marginRight: "6px" }}
              />
              አማርኛ
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
