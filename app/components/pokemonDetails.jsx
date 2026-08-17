"use client";

import { useState, useEffect } from "react";
import { useFetch } from "../hooks/useFetch";
import { pokemonService } from "../services/fetchPokemon";

export default function PokemonDetail({ pokemonName, onBack }) {
  const [isShiny, setIsShiny] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: pokemon, loading, error } = useFetch(
    () => (pokemonName ? pokemonService.getPokemonByName(pokemonName) : null),
    [pokemonName]
  );

  useEffect(() => {
    if (pokemon?.name) {
      const favorites = JSON.parse(localStorage.getItem("pokedex_favorites") || "[]");
      setIsFavorite(favorites.includes(pokemon.name.toLowerCase()));
    }
  }, [pokemon]);

  const toggleFavorite = () => {
    if (!pokemon?.name) return;
    const favorites = JSON.parse(localStorage.getItem("pokedex_favorites") || "[]");
    const nameLower = pokemon.name.toLowerCase();

    let updatedFavorites;
    if (favorites.includes(nameLower)) {
      updatedFavorites = favorites.filter((fav) => fav !== nameLower);
      setIsFavorite(false);
    } else {
      updatedFavorites = [...favorites, nameLower];
      setIsFavorite(true);
    }

    localStorage.setItem("pokedex_favorites", JSON.stringify(updatedFavorites));
  };

  if (!pokemonName) return null;
  if (loading) return <p className="no-results">Searching Pokémon...</p>;
  if (error || !pokemon)
    return <p className="no-results" style={{ color: "#ef4444" }}>Pokémon not found</p>;

  const currentSprite = isShiny
    ? pokemon.sprites?.front_shiny || pokemon.sprites?.front_default
    : pokemon.sprites?.front_default;

  return (
    <div className="pokemonWrapper max-w-xl mx-auto p-6 bg-zinc-800 rounded-lg border border-zinc-700 text-white">
      <div className="flex justify-between items-center w-full mb-4">
        {onBack ? (
          <button
            onClick={onBack}
            className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-xs rounded transition-colors"
          >
            ← Back to List
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={toggleFavorite}
          className={`px-3 py-1 text-xs rounded font-bold transition-colors ${
            isFavorite
              ? "bg-amber-400 text-black"
              : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
          }`}
        >
          {isFavorite ? "★ Favorited" : "☆ Add to Favorites"}
        </button>
      </div>

      <div className="flex justify-between items-center w-full mb-4">
        <span className="font-bold text-amber-400">
          #{String(pokemon.id).padStart(3, "0")}
        </span>
        <h2 className="capitalize text-2xl font-bold">{pokemon.name}</h2>
      </div>

      <div className="text-center mb-6">
        <img
          src={currentSprite}
          alt={pokemon.name}
          className="w-32 h-32 mx-auto object-contain"
        />

        <button
          onClick={() => setIsShiny(!isShiny)}
          className={`mt-2 px-3 py-1 text-xs rounded-full font-bold transition-colors ${
            isShiny
              ? "bg-amber-400 text-black shadow"
              : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
          }`}
        >
          {isShiny ? "✨ Shiny" : "Normal"}
        </button>
      </div>

      <div className="flex gap-2 justify-center mb-6">
        {pokemon.types?.map((t) => (
          <span
            key={t.type.name}
            className="type-badge capitalize px-3 py-1 bg-zinc-700 rounded-full text-xs font-semibold"
          >
            {t.type.name}
          </span>
        ))}
      </div>

      <div>
        <h4 className="font-bold text-sm text-zinc-400 mb-2">Base Stats</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {pokemon.stats?.map((s) => (
            <div
              key={s.stat.name}
              className="flex justify-between border-b border-zinc-700 pb-1"
            >
              <span className="capitalize text-zinc-400">{s.stat.name}:</span>
              <span className="font-bold">{s.base_stat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}