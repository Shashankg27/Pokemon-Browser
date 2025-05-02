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
      try{
        setLoading(true);
        setError(null);
        setLoadingProgress(0);

        const countResponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1');
        if(!countResponse.ok){
          throw new Error(`HTTP error! status: ${countResponse.status}`);
        }
        const countData = await countResponse.json();
        const totalPokemon = countData.count;

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${totalPokemon}`);
        if(!response.ok){
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const pokemonList = data.results;

        if(pokemonCache.size > 0){
          const cachedPokemon = pokemonList.map(pokemon => {
            const id = parseInt(pokemon.url.split('/')[6]);
            const cached = getFromCache(id);
            return cached || pokemon;
          });

          const uncachedPokemon = cachedPokemon.filter(pokemon => !pokemon.sprites);
          
          if(uncachedPokemon.length === 0){
            if(isMounted){
              setAllPokemon(cachedPokemon);
              setLoading(false);
              setLoadingProgress(100);
            }
            return;
          }

          const batchSize = 20;
          const batches = Math.ceil(uncachedPokemon.length / batchSize);
          let allFetchedPokemon = [];

          for(let i=0; i<batches; i++){
            const start = i * batchSize;
            const end = Math.min(start + batchSize, uncachedPokemon.length);
            const batch = uncachedPokemon.slice(start, end);

            const batchResults = await Promise.all(
              batch.map(async (pokemon) => {
                try {
                  const response = await fetch(pokemon.url);
                  if(!response.ok){
                    throw new Error(`HTTP error! status: ${response.status}`);
                  }
                  const data = await response.json();
                  addToCache(data);
                  return data;
                }
                catch(err){
                  console.error(`Error fetching Pokemon ${pokemon.name}:`, err);
                  return null;
                }
              })
            );

            allFetchedPokemon = [...allFetchedPokemon, ...batchResults.filter(Boolean)];
            
            if(isMounted){
              const progress = Math.floor(((i + 1) / batches) * 100);
              setLoadingProgress(progress);
            }

            await new Promise(resolve => setTimeout(resolve, 100));
          }

          const combinedPokemon = cachedPokemon.map(pokemon => {
            if(pokemon.sprites) return pokemon;
            const id = parseInt(pokemon.url.split('/')[6]);
            return allFetchedPokemon.find(p => p.id === id);
          }).filter(Boolean);

          if(isMounted){
            setAllPokemon(combinedPokemon);
          }
        }
        else{
          const batchSize = 20;
          const batches = Math.ceil(pokemonList.length / batchSize);
          let allFetchedPokemon = [];

          for(let i=0; i<batches; i++) {
            const start = i * batchSize;
            const end = Math.min(start + batchSize, pokemonList.length);
            const batch = pokemonList.slice(start, end);

            const batchResults = await Promise.all(
              batch.map(async (pokemon) => {
                try{
                  const response = await fetch(pokemon.url);
                  if(!response.ok){
                    throw new Error(`HTTP error! status: ${response.status}`);
                  }
                  const data = await response.json();
                  addToCache(data);
                  return data;
                }
                catch(err){
                  console.error(`Error fetching Pokemon ${pokemon.name}:`, err);
                  return null;
                }
              })
            );

            allFetchedPokemon = [...allFetchedPokemon, ...batchResults.filter(Boolean)];
            
            if(isMounted){
              const progress = Math.floor(((i + 1) / batches) * 100);
              setLoadingProgress(progress);
            }

            await new Promise(resolve => setTimeout(resolve, 100));
          } 

          if(isMounted){
            setAllPokemon(allFetchedPokemon);
            addMultipleToCache(allFetchedPokemon);
          }
        }

        if(isMounted){
          setLoading(false);
          setLoadingProgress(100);
        }
      }
      catch(err){
        console.error('Error in fetchPokemon:', err);
        if(isMounted){
          setError(`Failed to fetch Pokémon data: ${err.message}`);
          setLoading(false);
        }
      }
    };

    fetchPokemon();

    return () => {
      isMounted = false;
    };
  }, []);

  return { allPokemon, loading, error, loadingProgress };
}