"use client";

import { useFetch } from "../hooks/useFetch";
import { pokemonService } from "../services/fetchPokemon";

export default function PokemonCard({ url, onSelect }) {
  const { data: pokemon, loading } = useFetch(
    () => pokemonService.getPokemonByUrl(url),
    [url]
  );

  if (loading || !pokemon) {
    return (
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 h-48 animate-pulse flex items-center justify-center text-zinc-500 text-sm">
        Loading...
      </div>
    );
  }

  return (
    <div
      onClick={() => onSelect(pokemon.name)}
      className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 cursor-pointer hover:border-amber-400 transition-all text-white text-center shadow-md flex flex-col items-center justify-between"
    >
      <span className="text-xs text-amber-400 font-bold self-end">
        #{String(pokemon.id).padStart(3, "0")}
      </span>

      <img
        src={pokemon.sprites?.front_default || ""}
        alt={pokemon.name}
        className="w-28 h-28 object-contain my-2"
      />

      <h3 className="capitalize font-bold text-lg">{pokemon.name}</h3>

      <div className="flex gap-1 justify-center mt-2">
        {pokemon.types?.map((t) => (
          <span
            key={t.type.name}
            className="text-xs px-2 py-0.5 bg-zinc-700 text-zinc-300 rounded-full capitalize"
          >
            {t.type.name}
          </span>
        ))}
      </div>
    </div>
  );
}