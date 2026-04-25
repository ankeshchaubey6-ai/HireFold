import axios from "axios";

/* =========================================================
   BASE URL (MUST MATCH BACKEND DOMAIN)
========================================================= */
const BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,

  
  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },

  
  timeout: 15000,
});

/* =========================================================
   REQUEST INTERCEPTOR
========================================================= */
api.interceptors.request.use(
  (config) => {
    config.withCredentials = true; //  FORCE EVERY REQUEST

    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================================================
   RESPONSE INTERCEPTOR
========================================================= */
api.interceptors.response.use(
  (response) => {

    return response;
  },
  (error) => {
    if (!error.response) {

      return Promise.reject({
        success: false,
        error: "NETWORK_ERROR",
        message: "Backend unreachable",
      });
    }

    const { status, data, config } = error.response;

    if (status === 401) {


    }

    return Promise.reject(
      data || {
        success: false,
        message: "Unknown server error",
      }
    );
  }
);

export default api;










