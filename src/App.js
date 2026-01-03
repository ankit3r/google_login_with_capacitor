import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './store';
import { checkAuthState } from './models/userSlice';
import LoginView from './views/LoginView';
import HomeView from './views/HomeView';
import MovieDetailsView from './views/MovieDetailsView';
import AllMoviesView from './views/AllMoviesView';
import ProtectedRoute from './controllers/ProtectedRoute';
import './App.css';

function AppContent() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    dispatch(checkAuthState()).finally(() => {
      setInitializing(false);
    });
  }, [dispatch]);

  if (initializing || loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ 
          color: 'white', 
          fontSize: '1.5rem',
          textAlign: 'center'
        }}>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <ProtectedRoute requireAuth={false}>
            <LoginView />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/home" 
        element={
          <ProtectedRoute requireAuth={true}>
            <HomeView />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/movie/:id" 
        element={
          <ProtectedRoute requireAuth={true}>
            <MovieDetailsView />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/movies/all" 
        element={
          <ProtectedRoute requireAuth={true}>
            <AllMoviesView />
          </ProtectedRoute>
        } 
      />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <AppContent />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
