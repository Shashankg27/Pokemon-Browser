import React, { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import PokemonCard from './PokemonCard';

export default function Favorites() {
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const pokemonCards = useMemo(() => 
    favorites.map((pokemon) => (
      <PokemonCard key={pokemon.id} pokemon={pokemon} />
    )),
    [favorites]
  );

  const emptyState = useMemo(() => (
    <div className="text-center mt-10 text-gray-500">
      <p className="text-xl">No favorite Pokémon yet!</p>
      <p className="mt-2">Add some Pokémon to your favorites to see them here.</p>
    </div>
  ), []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Favorite Pokémon</h1>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            ← Back
          </button>
        </div>

        {favorites.length === 0 ? emptyState : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {pokemonCards}
          </div>
        )}
      </div>
    </div>
  );
} 