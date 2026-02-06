import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import "./Sidebar.css";

export default function Sidebar({
  categories = [],
  value,
  onChange,
  stories = [],
}) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <aside className="sidebar">
      <h3>{t("category")}</h3>

      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {categories.map((c) => (
          <option key={c} value={c}>
            {t(`categories.${c}`)}
          </option>
        ))}
      </select>

      <ul className="sidebarList">
        {stories.slice(0, 4).map((s) => (
          <li
            key={s.id}
            onClick={() => navigate(`/article/${s.id}`)}
          >
            {s.title}
          </li>
        ))}
      </ul>
    </aside>
  );
}
