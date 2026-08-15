"use client";

import { useFetch } from "@/hooks/useFetch";

export default function PokemonCard({ pokemonName = "pikachu" }) {
  const { data: pokemon, loading, error } = useFetch(
    `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
  );

  if (loading) return <div>Cargando Pokémon...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!pokemon) return null;

  return (
    <div>
      <h2>#{pokemon.id} - {pokemon.name}</h2>
      <img src={pokemon.sprites.front_default} alt={pokemon.name} />
    </div>
  );
}