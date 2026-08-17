"use client";

import { useState } from "react";
import PokemonCard from "./pokemonCard";
import PokemonFilter from "./pokemonFilter";
import PokemonDetails from "./pokemonDetails"; // Note: lowercase 'p' in filename
import { fetchPokemonPage } from "@/app/services/fetchPokemon";

export default function PokemonGrid({ initialPokemon }) {
  const [pokemonList, setPokemonList] = useState(initialPokemon);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [offset, setOffset] = useState(20);
  const [loading, setLoading] = useState(false);

  const filteredPokemon = pokemonList.filter((pokemon) => {
    const matchesSearch = pokemon.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesType =
      selectedType === "all" ||
      pokemon.types?.some((typeInfo) => typeInfo.type.name === selectedType);

    return matchesSearch && matchesType;
  });

  const handleLoadMore = async () => {
    setLoading(true);
    try {
      const data = await fetchPokemonPage(20, offset);
      setPokemonList((prev) => [...prev, ...data.results]);
      setOffset((prevOffset) => prevOffset + 20);
    } catch (err) {
      console.error("Failed to load more Pokémon:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PokemonFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
      />

      {filteredPokemon.length === 0 ? (
        <p className="no-results">
          No Pokémon found matching your criteria.
        </p>
      ) : (
        <>
          <div className="pokedex-grid">
            {filteredPokemon.map((pokemon) => (
              <PokemonCard
                key={pokemon.id || pokemon.name}
                pokemon={pokemon}
                onSelect={(p) => setSelectedPokemon(p)}
              />
            ))}
          </div>

          {searchQuery === "" && selectedType === "all" && (
            <div className="pagination-container">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="load-more-btn"
              >
                {loading ? "Loading..." : "Load More Pokémon"}
              </button>
            </div>
          )}
        </>
      )}

      {/* Render Modal */}
      {selectedPokemon && (
        <PokemonDetails
          pokemon={selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
        />
      )}
    </div>
  );
}