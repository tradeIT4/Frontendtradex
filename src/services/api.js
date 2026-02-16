import { readAuth, logout } from "./auth";

/* ================= ENV CONFIG ================= */

const API_BASE = process.env.REACT_APP_API_URL;

if (!API_BASE) {
  throw new Error(
    "❌ REACT_APP_API_URL is not defined. Please set it in your .env file."
  );
}

/* ================= HANDLE RESPONSE ================= */

const handleResponse = async (res) => {
  let data = {};

  try {
    data = await res.json();
  } catch {
    // ignore if response is not JSON
  }

  // Auto logout on 401 or 403
  if (res.status === 401 || res.status === 403) {
    logout?.();
    window.location.href = "/admin/login";
    throw new Error("Session expired. Please login again.");
  }

  if (!res.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
};

/* ================= AUTH HEADERS ================= */

const getAuthHeaders = (requireToken = false) => {
  const auth = readAuth?.();
  const token = auth?.token;

  if (requireToken && !token) {
    logout?.();
    window.location.href = "/admin/login";
    throw new Error("Authentication required");
  }

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/* ================= GENERIC REQUEST ================= */

const request = async (
  method,
  path,
  body = null,
  requireToken = false
) => {
  const options = {
    method,
    headers: getAuthHeaders(requireToken),
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE}${path}`, options);
  return handleResponse(res);
};

/* ================= PUBLIC ================= */

export const apiPublicGet = (path) =>
  request("GET", path);

/* ================= NORMAL ================= */

export const apiGet = (path) =>
  request("GET", path);

export const apiPost = (path, body) =>
  request("POST", path, body);

export const apiPut = (path, body) =>
  request("PUT", path, body);

export const apiDelete = (path) =>
  request("DELETE", path);

/* ================= ADMIN (token required) ================= */

export const apiAdminGet = (path) =>
  request("GET", path, null, true);

export const apiAdminPost = (path, body) =>
  request("POST", path, body, true);

export const apiAdminPut = (path, body) =>
  request("PUT", path, body, true);

export const apiAdminDelete = (path) =>
  request("DELETE", path, null, true);
