'use client';

import { useState, useEffect } from "react";
import fetchPokemon from "./components/test.js";

export default function Home() {
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    async function loadData() {
      const data = await fetchPokemon("absol");
      setPokemon(data);
    }
    loadData();
  }, []);
return (
    <main>
      <div>
        {/* Render formatted property once data arrives */}
        <p>{pokemon ? pokemon.name : "Loading..."}</p>
      </div>
    </main>
  );
}
