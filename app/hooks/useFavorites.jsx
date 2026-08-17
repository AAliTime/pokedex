"use client";

import { useState, useEffect } from "react";

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("pokedex_favorites");
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  const toggleFavorite = (pokemonName) => {
    let updated;
    if (favorites.includes(pokemonName)) {
      updated = favorites.filter((name) => name !== pokemonName);
    } else {
      updated = [...favorites, pokemonName];
    }
    setFavorites(updated);
    localStorage.setItem("pokedex_favorites", JSON.stringify(updated));
  };

  const isFavorite = (pokemonName) => favorites.includes(pokemonName);

  return { favorites, toggleFavorite, isFavorite };
}