// src/pages/AdminLoginPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiPost } from "../services/api";
import { saveAuth } from "../services/auth";
import "../styles/subscriber.css"; // reuse nice auth UI

export default function AdminLoginPage() {
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
      const data = await apiPost("/api/auth/admin/login", { email, password });

      // ✅ MUST CONTAIN token + role:"admin"
      saveAuth(data);

      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.message || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="subscriberPage">
      <form className="subscriberCard" onSubmit={submit}>
        <h1>Admin Login</h1>
        <p>TradeX Administration</p>

        {error && <div className="adminError">{error}</div>}

        <input
          type="email"
          placeholder="Admin Email"
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

        <button disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
