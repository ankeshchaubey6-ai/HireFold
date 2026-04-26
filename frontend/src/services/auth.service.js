import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: `${BASE_URL}/auth`,
  withCredentials: true,
});

// Attach token to every auth request too
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("hirefold_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = async (data) => {
  try {
    const res = await API.post("/register", data);
    if (res.data?.token) {
      localStorage.setItem("hirefold_token", res.data.token);
    }
    return res.data;
  } catch (err) {
    return err.response?.data || { success: false, error: "NETWORK_ERROR", message: "Network error" };
  }
};

export const loginUser = async (data) => {
  try {
    const res = await API.post("/login", data);
    if (res.data?.token) {
      localStorage.setItem("hirefold_token", res.data.token);
    }
    return res.data;
  } catch (err) {
    return err.response?.data || { success: false, error: "NETWORK_ERROR", message: "Network error" };
  }
};

export const googleLoginUser = async (data) => {
  try {
    const res = await API.post("/google", data);
    if (res.data?.token) {
      localStorage.setItem("hirefold_token", res.data.token);
    }
    return res.data;
  } catch (err) {
    return err.response?.data || { success: false, error: "NETWORK_ERROR", message: "Network error" };
  }
};

export const getCurrentUser = async () => {
  try {
    const res = await API.get("/me");
    return res.data;
  } catch (err) {
    return err.response?.data || { success: false, error: "NETWORK_ERROR", message: "Network error" };
  }
};

export const logoutUser = async () => {
  try {
    const res = await API.post("/logout");
    localStorage.removeItem("hirefold_token");
    return res.data;
  } catch (err) {
    localStorage.removeItem("hirefold_token");
    return err.response?.data || { success: false, error: "NETWORK_ERROR", message: "Network error" };
  }
};