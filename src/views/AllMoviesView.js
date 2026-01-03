import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import SearchBar from './components/SearchBar';
import { fetchPopularMovies, fetchTrendingMovies, fetchTopRatedMovies, searchMovies } from '../models/movieSlice';
import { getImageUrl } from '../services/tmdb';
import './AllMoviesView.css';

const AllMoviesView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { 
    popular, 
    trending, 
    topRated, 
    searchResults,
    popularTotalPages,
    trendingTotalPages,
    topRatedTotalPages,
    searchTotalPages,
    currentSearchQuery,
    loading
  } = useSelector((state) => state.movies);
  
  const { category, title } = location.state || { category: 'popular', title: 'Popular Movies' };
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(currentSearchQuery || '');

  // Get movies and pagination info based on category
  const getMovieData = () => {
    if (searchResults && searchResults.length > 0) {
      return {
        movies: searchResults,
        totalPages: Math.min(searchTotalPages, 500),
        isSearch: true
      };
    }
    switch (category) {
      case 'trending':
        return {
          movies: trending,
          totalPages: Math.min(trendingTotalPages, 500),
          isSearch: false
        };
      case 'topRated':
        return {
          movies: topRated,
          totalPages: Math.min(topRatedTotalPages, 500),
          isSearch: false
        };
      case 'popular':
      default:
        return {
          movies: popular,
          totalPages: Math.min(popularTotalPages, 500),
          isSearch: false
        };
    }
  };

  const { movies, totalPages, isSearch } = getMovieData();

  useEffect(() => {
    // Fetch first page if not already loaded
    if (category === 'popular' && popular.length === 0) {
      dispatch(fetchPopularMovies(1));
    } else if (category === 'trending' && trending.length === 0) {
      dispatch(fetchTrendingMovies(1));
    } else if (category === 'topRated' && topRated.length === 0) {
      dispatch(fetchTopRatedMovies(1));
    }
  }, [category, popular, trending, topRated, dispatch]);

  // Sync with Redux search query
  useEffect(() => {
    if (currentSearchQuery) {
      setSearchQuery(currentSearchQuery);
    }
  }, [currentSearchQuery]);

  // Listen to search results from Redux
  useEffect(() => {
    if (searchResults && searchResults.length > 0) {
      setCurrentPage(1);
    }
  }, [searchResults]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Fetch new page from API
    if (isSearch && searchQuery) {
      dispatch(searchMovies({ query: searchQuery, page: pageNumber }));
    } else if (category === 'popular') {
      dispatch(fetchPopularMovies(pageNumber));
    } else if (category === 'trending') {
      dispatch(fetchTrendingMovies(pageNumber));
    } else if (category === 'topRated') {
      dispatch(fetchTopRatedMovies(pageNumber));
    }
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Generate pagination buttons
  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button key="first" onClick={() => handlePageChange(1)} className="page-btn">
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="dots-start" className="page-dots">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`page-btn ${currentPage === i ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="dots-end" className="page-dots">...</span>);
      }
      pages.push(
        <button key="last" onClick={() => handlePageChange(totalPages)} className="page-btn">
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="all-movies-container">
      <div className="all-movies-header">
        <div className="header-left">
          <button onClick={handleBack} className="back-btn-all">
            ← Back
          </button>
                  <h1>{isSearch ? 'Search Results' : title}</h1>

          
        </div>
        
        {/* Custom SearchBar Component on Right */}
        <div className="header-right">
          <SearchBar onSearch={(query) => setSearchQuery(query)} initialQuery={currentSearchQuery} />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading movies...</p>
        </div>
      )}

      {/* Movies Grid */}
      {movies && movies.length === 0 && !loading ? (
        <div className="no-results">
          <p>No movies found</p>
        </div>
      ) : (
        <>
        
          <div className="all-movies-grid">
            {movies && movies.map((movie) => (
              <div
                key={movie.id}
                className="all-movie-card"
                onClick={() => handleMovieClick(movie.id)}
              >
                <img
                  src={getImageUrl(movie.poster_path, 'w300')}
                  alt={movie.title}
                  className="all-movie-poster"
                />
                <div className="all-movie-info">
                  <h4>{movie.title}</h4>
                 
                </div>
              </div>
            ))}
          </div>

          {/* Pagination - Show for both search and category results */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="page-nav-btn"
              >
                ← Previous
              </button>

              <div className="page-numbers">{renderPagination()}</div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="page-nav-btn"
              >
                Next →
              </button>
            </div>
          )}

          {/* Page Info */}
          <div className="page-info">
            {isSearch 
              ? `Page ${currentPage} of ${totalPages} • Found ${movies?.length || 0} movies`
              : `Page ${currentPage} of ${totalPages} • Showing ${movies?.length || 0} movies`
            }
          </div>
        </>
      )}
    </div>
  );
};

export default AllMoviesView;
