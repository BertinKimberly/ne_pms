import axios, { AxiosInstance } from "axios";
import { Cookies } from "react-cookie";

const cookies = new Cookies();

const API_URL = "http://localhost:8080/api/v1";

const commonHeaders = {
   "Content-Type": "application/json",
};

const unauthorizedAxiosInstance: AxiosInstance = axios.create({
   baseURL: API_URL,
   headers: commonHeaders,
   withCredentials: true,
});

const authorizedAxiosInstance: AxiosInstance = axios.create({
   baseURL: API_URL,
   headers: commonHeaders,
   withCredentials: true,
});

authorizedAxiosInstance.interceptors.request.use(
   async (config) => {
      // Get token from document.cookie instead of react-cookie
      const token = document.cookie
         .split("; ")
         .find((row) => row.startsWith("auth_token="))
         ?.split("=")[1];

      if (token) {
         config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
   },
   (error) => {
      return Promise.reject(error);
   }
);

export const unauthorizedAPI = unauthorizedAxiosInstance;
export const authorizedAPI = authorizedAxiosInstance;
