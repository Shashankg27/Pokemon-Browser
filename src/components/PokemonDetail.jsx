import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { typeColors } from '../utils/typeColors';
import { typeWeaknesses } from '../utils/typeEffectiveness';

export default function PokemonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [evolutionChain, setEvolutionChain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try{
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if(!response.ok) throw new Error('Pokemon not found');
        const data = await response.json();
        setPokemon(data);

        const speciesResponse = await fetch(data.species.url);
        const speciesData = await speciesResponse.json();
        
        const evolutionResponse = await fetch(speciesData.evolution_chain.url);
        const evolutionData = await evolutionResponse.json();
        setEvolutionChain(evolutionData);
      }
      catch(err){
        setError(err.message);
      }
      finally{
        setLoading(false);
      }
    };

    fetchPokemonDetails();
  }, [id]);

  const renderEvolutionChain = (chain) => {
    const evolutionChain = [];
    let currentChain = chain;

    while(currentChain){
      evolutionChain.push(currentChain.species);
      currentChain = currentChain.evolves_to[0];
    }

    return (
      <div className="flex items-center justify-center gap-4">
        {evolutionChain.map((species, index) => (
          <React.Fragment key={species.name}>
            <div 
              className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
              onClick={() => navigate(`/pokemon/${species.url.split('/')[6]}`)}
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${species.url.split('/')[6]}.png`}
                  alt={species.name}
                  className="w-20 h-20"
                />
              </div>
              <span className="mt-2 capitalize font-medium">{species.name}</span>
            </div>
            {index < evolutionChain.length - 1 && (
              <div className="text-gray-400">→</div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  if(loading) return <div className="text-center mt-10">Loading...</div>;
  if(error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if(!pokemon) return null;

  const pokemonTypes = pokemon.types.map(t => t.type.name);
  const weaknessesSet = new Set();
  pokemonTypes.forEach(type => {
    (typeWeaknesses[type] || []).forEach(weak => weaknessesSet.add(weak));
  });
  const weaknesses = Array.from(weaknessesSet);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
        >
          ← Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Basic Info */}
          <div className="space-y-6">
            <div className="text-center">
              <img
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
                className="w-48 h-48 mx-auto"
              />
              <h1 className="text-3xl font-bold capitalize mt-4">{pokemon.name}</h1>
              <p className="text-gray-500">#{pokemon.id}</p>
            </div>

            <div className="flex justify-center gap-3">
              {pokemon.types.map((t) => {
                const type = t.type.name;
                const colors = typeColors[type] || { bg: 'bg-gray-200', text: 'text-black' };
                return (
                  <span
                    key={t.slot}
                    className={`px-4 py-2 ${colors.bg} ${colors.text} rounded-full text-lg capitalize font-medium`}
                  >
                    {type}
                  </span>
                );
              })}
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Base Stats</h2>
              <div className="space-y-3">
                {pokemon.stats.map((stat) => (
                  <div key={stat.stat.name} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="capitalize font-medium">{stat.stat.name}</span>
                      <span>{stat.base_stat}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Abilities</h2>
              <div className="grid grid-cols-2 gap-3">
                {pokemon.abilities.map((ability) => (
                  <div
                    key={ability.ability.name}
                    className="bg-gray-100 p-3 rounded-lg capitalize"
                  >
                    {ability.ability.name}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Moves</h2>
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                {pokemon.moves.slice(0, 20).map((move) => (
                  <div
                    key={move.move.name}
                    className="bg-gray-100 p-2 rounded-lg capitalize text-sm"
                  >
                    {move.move.name}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Physical Characteristics</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <span className="font-medium">Height:</span> {pokemon.height / 10}m
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <span className="font-medium">Weight:</span> {pokemon.weight / 10}kg
                </div>
              </div>
              <div className="mt-4">
                <h2 className="text-xl font-bold mb-2">Weak Against</h2>
                <div className="flex flex-wrap gap-2">
                  {weaknesses.length === 0 ? (
                    <span className="text-gray-500">None</span>
                  ) : (
                    weaknesses.map(type => {
                      const colors = typeColors[type] || { bg: 'bg-red-200', text: 'text-red-800' };
                      return (
                        <span
                          key={type}
                          className={`px-3 py-1 rounded-full ${colors.bg} ${colors.text} font-semibold capitalize`}
                        >
                          {type}
                        </span>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {evolutionChain && (
          <div className="mt-8 pt-8 border-t">
            <h2 className="text-2xl font-bold mb-6 text-center">Evolution Chain</h2>
            {renderEvolutionChain(evolutionChain.chain)}
          </div>
        )}
      </div>
    </div>
  );
} 