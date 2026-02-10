import React from "react";
import { readAuth, logout } from "../services/auth";
import { useNavigate, Link, Navigate } from "react-router-dom";

export default function SubscriberPendingPage() {
  const auth = readAuth();
  const navigate = useNavigate();

  if (!auth) {
    return <Navigate to="/subscriber/login" replace />;
  }

  return (
    <div className="subscriberPage">
      <div className="subscriberCard">
        <h1>
          {auth.status === "pending"
            ? "Approval Pending"
            : "Access Restricted"}
        </h1>

        {auth.status === "pending" && (
          <>
            <p>Please wait for admin approval.</p>

            <p style={{ marginTop: 8, opacity: 0.8 }}>
              You can go back to the home page until your account is approved.
            </p>
          </>
        )}

        {auth.status === "rejected" && (
          <p>
            Your account was rejected.
            <br />
            Please contact support or wait for re-approval.
          </p>
        )}

        {/* Back to Home */}
        <Link
          to="/"
          style={{
            display: "inline-block",
            marginTop: 14,
            fontWeight: 500,
          }}
        >
          ← Back to Home
        </Link>

        <button
          style={{ marginTop: 16 }}
          onClick={() => {
            logout();
            navigate("/subscriber/login");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
