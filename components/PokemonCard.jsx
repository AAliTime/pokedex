"use client";

import { useFetch } from "@/hooks/useFetch";

export default function PokemonCard({ url, onSelect }) {
  const { data: pokemon, loading } = useFetch(url);

  if (loading || !pokemon) {
    return <div className="pokemonCard">Cargando...</div>;
  }

  return (
    <div className="pokemonCard" onClick={() => onSelect(pokemon.name)}>
      <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>#{pokemon.id}</span>
      <img
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
        style={{ width: "80px", height: "80px" }}
      />
      <h3 style={{ textTransform: "capitalize", margin: "0.2rem 0", fontSize: "1.1rem" }}>
        {pokemon.name}
      </h3>
    </div>
  );
}