import { useState, useEffect } from 'react';

export function usePokemonFilter(allPokemon) {
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedSort, setSelectedSort] = useState("ID");

  useEffect(() => {
    let filtered = allPokemon.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (selectedTypes.length > 0) {
      const selectedTypesLower = selectedTypes.map(type => type.toLowerCase());
      filtered = filtered.filter((pokemon) =>
        pokemon.types.some((t) => selectedTypesLower.includes(t.type.name))
      );
    }
    if(selectedSort === "ID") {
      filtered = filtered.sort((a, b) => a.id - b.id);
    } else if (selectedSort === "name") {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (selectedSort === "type") {
      filtered = filtered.sort((a, b) => a.types[0].type.name.localeCompare(b.types[0].type.name));
    }
    setFilteredPokemon(filtered);
  }, [searchTerm, selectedTypes, allPokemon, selectedSort]);

  return {
    filteredPokemon,
    searchTerm,
    setSearchTerm,
    selectedTypes,
    setSelectedTypes,
    selectedSort,
    setSelectedSort
  };
}