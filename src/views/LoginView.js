import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../controllers/useAuth';
import './LoginView.css';

const LoginView = () => {
  const { login, loading, error, clearAuthError } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    clearAuthError();
    await login();
    navigate('/home');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Welcome</h1>
        <p>Please sign in with Google</p>
        
        {error && (
          <div className="error-message">
            {error} <button onClick={clearAuthError}>×</button>
          </div>
        )}
        
        <button 
          className="google-login-btn"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </button>
      </div>
    </div>
  );
};

export default LoginView;
