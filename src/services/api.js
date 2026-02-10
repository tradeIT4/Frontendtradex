// src/services/api.js
import { readAuth } from "./auth";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
};

const withAuthHeaders = () => {
  const auth = readAuth();

  // 🔥 If token missing, your admin UI should not call protected APIs
  if (!auth?.token) {
    throw new Error("No token provided");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${auth.token}`,
  };
};

export const apiGet = async (path) => {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: withAuthHeaders(),
  });
  return handleResponse(res);
};

export const apiPost = async (path, body) => {
  // POST is used for login/register too, so token is optional here
  const auth = readAuth();
  const headers = {
    "Content-Type": "application/json",
    ...(auth?.token ? { Authorization: `Bearer ${auth.token}` } : {}),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  return handleResponse(res);
};

export const apiPut = async (path, body) => {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PUT",
    headers: withAuthHeaders(),
    body: JSON.stringify(body),
  });
  return handleResponse(res);
};
