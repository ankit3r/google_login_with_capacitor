import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../models/userSlice';
import movieReducer from '../models/movieSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    movies: movieReducer,
  },
});
