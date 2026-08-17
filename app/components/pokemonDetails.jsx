"use client";

import { useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { pokemonService } from "../services/fetchPokemon";

export default function PokemonDetail({ pokemonName, onBack }) {
  const [isShiny, setIsShiny] = useState(false);

  const { data: pokemon, loading, error } = useFetch(
    () => (pokemonName ? pokemonService.getPokemonByName(pokemonName) : null),
    [pokemonName]
  );

  if (!pokemonName) return null;
  if (loading) return <p className="no-results">Searching Pokémon...</p>;
  if (error || !pokemon)
    return (
      <p className="no-results" style={{ color: "#ef4444" }}>
        Pokémon not found
      </p>
    );

  const currentSprite = isShiny
    ? pokemon.sprites?.front_shiny || pokemon.sprites?.front_default
    : pokemon.sprites?.front_default;

  return (
    <div className="modal-content max-w-xl mx-auto my-6">
      <div className="detail-header">
        {onBack ? (
          <button onClick={onBack} className="load-more-btn text-xs py-1 px-3">
            ← Back to List
          </button>
        ) : (
          <div />
        )}
      </div>

      <span className="pokemon-id text-sm font-bold text-amber-400">
        #{String(pokemon.id).padStart(3, "0")}
      </span>
      <h2 className="pokemon-name text-2xl font-bold mb-2">{pokemon.name}</h2>

      <div className="flex flex-col items-center my-4">
        <div
          className="pokemon-sprite-wrapper"
          style={{ position: "relative", width: "8rem", height: "8rem" }}
        >
          <img
            src={currentSprite}
            alt={pokemon.name}
            className="pokemon-sprite"
          />

          <button
            onClick={() => setIsShiny(!isShiny)}
            className={`shiny-btn ${isShiny ? "active" : ""}`}
            style={{ position: "absolute", top: "0", right: "0" }}
          >
            {isShiny ? "✨" : "Normal"}
          </button>
        </div>
      </div>

      <div className="pokemon-types mb-6">
        {pokemon.types?.map((t) => (
          <span key={t.type.name} className="type-badge">
            {t.type.name}
          </span>
        ))}
      </div>

      {(pokemon.height || pokemon.weight) && (
        <div className="modal-metrics">
          {pokemon.height && (
            <div className="metric-item">
              <span className="metric-value">{pokemon.height / 10} m</span>
              <span className="metric-label">Height</span>
            </div>
          )}
          {pokemon.weight && (
            <div className="metric-item">
              <span className="metric-value">{pokemon.weight / 10} kg</span>
              <span className="metric-label">Weight</span>
            </div>
          )}
        </div>
      )}

      <div className="w-full">
        <h4 className="font-bold text-xs text-zinc-400 uppercase tracking-wider mb-3">
          Base Stats
        </h4>
        <div className="stats-container">
          {pokemon.stats?.map((s) => {
            const maxStat = 255;
            const percentage = Math.min(100, (s.base_stat / maxStat) * 100);

            return (
              <div key={s.stat.name} className="stat-row">
                <span className="stat-name">{s.stat.name}</span>
                <span className="stat-val">{s.base_stat}</span>
                <div className="stat-bar-bg">
                  <div
                    className="stat-bar-fill"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}