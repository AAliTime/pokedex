import PokemonCard from "@/app/components/pokemonCard";
import { fetchPokemonPage } from "@/app/services/fetchPokemon";

export default async function Home() {
  const data = await fetchPokemonPage(20, 0);

  return (
    <main className="pokedex-container">
      <h1 className="pokedex-title">Pokédex</h1>

      <div className="pokedex-grid">
        {data.results.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>
    </main>
  );
}