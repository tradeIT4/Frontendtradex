import React from "react";
import { NavLink } from "react-router-dom";
import "../../styles/programsTv.css";

export default function ProgramsHeader({ links, search, setSearch }) {
  return (
    <div className="ptvHeader">
      <div className="ptvHeaderInner">
        <div className="ptvBrand">
          <div className="ptvLogo" aria-hidden="true">TX</div>
          <div className="ptvBrandText">
            <div className="ptvBrandName">TradeX TV</div>
            <div className="ptvBrandTag">Business Television Network</div>
          </div>
        </div>

        <nav className="ptvNav">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className="ptvNavLink">
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="ptvSearchWrap">
          <input
            className="ptvSearch"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search programs, hosts, venues…"
            aria-label="Search programs"
          />
        </div>
      </div>
    </div>
  );
}
