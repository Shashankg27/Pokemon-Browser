# Pokémon Explorer

A modern web application for exploring Pokémon data, built with React and the PokeAPI.

## Features

### 1. Pokémon List View
- Displays a grid of Pokémon cards
- Responsive design for all screen sizes
- Loading progress indicator
- Error handling for failed requests

### 2. Search and Filter
- Search Pokémon by name
- Filter by type
- Sort by various attributes
- Adjust items per page

### 3. Pokémon Detail View
- Detailed information for each Pokémon
- Base stats visualization
- Abilities and moves
- Evolution chain display
- Type information with color coding

### 4. Comparison Feature
- Select up to two Pokémon for comparison
- Side-by-side comparison view
- Compare stats, abilities, and characteristics
- Visual indicators for selected Pokémon

### 5. Favorites System
- Add/remove Pokémon to favorites
- Persistent storage using localStorage
- Dedicated favorites page
- Quick access from header

### 6. Random Pokémon
- Quick access to random Pokémon details
- Instant navigation to random Pokémon

## Technical Implementation

### Custom Hooks

#### 1. usePokemon
```javascript
const { allPokemon, loading, error, loadingProgress } = usePokemon();
```
- Manages Pokémon data fetching
- Implements caching system
- Handles batch processing
- Provides loading states and error handling
- Features:
  - Automatic caching
  - Batch processing (20 Pokémon per batch)
  - Rate limiting protection
  - Progress tracking
  - Error handling

#### 2. usePokemonFilter
```javascript
const { filteredPokemon, searchTerm, setSearchTerm, selectedTypes, setSelectedTypes, selectedSort, setSelectedSort } = usePokemonFilter(allPokemon);
```
- Manages search and filter functionality
- Handles type filtering
- Implements sorting
- Features:
  - Real-time search
  - Multiple type filtering
  - Custom sorting options
  - Debounced search

#### 3. usePagination
```javascript
const { currentPage, setCurrentPage, currentPokemon, totalPages, getPageNumbers } = usePagination(filteredPokemon, pokemonPerPage);
```
- Manages pagination state
- Calculates page numbers
- Handles page navigation
- Features:
  - Dynamic page size
  - Page number generation
  - Current page tracking

### Context Providers

#### 1. PokemonCacheContext
- Manages Pokémon data caching
- Provides methods for cache operations
- Features:
  - Add single/multiple Pokémon to cache
  - Retrieve from cache
  - Clear cache
  - Persistent storage

#### 2. ComparisonContext
- Manages Pokémon comparison state
- Handles selection/deselection
- Features:
  - Maximum two Pokémon selection
  - Selection state management
  - Comparison navigation

#### 3. FavoritesContext
- Manages favorite Pokémon
- Persists favorites in localStorage
- Features:
  - Add/remove favorites
  - Check favorite status
  - Persistent storage

## Performance Optimizations

1. **Data Caching**
   - In-memory cache for Pokémon data
   - Prevents unnecessary API calls
   - Faster subsequent loads

2. **Batch Processing**
   - Fetches Pokémon in batches of 20
   - Prevents API rate limiting
   - Better error handling

3. **Memoization**
   - Uses useMemo for expensive calculations
   - useCallback for function stability
   - Prevents unnecessary re-renders

4. **Lazy Loading**
   - Loads data progressively
   - Shows loading progress
   - Better user experience

## API Integration

### PokeAPI Usage
- Base URL: `https://pokeapi.co/api/v2`
- Endpoints used:
  - `/pokemon` - List and details
  - `/pokemon/{id}` - Individual Pokémon
  - `/evolution-chain/{id}` - Evolution data

### Rate Limiting
- Implements 100ms delay between batches
- Prevents API throttling
- Ensures reliable data fetching

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Technologies Used

- React
- React Router
- Tailwind CSS
- PokeAPI
- Local Storage API

## Future Improvements

1. Add more comparison metrics
2. Implement advanced search filters
3. Add Pokémon battle simulator
4. Include move details and damage calculator
5. Add user authentication for personalized features
