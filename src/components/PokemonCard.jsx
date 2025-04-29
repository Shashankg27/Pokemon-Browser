import React from "react";

export default function PokemonCard({ pokemon }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-xl">
      <img src={pokemon.sprites.front_default} alt={pokemon.name} className="w-20 h-20" />
      <h2 className="capitalize font-bold text-lg mt-2">{pokemon.name}</h2>
      <p className="text-gray-500">#{pokemon.id}</p>
      <div className="flex gap-3 mt-1">
        {pokemon.types.map((t) => (
          <span key={t.slot} className="px-2 py-1 bg-gray-200 rounded text-sm capitalize">
            {t.type.name}
          </span>
        ))}
      </div>
    </div>
  );
}