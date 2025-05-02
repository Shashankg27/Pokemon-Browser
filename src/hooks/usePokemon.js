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

        // First, fetch the list of all Pokemon
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=898');
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

          // Fetch only the uncached Pokemon
          const fetchedPokemon = await Promise.all(
            uncachedPokemon.map(async (pokemon, index) => {
              try {
                const response = await fetch(pokemon.url);
                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                addToCache(data);
                if (isMounted) {
                  setLoadingProgress((index + 1) / uncachedPokemon.length * 100);
                }
                return data;
              } catch (err) {
                console.error(`Error fetching Pokemon ${pokemon.name}:`, err);
                return null;
              }
            })
          );

          // Filter out any failed fetches
          const validFetchedPokemon = fetchedPokemon.filter(pokemon => pokemon !== null);

          // Combine cached and newly fetched Pokemon
          const combinedPokemon = cachedPokemon.map(pokemon => {
            if (pokemon.sprites) return pokemon;
            const id = parseInt(pokemon.url.split('/')[6]);
            return validFetchedPokemon.find(p => p.id === id);
          }).filter(Boolean);

          if (isMounted) {
            setAllPokemon(combinedPokemon);
          }
        } else {
          // No cache, fetch all Pokemon
          const fetchedPokemon = await Promise.all(
            pokemonList.map(async (pokemon, index) => {
              try {
                const response = await fetch(pokemon.url);
                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                addToCache(data);
                if (isMounted) {
                  setLoadingProgress((index + 1) / pokemonList.length * 100);
                }
                return data;
              } catch (err) {
                console.error(`Error fetching Pokemon ${pokemon.name}:`, err);
                return null;
              }
            })
          );

          // Filter out any failed fetches
          const validFetchedPokemon = fetchedPokemon.filter(Boolean);

          if (isMounted) {
            setAllPokemon(validFetchedPokemon);
            addMultipleToCache(validFetchedPokemon);
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