
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    const token = localStorage.getItem("hirefold_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject({
        success: false,
        error: "NETWORK_ERROR",
        message: "Backend unreachable",
      });
    }
    const { status, data } = error.response;
    if (status === 401) {
      localStorage.removeItem("hirefold_token");
    }
    return Promise.reject(data || { success: false, message: "Unknown server error" });
  }
);

export default api;