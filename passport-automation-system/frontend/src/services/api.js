import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

// Attach the JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the token expired / is invalid, log the user out
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isAuthCall = err.config?.url?.includes("/auth/");
    if (err.response?.status === 401 && !isAuthCall) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// Turns an Axios error into a readable message
export function errorMessage(err) {
  if (err.response?.data?.message) return err.response.data.message;
  if (err.request) return "Cannot reach the server. Is the backend running on port 8080?";
  return "Something went wrong. Please try again.";
}

// Field-level errors from the backend validation ({ field: message })
export function fieldErrors(err) {
  return err.response?.data?.errors || {};
}

export default api;
