import axios from "axios";

const base = import.meta.env.VITE_API_BASE || "/api";

const api = axios.create({ baseURL: base });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface ApiError { status: number; message: string; details?: unknown }

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status ?? 0;
    const data = error?.response?.data ?? "";
    const message =
      (typeof data === "string" && data) ||
      data?.error ||
      data?.message ||
      error?.message ||
      "Network Error";
    const norm: ApiError = { status, message, details: data };
    return Promise.reject(norm);
  }
);

export default api;
