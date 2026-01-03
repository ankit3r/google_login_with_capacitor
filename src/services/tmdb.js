import axios from 'axios';

const TMDB_API_KEY = 'd48151cc5542ca8f17f771590adb14fd'; 
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

export const tmdbService = {
  // Get popular movies
  getPopularMovies: () => tmdbApi.get('/movie/popular'),
  
  // Get trending movies
  getTrendingMovies: () => tmdbApi.get('/trending/movie/week'),
  
  // Get top rated movies
  getTopRatedMovies: () => tmdbApi.get('/movie/top_rated'),
  
  // Search movies
  searchMovies: (query) => tmdbApi.get('/search/movie', {
    params: { query }
  }),
  
  // Get movie details
  getMovieDetails: (movieId) => tmdbApi.get(`/movie/${movieId}`, {
    params: {
      append_to_response: 'videos,credits,reviews,similar'
    }
  }),
  
  // Get movie videos (trailers)
  getMovieVideos: (movieId) => tmdbApi.get(`/movie/${movieId}/videos`),
  
  // Get movie cast
  getMovieCredits: (movieId) => tmdbApi.get(`/movie/${movieId}/credits`),
  
  // Get movie reviews
  getMovieReviews: (movieId) => tmdbApi.get(`/movie/${movieId}/reviews`),
  
  // Get similar movies
  getSimilarMovies: (movieId) => tmdbApi.get(`/movie/${movieId}/similar`),
};

// Helper function to get full image URL
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export default tmdbService;