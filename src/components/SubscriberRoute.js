import { Navigate } from "react-router-dom";
import { readAuth } from "../services/auth";

export default function SubscriberRoute({ children }) {
  const auth = readAuth();

  // Not logged in
  if (!auth || auth.role !== "subscriber") {
    return <Navigate to="/subscriber/login" replace />;
  }

  // Logged in but NOT approved
  if (auth.status !== "approved") {
    return <Navigate to="/subscriber/pending" replace />;
  }

  // Approved subscriber
  return children;
}
