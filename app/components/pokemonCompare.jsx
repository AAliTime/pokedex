"use client";

import { useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import PokemonDetail from "./pokemonDetails";

export default function PokemonCompare({ onClose }) {
  // Input states for typed text
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");

  // Debounced values (delays update until typing pauses for 500ms)
  const debouncedPokemon1 = useDebounce(input1, 500);
  const debouncedPokemon2 = useDebounce(input2, 500);

  return (
    <div className="compare-container">
      <div className="compare-header">
        <h2 className="compare-title">Compare Pokémon</h2>
        <button
          onClick={onClose}
          className="load-more-btn"
        >
          Close
        </button>
      </div>

      <div className="compare-grid">
        {/* Left Slot */}
        <div className="compare-slot">
          <input
            type="text"
            className="filter-input"
            placeholder="First Pokémon (e.g., pikachu)..."
            value={input1}
            onChange={(e) => setInput1(e.target.value)}
          />

          {debouncedPokemon1 ? (
            <PokemonDetail pokemonName={debouncedPokemon1} />
          ) : (
            <p className="no-results">
              Type a name to load first Pokémon...
            </p>
          )}
        </div>

        {/* Right Slot */}
        <div className="compare-slot">
          <input
            type="text"
            className="filter-input"
            placeholder="Second Pokémon (e.g., charizard)..."
            value={input2}
            onChange={(e) => setInput2(e.target.value)}
          />

          {debouncedPokemon2 ? (
            <PokemonDetail pokemonName={debouncedPokemon2} />
          ) : (
            <p className="no-results">
              Type a name to load second Pokémon...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}