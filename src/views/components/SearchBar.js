import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchMovies, clearSearchResults, setSearchQuery } from '../../models/movieSlice';
import './SearchBar.css';

const SearchBar = ({ onSearch, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const dispatch = useDispatch();
  const { currentSearchQuery } = useSelector((state) => state.movies);

  // Sync with Redux search query
  useEffect(() => {
    if (currentSearchQuery && currentSearchQuery !== query) {
      setQuery(currentSearchQuery);
    }
  }, [currentSearchQuery]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.trim()) {
      // Pass object with query and page
      dispatch(searchMovies({ query: value.trim(), page: 1 }));
      dispatch(setSearchQuery(value.trim()));
      // Notify parent component about search query
      if (onSearch) {
        onSearch(value.trim());
      }
    } else {
      dispatch(clearSearchResults());
      dispatch(setSearchQuery(''));
      if (onSearch) {
        onSearch('');
      }
    }
  };

  const handleClear = () => {
    setQuery('');
    dispatch(clearSearchResults());
    dispatch(setSearchQuery(''));
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={handleSearch}
          className="search-input"
        />
        {query && (
          <button onClick={handleClear} className="clear-btn">
            ✕
          </button>
        )}
        <button className="search-btn">🔍</button>
      </div>
    </div>
  );
};

export default SearchBar;
