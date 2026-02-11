import { readAuth, logout } from "./auth";

const API_BASE =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

/* ================= HANDLE RESPONSE ================= */

const handleResponse = async (res) => {
  let data = {};

  try {
    data = await res.json();
  } catch {
    // response is not JSON
  }

  if (!res.ok) {
    if (res.status === 401) {
      logout?.(); // auto logout if unauthorized
    }

    throw new Error(data?.message || "Request failed");
  }

  return data;
};

/* ================= AUTH HEADERS ================= */

const getAuthHeaders = (requireToken = false) => {
  const auth = readAuth();

  if (requireToken && !auth?.token) {
    throw new Error("No token provided");
  }

  return {
    "Content-Type": "application/json",
    ...(auth?.token && {
      Authorization: `Bearer ${auth.token}`,
    }),
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

/* ================= NORMAL (token optional) ================= */

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
