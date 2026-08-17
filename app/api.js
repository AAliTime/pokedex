import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const auth = axios.create({
  baseURL: "http://localhost:8000",
});

export default api;