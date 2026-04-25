





import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
  withCredentials: true,
});

export const registerUser = async (data) => {
  try {
    const res = await API.post("/register", data);
    return res.data;
  } catch (err) {
    if (err.response && err.response.data) {
      return err.response.data;
    }
    return { success: false, error: "NETWORK_ERROR", message: "Network error" };
  }
};

export const loginUser = async (data) => {
  try {
    const res = await API.post("/login", data);
    return res.data;
  } catch (err) {
    if (err.response && err.response.data) {
      return err.response.data;
    }
    return { success: false, error: "NETWORK_ERROR", message: "Network error" };
  }
};

export const googleLoginUser = async (data) => {
  try {
    const res = await API.post("/google", data);
    return res.data;
  } catch (err) {
    if (err.response && err.response.data) {
      return err.response.data;
    }
    return { success: false, error: "NETWORK_ERROR", message: "Network error" };
  }
};

export const getCurrentUser = async () => {
  try {
    const res = await API.get("/me");
    return res.data;
  } catch (err) {
    if (err.response && err.response.data) {
      return err.response.data;
    }
    return { success: false, error: "NETWORK_ERROR", message: "Network error" };
  }
};

export const logoutUser = async () => {
  try {
    const res = await API.post("/logout");
    return res.data;
  } catch (err) {
    if (err.response && err.response.data) {
      return err.response.data;
    }
    return { success: false, error: "NETWORK_ERROR", message: "Network error" };
  }
};