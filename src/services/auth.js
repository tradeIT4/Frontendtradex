// src/services/auth.js
const KEY = "auth";

export const saveAuth = (data) => {
  localStorage.setItem(KEY, JSON.stringify(data));
};

export const readAuth = () => {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
};

export const logout = () => {
  localStorage.removeItem(KEY);
};
