import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiPost } from "../services/api";
import { saveAuth } from "../services/auth";
import "../styles/subscriber.css";

export default function SubscriberLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiPost("/api/subscribers/login", {
        email,
        password,
      });

      saveAuth(data);

      if (data.status === "approved") {
        navigate("/subscriber/dashboard", { replace: true });
      } else {
        navigate("/subscriber/pending", { replace: true });
      }
    } catch (err) {
      console.error(err);
      setError(err?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="subscriberPage">
      
      {/* 🔙 Back to Home */}
      

      <form className="subscriberCard" onSubmit={submit}>
        <h1>Subscriber Login</h1>
        <p>Access your TradeX account</p>

        {error && <div className="adminError">{error}</div>}

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>

        <span className="formHint">
          New subscriber? <Link to="/subscribe">Create account</Link>
          <div className="backHome">
        <Link to="/">← Back to Home</Link>
      </div>
        </span>
      </form>
    </div>
  );
}
