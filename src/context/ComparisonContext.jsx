import React, { createContext, useContext, useState } from 'react';

const ComparisonContext = createContext();

export function ComparisonProvider({ children }) {
  const [selectedPokemon, setSelectedPokemon] = useState([]);

  const addToComparison = (pokemon) => {
    if (selectedPokemon.length < 2 && !selectedPokemon.find(p => p.id === pokemon.id)) {
      setSelectedPokemon([...selectedPokemon, pokemon]);
    }
  };

  const removeFromComparison = (pokemonId) => {
    setSelectedPokemon(selectedPokemon.filter(p => p.id !== pokemonId));
  };

  const clearComparison = () => {
    setSelectedPokemon([]);
  };

  return (
    <ComparisonContext.Provider value={{ selectedPokemon, addToComparison, removeFromComparison, clearComparison }}>
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
} 