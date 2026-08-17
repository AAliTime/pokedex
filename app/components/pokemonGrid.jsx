"use client";

import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import PokemonCard from "./PokemonCard";
import TypeFilter from "./TypeFilter";

export default function PokemonGrid() {
  const [offset, setOffset] = useState(0);
  const [selectedType, setSelectedType] = useState("");
  const limit = 20;

  let url;
  if (selectedType) {
    url = `https://pokeapi.co/api/v2/type/${selectedType}`;
  } else {
    url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
  }

  const { data, loading, error } = useFetch(url);

let pokemonList;
if (selectedType) {
  pokemonList = data?.pokemon?.slice(0, 20).map((p) => p.pokemon);
} else {
  pokemonList = data?.results;
}

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setOffset(0);
  };

  return (
    <div className="my-6">
      <TypeFilter selectedType={selectedType} onSelectType={handleTypeChange} />

      {loading && <p className="text-center my-4">Cargando lista...</p>}
      {error && <p className="text-red-500 text-center my-4">Error: {error}</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {pokemonList?.map((item) => (
          <PokemonCard key={item.name} url={item.url} />
        ))}
      </div>

      {!selectedType && (
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setOffset((prev) => Math.max(0, prev - limit))}
            disabled={!data?.previous || loading}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Back
          </button>
          <span className="font-semibold">Página {offset / limit + 1}</span>
          <button
            onClick={() => setOffset((prev) => prev + limit)}
            disabled={!data?.next || loading}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}