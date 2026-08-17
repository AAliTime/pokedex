"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function PokemonDetails({ pokemon, onClose }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!pokemon || !mounted) return null;

  const defaultSprite =
    pokemon.sprites?.front_default ||
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";

  const modalContent = (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          ✕
        </button>

        <div className="pokemon-sprite-wrapper">
          <img
            src={defaultSprite}
            alt={pokemon.name}
            className="pokemon-sprite"
          />
        </div>

        <span className="pokemon-id">
          #{String(pokemon.id || 0).padStart(3, "0")}
        </span>
        <h2 className="pokemon-name" style={{ fontSize: "1.5rem" }}>
          {pokemon.name}
        </h2>

        {/* Types */}
        <div className="pokemon-types">
          {pokemon.types?.map((typeInfo) => (
            <span key={typeInfo.type.name} className="type-badge">
              {typeInfo.type.name}
            </span>
          ))}
        </div>

        {/* Height and Weight */}
        <div className="modal-metrics">
          <div className="metric-item">
            <span className="metric-value">
              {pokemon.height ? pokemon.height / 10 : "-"} m
            </span>
            <span className="metric-label">Height</span>
          </div>
          <div className="metric-item">
            <span className="metric-value">
              {pokemon.weight ? pokemon.weight / 10 : "-"} kg
            </span>
            <span className="metric-label">Weight</span>
          </div>
        </div>

        {/* Base Stats */}
        <div className="stats-container">
          {pokemon.stats ? (
            pokemon.stats.map((s) => {
              const percentage = Math.min(100, (s.base_stat / 200) * 100);
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
            })
          ) : (
            <p className="no-results">No stats available</p>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}