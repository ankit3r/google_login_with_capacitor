import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const TMDB_API_KEY = 'd48151cc5542ca8f17f771590adb14fd';
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

// Fetch movies with page parameter
export const fetchPopularMovies = createAsyncThunk(
  'movies/fetchPopular',
  async (page = 1) => {
    const response = await tmdbApi.get('/movie/popular', {
      params: { page }
    });
    return { movies: response.data.results, page, totalPages: response.data.total_pages };
  }
);

export const fetchTrendingMovies = createAsyncThunk(
  'movies/fetchTrending',
  async (page = 1) => {
    const response = await tmdbApi.get('/trending/movie/week', {
      params: { page }
    });
    return { movies: response.data.results, page, totalPages: response.data.total_pages };
  }
);

export const fetchTopRatedMovies = createAsyncThunk(
  'movies/fetchTopRated',
  async (page = 1) => {
    const response = await tmdbApi.get('/movie/top_rated', {
      params: { page }
    });
    return { movies: response.data.results, page, totalPages: response.data.total_pages };
  }
);

export const searchMovies = createAsyncThunk(
  'movies/search',
  async ({ query, page = 1 }) => {
    const response = await tmdbApi.get('/search/movie', {
      params: { query, page }
    });
    return { movies: response.data.results, page, totalPages: response.data.total_pages };
  }
);

export const fetchMovieDetails = createAsyncThunk(
  'movies/fetchDetails',
  async (movieId) => {
    const response = await tmdbApi.get(`/movie/${movieId}`, {
      params: {
        append_to_response: 'videos,credits,similar,reviews'
      }
    });
    return response.data;
  }
);

const movieSlice = createSlice({
  name: 'movies',
  initialState: {
    popular: [],
    trending: [],
    topRated: [],
    searchResults: [],
    selectedMovie: null,
    comments: {},
    currentSearchQuery: '', // Add this
    loading: false,
    error: null,
    popularPage: 1,
    trendingPage: 1,
    topRatedPage: 1,
    searchPage: 1,
    popularTotalPages: 1,
    trendingTotalPages: 1,
    topRatedTotalPages: 1,
    searchTotalPages: 1,
  },
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchPage = 1;
      state.searchTotalPages = 1;
      state.currentSearchQuery = '';
    },
    clearSearch: (state) => {
      state.searchResults = [];
      state.searchPage = 1;
      state.searchTotalPages = 1;
      state.currentSearchQuery = '';
    },
    clearSelectedMovie: (state) => {
      state.selectedMovie = null;
    },
    addComment: (state, action) => {
      const { movieId, comment } = action.payload;
      if (!state.comments[movieId]) {
        state.comments[movieId] = [];
      }
      state.comments[movieId].push({
        id: Date.now(),
        text: comment,
        timestamp: new Date().toISOString(),
      });
    },
    setSearchQuery: (state, action) => {
      state.currentSearchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Popular Movies
      .addCase(fetchPopularMovies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPopularMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.popular = action.payload.movies;
        state.popularPage = action.payload.page;
        state.popularTotalPages = action.payload.totalPages;
      })
      .addCase(fetchPopularMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Trending Movies
      .addCase(fetchTrendingMovies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTrendingMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.trending = action.payload.movies;
        state.trendingPage = action.payload.page;
        state.trendingTotalPages = action.payload.totalPages;
      })
      .addCase(fetchTrendingMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Top Rated Movies
      .addCase(fetchTopRatedMovies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTopRatedMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.topRated = action.payload.movies;
        state.topRatedPage = action.payload.page;
        state.topRatedTotalPages = action.payload.totalPages;
      })
      .addCase(fetchTopRatedMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Search Movies
      .addCase(searchMovies.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.movies;
        state.searchPage = action.payload.page;
        state.searchTotalPages = action.payload.totalPages;
      })
      .addCase(searchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Movie Details
      .addCase(fetchMovieDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedMovie = action.payload;
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearSearchResults, clearSearch, clearSelectedMovie, addComment, setSearchQuery } = movieSlice.actions;
export default movieSlice.reducer;
