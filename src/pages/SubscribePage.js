import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiPost } from "../services/api";
import "../styles/subscriber.css";

export default function SubscribePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    company: "",
    fullname: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await apiPost("/api/subscribers/register", form);

      // ✅ success → redirect to login
      navigate("/subscriber/login");
    } catch (err) {
      setError(err?.message || "Subscription failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="subscriberPage">
      <form className="subscriberCard" onSubmit={submit}>
        <h1>Subscribe to TradeX</h1>
        <p>Access premium business & trade intelligence</p>

        {error && <div className="subscriberError">{error}</div>}

        <input
          name="company"
          placeholder="Company Name"
          value={form.company}
          onChange={handleChange}
          required
        />

        <input
          name="fullname"
          placeholder="Full Name"
          value={form.fullname}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="phone"
          type="tel"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <span className="formHint">
          Already a subscriber? <a href="/subscriber/login">Login</a>
          
        </span>
        
      </form>
    </div>
  );
}
