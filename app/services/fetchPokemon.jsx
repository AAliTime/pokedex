import axios from "axios";

const API_BASE = "https://pokeapi.co/api/v2";

export async function fetchPokemonPage(limit = 20, offset = 0) {
  try {
    // 1. Fetch main page list
    const listRes = await axios.get(
      `${API_BASE}/pokemon?limit=${limit}&offset=${offset}`
    );

    // 2. Fetch full details sequentially or with standard Promise.all
    const pokemonDetailsPromises = listRes.data.results.map(async (item) => {
      const res = await axios.get(item.url);
      return res.data;
    });

    const results = await Promise.all(pokemonDetailsPromises);

    return {
      results,
      next: listRes.data.next,
    };
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
    return { results: [] };
  }
}