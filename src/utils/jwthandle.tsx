import axios from "axios";
import { LOCAL_API_URL } from "./environment";

// Настройка axios instance
const api = axios.create({
  baseURL: LOCAL_API_URL,
});

// interceptor для вставки токена
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
