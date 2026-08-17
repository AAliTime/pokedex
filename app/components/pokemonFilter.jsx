"use client";

const POKEMON_TYPES = [
  "all",
  "normal",
  "fire",
  "water",
  "grass",
  "electric",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "steel",
  "fairy",
];

export default function PokemonFilter({
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
}) {
  return (
    <div className="filter-container">
      <input
        type="text"
        placeholder="Search Pokémon..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="filter-input"
      />

      <select
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
        className="filter-select"
      >
        {POKEMON_TYPES.map((type) => (
          <option key={type} value={type} className="capitalize">
            {type === "all" ? "All Types" : type}
          </option>
        ))}
      </select>
    </div>
  );
}