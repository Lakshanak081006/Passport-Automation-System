import api from "./api";

export const register = (data) => api.post("/auth/register", data).then((r) => r.data);

export const login = (email, password) =>
  api.post("/auth/login", { email, password }).then((r) => r.data);

export function saveSession(data) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data));
}

export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function loadSession() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user && localStorage.getItem("token") ? user : null;
  } catch {
    return null;
  }
}
