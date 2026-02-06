import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TopNav from "../components/TopNav/TopNav";
import Footer from "../components/Footer/Footer";
import { apiPost } from "../services/api";
import { saveAuth } from "../services/auth";

const navCategories = ["All", "Business", "Economy", "Trade", "Market", "Technology"];

export default function SignUpPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const themeApi = {
    theme: document.documentElement.getAttribute("data-theme"),
    toggleTheme: () => {
      const next =
        document.documentElement.getAttribute("data-theme") === "dark"
          ? "light"
          : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("tradex_theme", next);
    },
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiPost("/api/auth/register", { name, email, password });
      saveAuth(data);
      navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="appShell">
      <TopNav
        categories={navCategories}
        activeCategory="All"
        onCategoryChange={() => {}}
        themeApi={themeApi}
        compact
      />

      <main className="page authPage">
        <div className="authCard">
          <h1 className="authTitle">Create Account</h1>
          <p className="authSub">Join TradeX for trusted business intelligence.</p>

          {error && <div className="authError">{error}</div>}

          <form className="authForm" onSubmit={onSubmit}>
            <label>
              Full Name
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>

            <label>
              Email
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </label>

            <button className="primaryBtn full" disabled={loading}>
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </form>

          <p className="authFooter">
            Already have an account? <Link to="/signin">Sign in</Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
