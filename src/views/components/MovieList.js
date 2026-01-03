import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../../services/tmdb';
import './MovieList.css';
import ExportButton from './ExportButton';

const MovieList = ({ movies, title, category }) => {
  const navigate = useNavigate();

  if (!movies || movies.length === 0) return null;

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const handleViewMore = () => {
    navigate('/movies/all', { state: { category, title } });
  };

  return (
    <div className="movie-list-container">
      <div className="list-header">
        <h2>{title}</h2>
         {/* <ExportButton movies={movies} filename="search_results" /> */}
        <button onClick={handleViewMore} className="view-more-btn">
          View All
        </button>
      </div>
      <div className="movie-scroll-wrapper">
        <div className="movie-grid">
          {movies.slice(0, 20).map((movie) => (
            <div 
              key={movie.id} 
              className="movie-card"
              onClick={() => handleMovieClick(movie.id)}
            >
              <img
                src={getImageUrl(movie.poster_path, 'w300')}
                alt={movie.title}
                className="movie-poster"
              />
              <div className="movie-info">
                <h4>{movie.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieList;
