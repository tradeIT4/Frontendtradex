import { readAuth } from "./auth";

/* ================= ENV API BASE ================= */
const API_BASE = process.env.REACT_APP_API_BASE_URL;

if (!API_BASE) {
  throw new Error(
    "❌ REACT_APP_API_BASE_URL is not defined in your .env file"
  );
}

/* ================= RESPONSE HANDLER ================= */
async function handleResponse(res) {
  const text = await res.text();

  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!res.ok) {
    console.error("❌ API ERROR:", res.status, data);
    throw new Error(data?.message || `Server error (${res.status})`);
  }

  return data;
}

/* ================= AUTH HEADER ================= */
function getAuthHeader() {
  const auth = readAuth();

  if (!auth?.token) {
    console.warn("⚠ No auth token found");
    return {};
  }

  return {
    Authorization: `Bearer ${auth.token}`,
  };
}

/* ================= GET ================= */
export async function apiSubscriberGet(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });

  return handleResponse(res);
}

/* ================= POST ================= */
export async function apiSubscriberPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(body),
  });

  return handleResponse(res);
}
