"use client";

import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { useDebounce } from "@/hooks/useDebounce";
import PokemonCard from "@/components/PokemonCard";
import PokemonDetail from "@/components/PokemonDetail";

export default function Home() {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);
  const [selectedType, setSelectedType] = useState("");
  const [offset, setOffset] = useState(0);

  const gridUrl = selectedType
    ? `https://pokeapi.co/api/v2/type/${selectedType}`
    : `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`;

  const { data: gridData, loading } = useFetch(gridUrl);
  const { data: typesData } = useFetch("https://pokeapi.co/api/v2/type");

  let pokemonList;
  if (selectedType) {
    pokemonList = gridData?.pokemon?.slice(0, 20).map((p: any) => p.pokemon);
  } else {
    pokemonList = gridData?.results;
  }

  return (
    <main>
      <div className="searchWrapper">
        <h1 id="title" className="font-bold text-xl">Pokédex</h1>

        <div className="pokemonSearch">
          <input
            className="searchBar"
            type="text"
            placeholder="Buscar por nombre o ID..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <div className="searchFilter">
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setOffset(0);
            }}
          >
            <option value="">Todos los Tipos</option>
            {typesData?.results?.map((t: any) => (
              <option key={t.name} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {debouncedSearch && <PokemonDetail pokemonName={debouncedSearch} />}

      {!debouncedSearch && (
        <>
          {loading ? (
            <p style={{ textAlign: "center" }}>Cargando Pokémon...</p>
          ) : (
            <div className="pokemonGrid">
              {pokemonList?.map((item: any) => (
                <PokemonCard
                  key={item.name}
                  url={item.url}
                  onSelect={(name) => setSearchInput(name)}
                />
              ))}
            </div>
          )}

          {!selectedType && (
            <div className="pagination">
              <button
                className="btnPagination"
                onClick={() => setOffset((prev) => Math.max(0, prev - 20))}
                disabled={!gridData?.previous || loading}
              >
                Anterior
              </button>

              <span>Página {offset / 20 + 1}</span>

              <button
                className="btnPagination"
                onClick={() => setOffset((prev) => prev + 20)}
                disabled={!gridData?.next || loading}
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}