import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../controllers/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchPopularMovies, 
  fetchTrendingMovies, 
  fetchTopRatedMovies 
} from '../models/movieSlice';
import { Capacitor } from '@capacitor/core';
import MovieSlider from './components/MovieSlider';
import SearchBar from './components/SearchBar';
import MovieList from './components/MovieList';
import './HomeView.css';

const HomeView = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isNative = Capacitor.isNativePlatform();
  
  const { popular, trending, topRated, searchResults, loading } = useSelector(
    (state) => state.movies
  );

  useEffect(() => {
    dispatch(fetchPopularMovies(1));
    dispatch(fetchTrendingMovies(1));
    dispatch(fetchTopRatedMovies(1));
  }, [dispatch]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length >= 2) {
      return names[0][0] + names[1][0];
    }
    return name[0];
  };

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-user">
          <div className="profile-pic-wrapper-small">
            {user?.photoURL ? (
              <>
                <img 
                  src={user.photoURL} 
                  alt="Profile" 
                  className="profile-pic-small"
                  onError={handleImageError}
                />
                <div className="profile-pic-default-small" style={{ display: 'none' }}>
                  {getInitials(user.displayName || user.email)}
                </div>
              </>
            ) : (
              <div className="profile-pic-default-small">
                {getInitials(user?.displayName || user?.email)}
              </div>
            )}
          </div>
          <div className="header-info">
            <h2>Welcome back!</h2>
            <p>{user?.displayName || user?.email}</p>
          </div>
        </div>
        {!isNative && (
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        )}
      </header>

      <div className="content-wrapper">
        {loading ? (
          <div className="loading">Loading movies...</div>
        ) : (
          popular && popular.length > 0 && (
            <MovieSlider movies={popular} title="Popular Movies" />
          )
        )}

        <SearchBar />

        {searchResults && searchResults.length > 0 && (
          <div className="search-results-section">
            <div className="section-header">
              <h2>Search Results</h2>
            </div>
            <MovieList movies={searchResults} title="" category="search" showExport={false} />
          </div>
        )}

        {(!searchResults || searchResults.length === 0) && (
          <>
            {popular && popular.length > 0 && (
              <MovieList movies={popular} title="Popular Movies" category="popular" showExport={true} />
            )}
            
            {trending && trending.length > 0 && (
              <MovieList movies={trending} title="Trending This Week" category="trending" showExport={true} />
            )}
            
            {topRated && topRated.length > 0 && (
              <MovieList movies={topRated} title="Top Rated Movies" category="topRated" showExport={true} />
            )}
          </>
        )}
      </div>

      {isNative && (
        <div className="actions">
          <button onClick={handleLogout} className="logout-btn-mobile">
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default HomeView;
