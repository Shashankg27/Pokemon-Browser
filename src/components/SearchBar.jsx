import React from "react";
import Select from "react-select";

const types = [
  "Normal", "Fire", "Water", "Grass", "Electric", "Ice", "Fighting",
  "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dark",
  "Dragon", "Steel", "Fairy"
];
const typeOptions = types.map(type => ({ value: type, label: type }));
const PokemonPerPageSize = [10, 20, 50];
const sortOptions = ["ID", "name", "type"];

export default function SearchBar({ searchTerm, setSearchTerm, selectedTypes, setSelectedTypes, pokemonPerPage, setPokemonPerPage, selectedSort, setSelectedSort }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <input
        type="text"
        placeholder="Search Pokémon..."
        className="flex-1 py-2 px-4 border border-gray-300 rounded-xl"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Select
        isMulti
        options={typeOptions}
        value={typeOptions.filter(option => (selectedTypes || []).includes(option.value))}
        onChange={selected => setSelectedTypes(selected.map(option => option.value))}
        className="min-w-[180px] md:min-w-[200px]"
        placeholder="Select types..."
      />
      <select
        className="p-2 border border-gray-300 rounded-xl"
        value={pokemonPerPage}
        onChange={(e) => setPokemonPerPage(e.target.value)}
      >
        {PokemonPerPageSize.map((size) => (
          <option key={size} value={size}>{size}</option>
        ))}
      </select>
      <select
        className="p-2 border border-gray-300 rounded-xl"
        value={selectedSort}
        onChange={(e) => setSelectedSort(e.target.value)}
      >
        {sortOptions.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}