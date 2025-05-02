import React, { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useComparison } from "../context/ComparisonContext";
import { useFavorites } from "../context/FavoritesContext";

export default function Header() {
  const navigate = useNavigate();
  const { selectedPokemon } = useComparison();
  const { favorites } = useFavorites();

  const handleRandomPokemon = useCallback(() => {
    // Generate a random number between 1 and 898 (total number of Pokemon)
    const randomId = Math.floor(Math.random() * 898) + 1;
    navigate(`/pokemon/${randomId}`);
  }, [navigate]);

  const handleCompare = useCallback(() => {
    if (selectedPokemon.length === 2) {
      navigate(`/compare/${selectedPokemon[0].id}/${selectedPokemon[1].id}`);
    }
  }, [navigate, selectedPokemon]);

  const handleFavorites = useCallback(() => {
    navigate('/favorites');
  }, [navigate]);

  const showCompareButton = useMemo(() => 
    selectedPokemon.length === 2,
    [selectedPokemon.length]
  );

  const favoritesCount = useMemo(() => 
    favorites.length,
    [favorites.length]
  );

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Pokémon Browser</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={handleFavorites}
            className="px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-2"
          >
            <span>Favorites</span>
            <span className="bg-white text-yellow-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
              {favoritesCount}
            </span>
          </button>
          {showCompareButton && (
            <button
              onClick={handleCompare}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <span>Compare Selected</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </button>
          )}
          <button
            onClick={handleRandomPokemon}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <span>Random Pokémon</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}