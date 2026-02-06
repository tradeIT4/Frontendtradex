const KEY = "tradex_auth";

export function saveAuth(payload) {
  localStorage.setItem(KEY, JSON.stringify(payload));
}

export function readAuth() {
  try {
    return JSON.parse(localStorage.getItem(KEY));
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem(KEY);
}
