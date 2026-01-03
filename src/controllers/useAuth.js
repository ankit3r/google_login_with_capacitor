import { useDispatch, useSelector } from 'react-redux';
import { loginWithGoogle, logoutUser, clearError } from '../models/userSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user);

  const login = () => dispatch(loginWithGoogle());
  const logout = () => dispatch(logoutUser());
  const clearAuthError = () => dispatch(clearError());

  return { user, loading, error, login, logout, clearAuthError };
};
