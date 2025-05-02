import React, { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { typeColors } from "../utils/typeColors";
import { useComparison } from "../context/ComparisonContext";
import { useFavorites } from "../context/FavoritesContext";

export default function PokemonCard({ pokemon }) {
  const navigate = useNavigate();
  const { selectedPokemon, addToComparison, removeFromComparison } = useComparison();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  
  const isSelected = useMemo(() => 
    selectedPokemon.some(p => p.id === pokemon.id),
    [selectedPokemon, pokemon.id]
  );
  
  const isFav = useMemo(() => 
    isFavorite(pokemon.id),
    [isFavorite, pokemon.id]
  );

  const handleCardClick = useCallback((e) => {
    if (e.target.closest('.compare-button') || e.target.closest('.favorite-button')) {
      return;
    }
    navigate(`/pokemon/${pokemon.id}`);
  }, [navigate, pokemon.id]);

  const handleCompareClick = useCallback((e) => {
    e.stopPropagation();
    if (isSelected) {
      removeFromComparison(pokemon.id);
    } else {
      addToComparison(pokemon);
    }
  }, [isSelected, removeFromComparison, addToComparison, pokemon]);

  const handleFavoriteClick = useCallback((e) => {
    e.stopPropagation();
    if (isFav) {
      removeFromFavorites(pokemon.id);
    } else {
      addToFavorites(pokemon);
    }
  }, [isFav, removeFromFavorites, addToFavorites, pokemon]);

  const typeElements = useMemo(() => 
    pokemon.types.map((t) => {
      const type = t.type.name;
      const colors = typeColors[type] || { bg: 'bg-gray-200', text: 'text-black' };
      return (
        <span
          key={t.slot}
          className={`px-2 py-1 ${colors.bg} ${colors.text} rounded-2xl text-sm capitalize font-medium`}
        >
          {type}
        </span>
      );
    }),
    [pokemon.types]
  );

  return (
    <div 
      className={`bg-white rounded-xl shadow p-4 flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer relative ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={handleCardClick}
    >
      <div className="absolute top-2 right-2 flex gap-2">
        <button
          className={`favorite-button p-2 rounded-full transition-colors ${
            isFav 
              ? 'bg-yellow-400 text-white hover:bg-yellow-500' 
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
          onClick={handleFavoriteClick}
          title={isFav ? "Remove from favorites" : "Add to favorites"}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" 
              clipRule="evenodd" 
            />
          </svg>
        </button>
        <button
          className={`compare-button p-2 rounded-full transition-colors ${
            isSelected 
              ? 'bg-blue-500 text-white hover:bg-blue-600' 
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
          onClick={handleCompareClick}
          title={isSelected ? "Remove from comparison" : "Add to comparison"}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" 
              clipRule="evenodd" 
            />
          </svg>
        </button>
      </div>

      <img src={pokemon.sprites.front_default} alt={pokemon.name} className="w-20 h-20" />
      <h2 className="capitalize font-bold text-lg mt-2">{pokemon.name}</h2>
      <p className="text-gray-500">#{pokemon.id}</p>
      <div className="flex gap-3 mt-1">
        {typeElements}
      </div>
    </div>
  );
}