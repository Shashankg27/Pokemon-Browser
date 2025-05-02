import { useState, useEffect } from 'react';
import { usePokemonCache } from '../context/PokemonCacheContext';

export function usePokemon() {
  const [allPokemon, setAllPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const { pokemonCache, addToCache, addMultipleToCache, getFromCache } = usePokemonCache();

  useEffect(() => {
    let isMounted = true;

    const fetchPokemon = async () => {
      try {
        setLoading(true);
        setError(null);
        setLoadingProgress(0);

        // First, get the total count of Pokemon
        const countResponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1');
        if (!countResponse.ok) {
          throw new Error(`HTTP error! status: ${countResponse.status}`);
        }
        const countData = await countResponse.json();
        const totalPokemon = countData.count;

        // Then fetch the list of all Pokemon
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${totalPokemon}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const pokemonList = data.results;

        // If we have cached data, use it
        if (pokemonCache.size > 0) {
          const cachedPokemon = pokemonList.map(pokemon => {
            const id = parseInt(pokemon.url.split('/')[6]);
            const cached = getFromCache(id);
            return cached || pokemon;
          });

          // Filter out any Pokemon that weren't in the cache
          const uncachedPokemon = cachedPokemon.filter(pokemon => !pokemon.sprites);
          
          if (uncachedPokemon.length === 0) {
            // All Pokemon are in cache
            if (isMounted) {
              setAllPokemon(cachedPokemon);
              setLoading(false);
              setLoadingProgress(100);
            }
            return;
          }

          // Fetch uncached Pokemon in batches of 20
          const batchSize = 20;
          const batches = Math.ceil(uncachedPokemon.length / batchSize);
          let allFetchedPokemon = [];

          for (let i = 0; i < batches; i++) {
            const start = i * batchSize;
            const end = Math.min(start + batchSize, uncachedPokemon.length);
            const batch = uncachedPokemon.slice(start, end);

            const batchResults = await Promise.all(
              batch.map(async (pokemon) => {
                try {
                  const response = await fetch(pokemon.url);
                  if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                  }
                  const data = await response.json();
                  addToCache(data);
                  return data;
                } catch (err) {
                  console.error(`Error fetching Pokemon ${pokemon.name}:`, err);
                  return null;
                }
              })
            );

            allFetchedPokemon = [...allFetchedPokemon, ...batchResults.filter(Boolean)];
            
            if (isMounted) {
              const progress = Math.floor(((i + 1) / batches) * 100);
              setLoadingProgress(progress);
            }

            // Add a small delay between batches to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
          }

          // Combine cached and newly fetched Pokemon
          const combinedPokemon = cachedPokemon.map(pokemon => {
            if (pokemon.sprites) return pokemon;
            const id = parseInt(pokemon.url.split('/')[6]);
            return allFetchedPokemon.find(p => p.id === id);
          }).filter(Boolean);

          if (isMounted) {
            setAllPokemon(combinedPokemon);
          }
        } else {
          // No cache, fetch all Pokemon in batches
          const batchSize = 20;
          const batches = Math.ceil(pokemonList.length / batchSize);
          let allFetchedPokemon = [];

          for (let i = 0; i < batches; i++) {
            const start = i * batchSize;
            const end = Math.min(start + batchSize, pokemonList.length);
            const batch = pokemonList.slice(start, end);

            const batchResults = await Promise.all(
              batch.map(async (pokemon) => {
                try {
                  const response = await fetch(pokemon.url);
                  if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                  }
                  const data = await response.json();
                  addToCache(data);
                  return data;
                } catch (err) {
                  console.error(`Error fetching Pokemon ${pokemon.name}:`, err);
                  return null;
                }
              })
            );

            allFetchedPokemon = [...allFetchedPokemon, ...batchResults.filter(Boolean)];
            
            if (isMounted) {
              const progress = Math.floor(((i + 1) / batches) * 100);
              setLoadingProgress(progress);
            }

            // Add a small delay between batches to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
          }

          if (isMounted) {
            setAllPokemon(allFetchedPokemon);
            addMultipleToCache(allFetchedPokemon);
          }
        }

        if (isMounted) {
          setLoading(false);
          setLoadingProgress(100);
        }
      } catch (err) {
        console.error('Error in fetchPokemon:', err);
        if (isMounted) {
          setError(`Failed to fetch Pokémon data: ${err.message}`);
          setLoading(false);
        }
      }
    };

    fetchPokemon();

    return () => {
      isMounted = false;
    };
  }, []); // Remove pokemonCache from dependencies

  return { allPokemon, loading, error, loadingProgress };
}