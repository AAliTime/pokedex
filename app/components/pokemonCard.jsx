"use client";

import { useState } from "react";

export default function PokemonCard({ pokemon, onSelect }) {
  const [isShiny, setIsShiny] = useState(false);

  const defaultSprite = pokemon.sprites?.front_default || "/favicon.ico";
  const shinySprite = pokemon.sprites?.front_shiny || defaultSprite;

  const handleCardClick = (e) => {
    e.stopPropagation();
    console.log("Card clicked for:", pokemon.name);
    if (onSelect) {
      onSelect(pokemon);
    }
  };

  return (
    <div className="pokemon-card" onClick={handleCardClick}>
      {/* Shiny Toggle Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsShiny(!isShiny);
        }}
        className={`shiny-btn ${isShiny ? "active" : ""}`}
        title="Toggle Shiny Sprite"
      >
        ✨
      </button>

      {/* Pokémon Image */}
      <div className="pokemon-sprite-wrapper">
        <img
          src={isShiny ? shinySprite : defaultSprite}
          alt={pokemon.name}
          className="pokemon-sprite"
          onError={(e) => {
            e.currentTarget.src =
              "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";
          }}
        />
      </div>

      {/* Info */}
      <span className="pokemon-id">
        #{String(pokemon.id || 0).padStart(3, "0")}
      </span>
      <h3 className="pokemon-name">{pokemon.name}</h3>

      {/* Types */}
      <div className="pokemon-types">
        {pokemon.types?.map((typeInfo) => (
          <span key={typeInfo.type.name} className="type-badge">
            {typeInfo.type.name}
          </span>
        ))}
      </div>

      {/* Action Button */}
      <button
        type="button"
        className="view-details-btn"
        onClick={handleCardClick}
      >
        View Details
      </button>
    </div>
  );
}