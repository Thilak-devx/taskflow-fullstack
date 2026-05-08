import axios from "axios";
import { authStorage } from "../utils/storage";

let unauthorizedHandler = null;
const resolvedApiBaseUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1").replace(/\/+$/, "");

const api = axios.create({
  baseURL: resolvedApiBaseUrl,
  timeout: 15000,
  headers: {
    Accept: "application/json"
  }
});

api.interceptors.request.use((config) => {
  const token = authStorage.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestSummary = {
      method: error.config?.method?.toUpperCase() || "GET",
      url: `${error.config?.baseURL || ""}${error.config?.url || ""}`,
      status: error.response?.status || null,
      message: error.response?.data?.message || error.message
    };

    console.error("TaskFlow API request failed", requestSummary);

    if (error.response?.status === 401 && unauthorizedHandler) {
      unauthorizedHandler(error.response?.data?.message);
    }

    return Promise.reject(error);
  }
);

export const registerUnauthorizedHandler = (handler) => {
  unauthorizedHandler = handler;
};

export default api;
