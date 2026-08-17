import api from "@/app/api.js";

export default async function fetchPokemon(id = "absol") {
    const response = await api.get(`/pokemon/${id}`);
    return response.data;
}