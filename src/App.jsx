import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import PokemonList from "./components/PokemonList";
import Pagination from "./components/Pagination";
import PokemonDetail from "./components/PokemonDetail";
import PokemonComparison from "./components/PokemonComparison";
import Favorites from "./components/Favorites";
import { usePokemon } from "./hooks/usePokemon.js";
import { usePokemonFilter } from "./hooks/usePokemonFilter.js";
import { usePagination } from "./hooks/usePagination.js";
import { ComparisonProvider } from "./context/ComparisonContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { PokemonCacheProvider } from "./context/PokemonCacheContext";

function PokemonHome() {
  const [pokemonPerPage, setPokemonPerPage] = useState(20);
  
  const { allPokemon, loading, error, loadingProgress } = usePokemon();
  const { filteredPokemon, searchTerm, setSearchTerm, selectedTypes, setSelectedTypes, selectedSort, setSelectedSort } = usePokemonFilter(allPokemon);
  const { currentPage, setCurrentPage, currentPokemon, totalPages, getPageNumbers } = usePagination(filteredPokemon, pokemonPerPage);
  
  if(error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-6xl mx-auto p-4">
        {loading && (
          <div className="text-center mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm font-medium text-blue-800 mb-2">Loading Pokémon... {Math.floor(loadingProgress)}%</div>
            <div className="w-full max-w-md h-2 bg-blue-100 rounded-full mx-auto">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
          </div>
        )}
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedTypes={selectedTypes}
          setSelectedTypes={setSelectedTypes}
          pokemonPerPage={pokemonPerPage}
          setPokemonPerPage={setPokemonPerPage}
          selectedSort={selectedSort}
          setSelectedSort={setSelectedSort}
        />
        <PokemonList pokemon={currentPokemon} />
        
        {filteredPokemon.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            getPageNumbers={getPageNumbers}
            onPageChange={setCurrentPage}
          />
        )}

        {filteredPokemon.length === 0 && (
          <div className="text-center mt-10">No Pokémon found.</div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <PokemonCacheProvider>
      <FavoritesProvider>
        <ComparisonProvider>
          <Router>
            <Routes>
              <Route path="/" element={<PokemonHome />} />
              <Route path="/pokemon/:id" element={<PokemonDetail />} />
              <Route path="/compare/:id1/:id2" element={<PokemonComparison />} />
              <Route path="/favorites" element={<Favorites />} />
            </Routes>
          </Router>
        </ComparisonProvider>
      </FavoritesProvider>
    </PokemonCacheProvider>
  );
}