"use client";

import { useState, useCallback, useEffect } from "react";
import { useFetch } from "./hooks/useFetch";
import { useDebounce } from "./hooks/useDebounce";
import { pokemonService } from "./services/fetchPokemon";
import PokemonCard from "./components/pokemonCard";
import PokemonDetail from "./components/pokemonDetails";
import PokemonCompare from "./components/pokemonCompare";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);
  const [selectedType, setSelectedType] = useState("");
  const [offset, setOffset] = useState(0);
  const [favoritesList, setFavoritesList] = useState([]);

  // Modals / Mode toggles
  const [showCompare, setShowCompare] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);

  // Prevent hydration mismatch between server HTML and client initial state
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync favorites from localStorage when selection changes
  useEffect(() => {
    if (selectedType === "favorites") {
      const storedFavorites = JSON.parse(
        localStorage.getItem("pokedex_favorites") || "[]"
      );
      setFavoritesList(storedFavorites);
    }
  }, [selectedType]);

  const fetchGridData = useCallback(() => {
    if (selectedType === "favorites") return null;
    return selectedType
      ? pokemonService.getPokemonByType(selectedType)
      : pokemonService.getPokemonPage(20, offset);
  }, [selectedType, offset]);

  const fetchTypesData = useCallback(() => {
    return pokemonService.getTypes();
  }, []);

  const { data: gridData, loading } = useFetch(fetchGridData, [selectedType, offset]);
  const { data: typesData } = useFetch(fetchTypesData, []);

  let pokemonList = [];
  if (selectedType === "favorites") {
    pokemonList = favoritesList.map((name) => ({
      name,
      url: pokemonService.getPokemonUrlByName
        ? pokemonService.getPokemonUrlByName(name)
        : `/pokemon/${name}`,
    }));
  } else if (selectedType) {
    pokemonList = gridData?.pokemon?.slice(0, 20).map((p) => p.pokemon) || [];
  } else {
    pokemonList = gridData?.results || [];
  }

  // Prevent server hydration mismatch before client mount
  if (!isMounted) return null;

  return (
    <main className="pokedex-container">
      {/* Header Bar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="pokedex-title">Pokédex</h1>

        <div className="flex gap-2">
          <button
            onClick={() => setShowCompare(!showCompare)}
            className="px-4 py-2 bg-zinc-800 border border-zinc-700 hover:border-amber-400 rounded-lg text-white font-medium text-sm transition-all"
          >
            {showCompare ? "Back to Grid" : "Compare 2 Pokémon"}
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-zinc-300 text-sm">👤 {user}</span>
              <button
                onClick={() => setUser(null)}
                className="px-3 py-2 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 rounded-lg text-zinc-400 text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-black font-bold rounded-lg text-sm transition-all"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {showCompare ? (
        <PokemonCompare onClose={() => setShowCompare(false)} />
      ) : (
        <>
          <div className="filter-container">
            <input
              className="filter-input"
              type="text"
              placeholder="Search by name or ID..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />

            <select
              className="filter-select"
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setOffset(0);
              }}
            >
              <option value="">All Types</option>
              <option value="favorites">★ Favorites</option>
              {typesData?.results?.map((t) => (
                <option key={t.name} value={t.name} className="capitalize">
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {debouncedSearch ? (
            <PokemonDetail
              pokemonName={debouncedSearch}
              onBack={() => setSearchInput("")}
            />
          ) : (
            <>
              {loading && selectedType !== "favorites" ? (
                <p className="no-results">Loading Pokémon...</p>
              ) : pokemonList.length === 0 ? (
                <p className="no-results">
                  {selectedType === "favorites"
                    ? "No favorites added yet!"
                    : "No Pokémon found."}
                </p>
              ) : (
                <div className="pokedex-grid">
                  {pokemonList.map((item) => (
                    <PokemonCard
                      key={item.name}
                      name={item.name}
                      url={item.url}
                      onSelect={(name) => setSearchInput(name)}
                    />
                  ))}
                </div>
              )}

              {!selectedType && (
                <div className="pagination-container gap-4">
                  <button
                    className="load-more-btn"
                    onClick={() => setOffset((prev) => Math.max(0, prev - 20))}
                    disabled={!gridData?.previous || loading}
                  >
                    Previous
                  </button>

                  <span className="font-semibold text-zinc-400">
                    Page {offset / 20 + 1}
                  </span>

                  <button
                    className="load-more-btn"
                    onClick={() => setOffset((prev) => prev + 20)}
                    disabled={!gridData?.next || loading}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </main>
  );
}