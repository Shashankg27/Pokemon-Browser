import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    // Initialize from localStorage
    const savedFavorites = localStorage.getItem('favoritePokemon');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  // Update localStorage when favorites change
  useEffect(() => {
    localStorage.setItem('favoritePokemon', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = useCallback((pokemon) => {
    setFavorites(prevFavorites => {
      if (!prevFavorites.find(p => p.id === pokemon.id)) {
        return [...prevFavorites, pokemon];
      }
      return prevFavorites;
    });
  }, []);

  const removeFromFavorites = useCallback((pokemonId) => {
    setFavorites(prevFavorites => 
      prevFavorites.filter(p => p.id !== pokemonId)
    );
  }, []);

  const isFavorite = useCallback((pokemonId) => {
    return favorites.some(p => p.id === pokemonId);
  }, [favorites]);

  const contextValue = useMemo(() => ({
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  }), [favorites, addToFavorites, removeFromFavorites, isFavorite]);

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
} 