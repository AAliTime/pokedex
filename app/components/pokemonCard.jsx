"use client";

import { useState, useEffect } from "react";
import { useFetch } from "../hooks/useFetch";
import { pokemonService } from "../services/fetchPokemon";
import { authService } from "../services/authService";

export default function PokemonCard({ url, user, onSelect }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: pokemon, loading } = useFetch(
    () => pokemonService.getPokemonByUrl(url),
    [url]
  );

  useEffect(() => {
    if (!pokemon || !user) {
      setIsFavorite(false);
      return;
    }

    const storageKey = `pokedex_favorites_${user}`;
    const favorites = JSON.parse(localStorage.getItem(storageKey) || "[]");
    setIsFavorite(favorites.includes(pokemon.name));
  }, [pokemon, user]);

  const toggleFavorite = async (e) => {
    e.stopPropagation(); 

    if (!user) {
      alert("Inicia sesión para guardar favoritos por fa pls");
      return;
    }

    const storageKey = `pokedex_favorites_${user}`;
    const currentFavorites = JSON.parse(
      localStorage.getItem(storageKey) || "[]"
    );

    let updatedFavorites;
    if (currentFavorites.includes(pokemon.name)) {
      updatedFavorites = currentFavorites.filter(
        (name) => name !== pokemon.name
      );
      setIsFavorite(false);
    } else {
      updatedFavorites = [...currentFavorites, pokemon.name];
      setIsFavorite(true);
    }

    localStorage.setItem(storageKey, JSON.stringify(updatedFavorites));

    try {
      await authService.updateFavorites(user, updatedFavorites);
    } catch (error) {
      console.error("Failed to update backend favorites:", error);
    }
  };

  if (loading || !pokemon) {
    return (
      <div className="pokemon-card h-48 justify-center text-zinc-500 text-sm">
        Loading...
      </div>
    );
  }

  return (
    <div className="pokemon-card" onClick={() => onSelect(pokemon.name)}>
      <div className="w-full flex justify-between items-center mb-1">
        <button
          onClick={toggleFavorite}
          className={`text-lg transition-transform active:scale-125 ${
            isFavorite ? "text-amber-400" : "text-zinc-500 hover:text-amber-400"
          }`}
          title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        >
          {isFavorite ? "★" : "☆"}
        </button>

        <span className="pokemon-id">
          #{String(pokemon.id).padStart(3, "0")}
        </span>
      </div>

      <div className="pokemon-sprite-wrapper">
        <img
          src={pokemon.sprites?.front_default || ""}
          alt={pokemon.name}
          className="pokemon-sprite"
        />
      </div>

      <h3 className="pokemon-name">{pokemon.name}</h3>

      <div className="pokemon-types">
        {pokemon.types?.map((t) => (
          <span key={t.type.name} className="type-badge">
            {t.type.name}
          </span>
        ))}
      </div>
    </div>
  );
}