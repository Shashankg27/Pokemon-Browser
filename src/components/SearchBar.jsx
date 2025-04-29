import React from "react";

const types = [
  "All", "Normal", "Fire", "Water", "Grass", "Electric", "Ice", "Fighting",
  "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dark",
  "Dragon", "Steel", "Fairy"
];

export default function SearchBar({ searchTerm, setSearchTerm, selectedType, setSelectedType }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <input
        type="text"
        placeholder="Search Pokémon..."
        className="flex-1 py-2 px-4 border border-gray-300 rounded-xl"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select
        className="p-2 border border-gray-300 rounded-xl"
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
      >
        {types.map((type) => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
    </div>
  );
}