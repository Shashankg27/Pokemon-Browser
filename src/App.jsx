import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import PokemonList from "./components/PokemonList";

export default function App() {
  const [allPokemon, setAllPokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=150");
        const data = await response.json();

        const details = await Promise.all(
          data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            return res.json();
          })
        );

        setAllPokemon(details);
        setFilteredPokemon(details);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch Pokémon.");
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = allPokemon.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (selectedType !== "All") {
      filtered = filtered.filter((pokemon) =>
        pokemon.types.some((t) => t.type.name === selectedType.toLowerCase())
      );
    }
    setFilteredPokemon(filtered);
  }, [searchTerm, selectedType, allPokemon]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-6xl mx-auto p-4">
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
        />
        <PokemonList pokemon={filteredPokemon} />
        {filteredPokemon.length === 0 && (
          <div className="text-center mt-10">No Pokémon found.</div>
        )}
      </div>
    </div>
  );
}
