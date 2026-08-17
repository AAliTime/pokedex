"use client";

import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";

export default function PokemonDetail({ pokemonName }) {
  const [isShiny, setIsShiny] = useState(false);

  const { data: pokemon, loading, error } = useFetch(
    pokemonName ? `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}` : null
  );

  if (!pokemonName) return null;
  if (loading) return <p style={{ textAlign: "center" }}>Buscando Pokémon...</p>;
  if (error || !pokemon) return <p style={{ textAlign: "center", color: "red" }}>Pokémon no encontrado</p>;

  // Selección de sprite e imagen usando if / else
  let currentSprite;
  if (isShiny) {
    currentSprite = pokemon.sprites.front_shiny || pokemon.sprites.front_default;
  } else {
    currentSprite = pokemon.sprites.front_default;
  }

  // Estilos y texto del botón con if / else
  let buttonClass = "mt-2 px-3 py-1 text-xs rounded-full font-bold transition-colors ";
  let buttonText = "";

  if (isShiny) {
    buttonClass += "bg-yellow-400 text-black shadow";
    buttonText = "✨ Shiny";
  } else {
    buttonClass += "bg-gray-200 text-gray-700 hover:bg-gray-300";
    buttonText = "Normal";
  }

  return (
    <div className="pokemonWrapper">
      <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
        <span style={{ color: "var(--text-wb)", fontWeight: "bold" }}>#{pokemon.id}</span>
        <h2 style={{ textTransform: "capitalize", margin: 0 }}>{pokemon.name}</h2>
      </div>

      <div className="pokemonSpriteContainer" style={{ textAlign: "center" }}>
        <img src={currentSprite} alt={pokemon.name} className="pokemonSprite" />
        
        <div>
          <button
            onClick={() => setIsShiny(!isShiny)}
            className={buttonClass}
          >
            {buttonText}
          </button>
        </div>
      </div>

      <div className="pokemonTypes" style={{ marginTop: "1rem" }}>
        {pokemon.types.map((t) => (
          <span key={t.type.name} className="typeBadge">
            {t.type.name}
          </span>
        ))}
      </div>

      <div className="pokemonStatsWrapper">
        <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem", color: "var(--text-wb)" }}>
          Estadísticas Base
        </h4>
        <div className="grid grid-cols-2 gap-2 text-left text-sm">
          {pokemon.stats.map((s) => (
            <div key={s.stat.name} className="flex justify-between border-b pb-1">
              <span className="capitalize text-gray-400">{s.stat.name}:</span>
              <span className="font-bold">{s.base_stat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}