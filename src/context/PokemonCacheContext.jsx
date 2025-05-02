import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

const PokemonCacheContext = createContext();

export function PokemonCacheProvider({ children }) {
  const [pokemonCache, setPokemonCache] = useState(new Map());

  const addToCache = useCallback((pokemon) => {
    setPokemonCache(prevCache => {
      const newCache = new Map(prevCache);
      newCache.set(pokemon.id, pokemon);
      return newCache;
    });
  }, []);

  const addMultipleToCache = useCallback((pokemonList) => {
    setPokemonCache(prevCache => {
      const newCache = new Map(prevCache);
      pokemonList.forEach(pokemon => {
        newCache.set(pokemon.id, pokemon);
      });
      return newCache;
    });
  }, []);

  const getFromCache = useCallback((id) => {
    return pokemonCache.get(id);
  }, [pokemonCache]);

  const clearCache = useCallback(() => {
    setPokemonCache(new Map());
  }, []);

  const contextValue = useMemo(() => ({
    pokemonCache,
    addToCache,
    addMultipleToCache,
    getFromCache,
    clearCache
  }), [pokemonCache, addToCache, addMultipleToCache, getFromCache, clearCache]);

  return (
    <PokemonCacheContext.Provider value={contextValue}>
      {children}
    </PokemonCacheContext.Provider>
  );
}

export function usePokemonCache() {
  const context = useContext(PokemonCacheContext);
  if(!context){
    throw new Error('usePokemonCache must be used within a PokemonCacheProvider');
  }
  return context;
} 