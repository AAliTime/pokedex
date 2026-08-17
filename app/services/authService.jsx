import { auth } from "../api";

export const authService = {
  login: async (credentials) => {
    const res = await auth.post("/login", credentials);
    return res.data;
  },
  register: async (credentials) => {
    const res = await auth.post("/register", credentials);
    return res.data;
  },
  // Sync favorites with FastAPI backend
  updateFavorites: async (username, favorites) => {
    const res = await auth.post("/favorites", { username, favorites });
    return res.data;
  },
  getFavorites: async (username) => {
    const res = await auth.get(`/favorites/${username}`);
    return res.data;
  },
};