import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { typeColors } from '../utils/typeColors';
import { useComparison } from '../context/ComparisonContext';

export default function PokemonComparison() {
  const { id1, id2 } = useParams();
  const navigate = useNavigate();
  const { clearComparison } = useComparison();
  const [pokemon1, setPokemon1] = useState(null);
  const [pokemon2, setPokemon2] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemonData = async () => {
      try{
        const [response1, response2] = await Promise.all([
          fetch(`https://pokeapi.co/api/v2/pokemon/${id1}`),
          fetch(`https://pokeapi.co/api/v2/pokemon/${id2}`)
        ]);

        if(!response1.ok || !response2.ok) throw new Error('Pokemon not found');
        
        const [data1, data2] = await Promise.all([
          response1.json(),
          response2.json()
        ]);

        setPokemon1(data1);
        setPokemon2(data2);
      }
      catch(err){
        setError(err.message);
      }
      finally{
        setLoading(false);
      }
    };

    fetchPokemonData();
  }, [id1, id2]);

  if(loading) return <div className="text-center mt-10">Loading comparison...</div>;
  if(error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if(!pokemon1 || !pokemon2) return null;

  const renderPokemonInfo = (pokemon, isLeft = true) => (
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

      <div>
        <h2 className="text-2xl font-bold mb-4">Abilities</h2>
        <div className="grid grid-cols-1 gap-3">
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
        <h2 className="text-2xl font-bold mb-4">Physical Characteristics</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-100 p-3 rounded-lg">
            <span className="font-medium">Height:</span> {pokemon.height / 10}m
          </div>
          <div className="bg-gray-100 p-3 rounded-lg">
            <span className="font-medium">Weight:</span> {pokemon.weight / 10}kg
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => {
              clearComparison();
              navigate(-1);
            }}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold">Pokemon Comparison</h1>
          <div className="w-24"></div> {/* Spacer for alignment */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            {renderPokemonInfo(pokemon1, true)}
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            {renderPokemonInfo(pokemon2, false)}
          </div>
        </div>
      </div>
    </div>
  );
} 