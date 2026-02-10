import React from "react";
import { logout, readAuth } from "../services/auth";
import { useNavigate } from "react-router-dom";

export default function SubscriberDashboard() {
  const auth = readAuth();
  const navigate = useNavigate();

  return (
    <div className="adminPage">
      <header className="adminTopBar">
        <span>Subscriber Dashboard</span>
        <button
          className="adminLogoutBtn"
          onClick={() => {
            logout();
            navigate("/subscriber/login");
          }}
        >
          Logout
        </button>
      </header>

      <div className="adminStats">
        <div className="statCard">
          <h3>Welcome</h3>
          <strong>{auth.fullname}</strong>
        </div>
      </div>
    </div>
  );
}
