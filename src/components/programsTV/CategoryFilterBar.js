import React from "react";
import "../../styles/programsTv.css";

export default function CategoryFilterBar({ categories, active, setActive }) {
  return (
    <div className="ptvFilterBar">
      <div className="ptvFilterInner">
        <button
          className={`ptvChip ${active === "All" ? "active" : ""}`}
          onClick={() => setActive("All")}
        >
          All
        </button>

        {categories.map((c) => (
          <button
            key={c}
            className={`ptvChip ${active === c ? "active" : ""}`}
            onClick={() => setActive(c)}
            title={c}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
