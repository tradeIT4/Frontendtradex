import React from "react";
import "../styles/about.css";

export default function AboutPage() {
  return (
    <div className="aboutPage">

      {/* HERO */}
      <section className="aboutHero">
        <div className="aboutHeroContent">
          <h1>About TradeX TV</h1>
          <p>
            TradeX TV is a premium business television network delivering
            trusted market intelligence, capital insights, and enterprise
            storytelling across Africa and global markets.
          </p>
        </div>
      </section>

      {/* MISSION */}
      <section className="aboutSection">
        <div className="aboutContainer">
          <h2>Our Mission</h2>
          <p>
            To provide accurate, professional, and real-time business
            programming that empowers entrepreneurs, investors,
            policymakers, and the diaspora community.
          </p>
        </div>
      </section>

      {/* VISION */}
      <section className="aboutSection dark">
        <div className="aboutContainer">
          <h2>Our Vision</h2>
          <p>
            To become Africa’s leading business media platform,
            connecting capital, trade, innovation, and enterprise
            through world-class digital broadcasting.
          </p>
        </div>
      </section>

      {/* WHAT WE OFFER */}
      <section className="aboutSection">
        <div className="aboutContainer">
          <h2>What We Offer</h2>

          <div className="aboutGrid">

            <div className="aboutCard">
              <h3>📺 Live Broadcasting</h3>
              <p>
                Daily live shows covering market updates,
                capital trends, trade corridors, and economic reforms.
              </p>
            </div>

            <div className="aboutCard">
              <h3>📊 Market Intelligence</h3>
              <p>
                Deep analysis of currency, stock indices,
                logistics, property, and agri-business.
              </p>
            </div>

            <div className="aboutCard">
              <h3>🌍 Diaspora Programs</h3>
              <p>
                Investment insights for diaspora communities
                and global business stakeholders.
              </p>
            </div>

            <div className="aboutCard">
              <h3>🎙 Business Storytelling</h3>
              <p>
                Showcasing entrepreneurs, innovators,
                and transformative business leaders.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="aboutSection dark">
        <div className="aboutContainer">
          <h2>Core Values</h2>

          <ul className="aboutValues">
            <li>✔ Integrity & Transparency</li>
            <li>✔ Professional Journalism</li>
            <li>✔ Economic Empowerment</li>
            <li>✔ Innovation & Technology</li>
            <li>✔ Global Perspective</li>
          </ul>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="aboutFooter">
        © 2026 TradeX TV. All rights reserved.
      </footer>

    </div>
  );
}
