import api from "../api"; 

export const pokemonService = {
  getPokemonPage: async (limit = 20, offset = 0) => {
    const response = await api.get(`/pokemon?limit=${limit}&offset=${offset}`);
    return response.data;
  },

  getPokemonByType: async (typeName) => {
    const response = await api.get(`/type/${typeName}`);
    return response.data;
  },

  getPokemonByName: async (nameOrId) => {
    const response = await api.get(`/pokemon/${String(nameOrId).toLowerCase()}`);
    return response.data;
  },

  getPokemonByUrl: async (url) => {
    const response = await api.get(url);
    return response.data;
  },

  getTypes: async () => {
    const response = await api.get(`/type`);
    return response.data;
  },

  getPokemonUrlByName: (name) => `/pokemon/${name}`,
};